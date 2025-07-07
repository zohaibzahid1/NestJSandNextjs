import { autorun, makeAutoObservable } from "mobx";
import { createScreenApi } from "../services/screenApi";
import { screen } from "./bookingStore";

export class ScreensStore {
  createdScreens: screen[] = [];
  loading = false;
  error: string | null = null;
  currentScreenIndex = 0;
  success: boolean | null = null;
  screenName = "";
  totalSeats = 1;

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      setTimeout(() => {
        if(this.success){
          this.success = false;
        }
      }, 1000);
      setTimeout(() => {
        if(this.error){
          this.error = null;
        }
      }, 3000);
    });
  }

  setScreenName(name: string) {
    this.screenName = name;
  }

  setTotalSeats(num: number) {
    this.totalSeats = num;
  }

  resetProgress() {
    this.currentScreenIndex = 0;
    this.createdScreens = [];
    this.success = false;
    this.error = null;
    this.screenName = "";
    this.totalSeats = 1;
  }

  async createScreen(cinemaId: number) {
    this.loading = true;
    this.error = null;
    try {
      const data = await createScreenApi(this.screenName, this.totalSeats, cinemaId);
      this.createdScreens.push(data.createScreen);
      this.currentScreenIndex++;
      this.screenName = "";
      this.totalSeats = 1;
    } catch (error: unknown) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  setSuccess() {
    this.success = true;
  }
} 