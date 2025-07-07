import { autorun, makeAutoObservable, action } from "mobx";
import { getCinemasApi } from "../services/cinemaApi";
import { getSeatsApi, bookSeatApi } from "../services/SeatsApi";


interface user {
    id: number;
    email: string;
 }
interface seat {
    id: number;
    seatNumber: number;
    screen: screen;
    user: user;
}
export interface cinema {
    id: number;
    name: string;
    totalScreens: number;
    screens: screen[];
}
export interface screen {
    id: number;
    name: string;
    totalSeats: number;
    totalBooked: number;
    totalRemaining: number;
}


export class BookingStore {
    loading = false;
    error: string | null = null;
    success: boolean | null = null;
    selectedSeats: seat[] = [];
    currentScreen: screen | null = null;
    currentCinema: cinema | null = null;
    cinemas: cinema[] = [];
    seats: seat[] = []; // the seats that are booked for the current screen
    successMsg: string = ""; // Success message for UI feedback
    totalBooked: number = 0;
    totalRemaining: number = 0;
    totalSeats: number = 0;
    selectedSeatNumbers: number[] = []; // For multi-seat selection

    
    constructor() {
        makeAutoObservable(this);
        autorun(() => {
            console.log(this.currentScreen)
        });
    }

    setCurrentCinema = action((cinema: cinema | null) => {
        this.currentCinema = cinema;
        this.currentScreen = null; // Reset screen when cinema changes
    });

    setCurrentScreen = action((screen: screen | null) => {
        this.currentScreen = screen;
    });

    async fetchCinemas() {
        this.loading = true;
        this.error = null;
        try {
            const data = await getCinemasApi();
            this.cinemas = data.getAllCinemas || [];
            
        } catch (error: unknown) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }
    async fetchSeats() {
        this.loading = true;
        this.error = null;
        this.totalBooked = this.currentScreen!.totalBooked;
        this.totalRemaining = this.currentScreen!.totalRemaining;
        this.totalSeats = this.currentScreen!.totalSeats;
        try {
            if (this.currentScreen) {
                const data = await getSeatsApi(this.currentScreen.id!);
                this.seats = data.getSeats || [];
            }
        } catch (error: unknown) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    bookSeat = action(async (seatNumber: number) => {
        const seat = this.seats.find(s => s.seatNumber === seatNumber);
        if (seat || !this.currentScreen) return;
        this.totalBooked++;
        this.totalRemaining--;
        this.loading = true;
        try {
            const data = await bookSeatApi(seatNumber, this.currentScreen.id);
            if (data.bookSeat) {
                this.seats.push(data.bookSeat);
                this.successMsg = `Seat ${seatNumber} booked successfully!`;
                setTimeout(() => this.clearSuccessMsg(), 2000);
            }
        } catch (e: unknown) {
            this.error = (e as Error).message;
        } finally {
            this.loading = false;
        }
    });

    clearSuccessMsg = action(() => {
        this.successMsg = "";
    });
    clearAll = action(() => {
        this.currentCinema = null;
        this.currentScreen = null;
        this.selectedSeatNumbers = [];
        this.seats = [];
        this.successMsg = "";
        this.error = null;
    });

    // Toggle seat selection
    toggleSeatSelection = action((seatNumber: number) => {
        if (this.selectedSeatNumbers.includes(seatNumber)) {
            this.selectedSeatNumbers = this.selectedSeatNumbers.filter(n => n !== seatNumber);
        } else {
            this.selectedSeatNumbers = [...this.selectedSeatNumbers, seatNumber];
        }
    });

    // Clear all selected seats
    clearSelectedSeats = action(() => {
        this.selectedSeatNumbers = [];
    });

    // Book all selected seats
    bookSelectedSeats = action(async () => {
        this.loading = true;
        try {
            for (const seatNumber of this.selectedSeatNumbers) {
                await this.bookSeat(seatNumber);
            }
            this.successMsg = `Booked seats: ${this.selectedSeatNumbers.join(", ")}`;
            this.clearSelectedSeats();
        } catch (error: unknown) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    });
}
