import { usersApi, getMyBookingsApi } from "@/services/usersApi";
import { action, autorun, computed, makeAutoObservable, observable, runInAction } from "mobx";
import { screen } from "./bookingStore";

// attributes that we need to display in the UI
interface User {
    id: number;
    name: string;
    email: string;
    deletedAt?: string | null;
}
export interface Booking {
    id: number;
    screen: screen;
    seatNumber: number;
}

export class UserStore {

    users: User[] = [];
    loading: boolean = false;
    error: string | null = null;
    success: string | null = null;
    showWithDeleted: boolean = true;    
    myBookings = [];
    loadingBookings = false;
    bookingsError: string | null = null;
    
    constructor() {
        makeAutoObservable(this, {
            changeShowWithDeleted: action, 
            filteredUsers: computed, // is computed everytime the showWithDeleted changes
            success: observable,
        });
        // set the success and error messages null after 2 seconds and since it displays when they are not null this way we can remove the msg after 2 sec
        autorun(() => {
            if(this.success){
                setTimeout(() => {
                    this.success = null;
                }, 2000);
            }
            if(this.error){
                setTimeout(() => {
                    this.error = null;
                }, 2000);
            }
        });
    
    }

    // display the users based on the showWithDeleted state
    get filteredUsers(): User[] { // computed property can be accessed like a normal property
        return this.showWithDeleted
            ? this.users
            : this.users.filter(user => !user.deletedAt);
    }
    // load the users from the backend
    loadUsers = async () => {
        this.loading = true;
        try {
            const data = await usersApi.getAllUsers();
            console.log(data);
            runInAction(() => {
                this.users = data;
                this.loading = false;
            });
            console.log(this.users);
        } catch (error: unknown) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : "An unknown error occurred";
                this.loading = false;
            });
        }
    }

    // soft delete the user
    softDeleteUser = async (id: number) => {
        this.loading = true;
        try {
            await usersApi.softDeleteUser(id); // soft deleted at backend
            runInAction(() => {
                this.success = "User soft deleted successfully";
                this.users = this.users.map(user => user.id === id ? { ...user, deletedAt: new Date().toISOString() } : user); // update the user in the store
            });
            console.log(this.users);
        } catch (error: unknown) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : "An unknown error occurred";
                this.loading = false;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
                this.error = null;
            });
        }
    }

    // hard delete the user
    hardDeleteUser = async (id: number) => {
        this.loading = true;
        try {
            await usersApi.hardDeleteUser(id); // hard deleted at backend
            
            runInAction(() => {
                this.users = this.users.filter(user => user.id !== id); // remove the user from the store
                this.success = "User hard deleted successfully";
            });
        } catch (error: unknown) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : "An unknown error occurred";
                this.loading = false;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
                this.error = null;
            });
        }
    }

    // restore the user
    restoreUser = async (id: number) => {
        this.loading = true;
        try {
            await usersApi.restoreUser(id); // restored at backend
            runInAction(() => {
                this.users = this.users.map(user => user.id === id ? { ...user, deletedAt: null } : user); // update the user in the store
                this.success = "User restored successfully";
            });
        } catch (error: unknown) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : "An unknown error occurred";
                this.loading = false;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
                this.error = null;
            });
        }
    }

    // change the showWithDeleted state || filtered users Depend on this state !
    changeShowWithDeleted = () => {
        this.showWithDeleted = !this.showWithDeleted;
    }

    // Fetch the current user's bookings
    fetchMyBookings = async () => {
        this.loadingBookings = true;
        this.bookingsError = null;
        try {
            const data = await getMyBookingsApi();
            this.myBookings = data.myBookings || [];
        } catch (e) {
            this.bookingsError = e instanceof Error ? e.message : String(e);
        } finally {
            this.loadingBookings = false;
        }
    };
}