import { enrollmentsApi } from "@/services/enrollmentsApi";
import { makeAutoObservable, action, computed, autorun, observable, runInAction } from "mobx";

export interface User {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface Course {
  id: number;
  name: string;
}

export interface Enrollment {
  id: number;
  user: User;
  course: Course;
  grade?: string;
}

export class EnrollmentsStore {
  enrollments: Enrollment[] = [];
  users: User[] = [];
  courses: Course[] = [];
  loading: boolean = false;
  error: string | null = null;
  successMsg: string | null = null;
  form: { userId: number | null; courseId: number | null } = { userId: null, courseId: null };
  gradeEdit: { id: number; grade: string } | null = null;

  constructor() {
    makeAutoObservable(this, {
      loadAll: action,
      createEnrollment: action,
      deleteEnrollment: action,
      updateGrade: action,
      setForm: action,
      setGradeEdit: action,
      enrollments: observable,
      users: observable,
      courses: observable,
      loading: observable,
      error: observable,
      successMsg: observable,
      form: observable,
      gradeEdit: observable,
      filteredEnrollments: computed,
    });
    autorun(() => {
      if (this.successMsg) {
        setTimeout(() => {
          this.successMsg = null;
        }, 2000);
      }
      if (this.error) {
        setTimeout(() => {
          this.error = null;
        }, 2000);
      }
    });
  }

  get filteredEnrollments() {
    return this.enrollments;
  }

  loadAll = async () => {
    this.loading = true;
    try {
      const [users, courses, enrollments] = await Promise.all([
        enrollmentsApi.getActiveUsers(),
        enrollmentsApi.getActiveCourses(),
        enrollmentsApi.getAllEnrollments(),
      ]);
      runInAction(() => {
        this.users = users;
        this.courses = courses;
        this.enrollments = enrollments;
        this.loading = false;
      });
    } catch (error: unknown) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to load data";
        this.loading = false;
      });
    }
  };

  createEnrollment = async () => {
    if (!this.form.userId || !this.form.courseId) return;
    this.error = null;
    try {
      await enrollmentsApi.createEnrollment({ userId: this.form.userId, courseId: this.form.courseId });
      runInAction(() => {
        this.successMsg = "Enrollment created successfully.";
        this.form = { userId: null, courseId: null };
      });
      await this.loadAll();
    } catch (error: unknown) {
      runInAction(() => {
        if (error instanceof Error && error.message === "Enrollment already exists") {
          this.error = "Enrollment already exists for this user and course.";
        } else {
          this.error = "Failed to create enrollment.";
        }
      });
    }
  };

  deleteEnrollment = async (id: number) => {
    try {
      await enrollmentsApi.deleteEnrollment(id);
      runInAction(() => {
        this.successMsg = "Enrollment deleted successfully.";
      });
      await this.loadAll();
    } catch (error: unknown) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to delete enrollment.";
      });
    }
  };

  setForm = (userId: number | null, courseId: number | null) => {
    this.form = { userId, courseId };
  };

  setGradeEdit = (id: number, grade: string) => {
    this.gradeEdit = { id, grade };
  };

  updateGrade = async () => {
    if (!this.gradeEdit) return;
    try {
      await enrollmentsApi.updateGrade(this.gradeEdit.id, this.gradeEdit.grade);
      runInAction(() => {
        this.successMsg = "Grade updated successfully.";
        this.gradeEdit = null;
      });
      await this.loadAll();
    } catch (error: unknown) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to update grade.";
      });
    }
  };
} 