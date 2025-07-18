import { makeAutoObservable, runInAction, action } from "mobx";
import { loginApi } from "@/services/loginApi";

interface User {
  id: number;
  email: string;
  name: string;
}

export class LoginStore {
  email: string = "";
  password: string = "";
  loading: boolean = false;
  error: string | null = null;
  user: User | null = null;

  constructor() {
    makeAutoObservable(this, {
      setEmail: action,
      setPassword: action,
      login: action,
      googleLogin: action,
      setError: action,
      setUser: action,
    });
  }

  setEmail = (email: string) => {
    this.email = email;
  };

  setPassword = (password: string) => {
    this.password = password;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  setUser = (user: User) => {
    this.user = user;
  };

  login = async () => {
    this.loading = true;
    this.error = null;
    try {
      const user = await loginApi.login(this.email, this.password);
      runInAction(() => {
        this.user = user;
        this.loading = false;
      });
      return user;
    } catch (error: unknown) {
      runInAction(() => {
        this.error = (error as Error).message || "Invalid credentials";
        this.loading = false;
      });
      throw error;
    }
  };

  googleLogin = () => {
    loginApi.googleLogin();
  };
}

export const loginStore = new LoginStore(); 