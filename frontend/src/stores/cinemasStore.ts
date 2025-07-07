import { autorun, makeAutoObservable } from "mobx";
import { createCinemaApi } from "../services/cinemaApi";
import { cinema } from "./bookingStore";

export class CinemasStore {
  createdCinema: { id: number; totalScreens: number } | null = null;
  loading = false;
  error: string | null = null;
  showScreenModal = false;
  cinemaName = "";
  totalScreens = 1;
  cinemas: cinema[] = [];
  

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      
      setTimeout(() => {
        this.error = null;
      }, 3000);
    });
  }

  setCinemaName(name: string) {
    this.cinemaName = name;
  }

  setTotalScreens(num: number) {
    this.totalScreens = num;
  }

  resetForm() {
    this.cinemaName = "";
    this.totalScreens = 1;
  }

 
  async createCinema() {
    this.loading = true;
    this.error = null;
    try {
      const data = await createCinemaApi(this.cinemaName, this.totalScreens);
      this.createdCinema = data.createCinema;
      this.showScreenModal = true;
      this.resetForm();
    } catch (error: unknown) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;

    }
  }

  closeScreenModal() {
    this.showScreenModal = false;
    this.createdCinema = null;
  }
} 