import { UserStore } from "./userStore";
import { makeAutoObservable } from "mobx";
import { CourseStore } from "./courseStore";
import { EnrollmentsStore } from "./enrollmentsStore";

export class RootStore {
    userStore: UserStore;
    courseStore: CourseStore;
    enrollmentsStore: EnrollmentsStore;
    constructor() {
        this.userStore = new UserStore();
        this.courseStore = new CourseStore();
        this.enrollmentsStore = new EnrollmentsStore();
        makeAutoObservable(this);
    }

}
