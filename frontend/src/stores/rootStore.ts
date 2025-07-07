import { UserStore } from "./userStore";
import { makeAutoObservable } from "mobx";
import { CourseStore } from "./courseStore";
import { EnrollmentsStore } from "./enrollmentsStore";
import { CinemasStore } from "./cinemasStore";
import { ScreensStore } from "./screensStore";
import { BookingStore } from "./bookingStore";

export class RootStore {
    userStore: UserStore;
    courseStore: CourseStore;
    enrollmentsStore: EnrollmentsStore;
    cinemasStore: CinemasStore;
    screensStore: ScreensStore;
    bookingStore: BookingStore;
    constructor() {
        this.userStore = new UserStore();
        this.courseStore = new CourseStore();
        this.enrollmentsStore = new EnrollmentsStore();
        this.cinemasStore = new CinemasStore();
        this.screensStore = new ScreensStore();
        this.bookingStore = new BookingStore();
        makeAutoObservable(this);
    }

}
