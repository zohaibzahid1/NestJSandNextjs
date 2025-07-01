import { coursesApi } from "@/services/coursesApi";
import { makeAutoObservable, action, computed, autorun, observable } from "mobx";

interface Course {
    id: number;
    name: string;
    description: string;
    deletedAt?: string | null;
}

export class CourseStore {
    courses: Course[] = [];
    loading: boolean = false;
    error: string | null = null;
    success: string | null = null;
    showWithDeleted: boolean = false;
    showCreate: boolean = false;
    showEdit: number | null = null;
    form: {name: string, description: string} = {name: "", description: ""};
    formError: string | null = null;
    successMsg: string | null = null;

    constructor(){
        makeAutoObservable(this, {
            loadCourses: action,
            softDeleteCourse: action,
            hardDeleteCourse: action,
            restoreCourse: action,
            updateCourse: action,
            createCourse: action,
            changeShowWithDeleted: action,
            handleEdit: action,
            handleUpdate: action,
            handleCreate: action,
            courses: observable,
            loading: observable,
            error: observable,
            success: observable,
            showWithDeleted: observable,
            showCreate: observable,
            showEdit: observable,
            form: observable,
            formError: observable,
            successMsg: observable,
            filteredCourses: computed,
        });
        autorun(() => {
            if(this.successMsg){
                setTimeout(() => {
                    this.successMsg = null;
                }, 2000);
            }
            if(this.error){
                setTimeout(() => {
                    this.error = null;
                }, 2000);
            }
        });
    }

    get filteredCourses(): Course[] {
        return this.showWithDeleted
            ? this.courses
            : this.courses.filter(course => !course.deletedAt);
    }

    validateForm = () => {
        if (!this.form.name.trim()) return "Title is required.";
        if (!this.form.description.trim()) return "Description is required.";
        return null;
    }

    handleEdit = (course: Course) => {
        this.showEdit = course.id;
        this.form = { name: course.name, description: course.description };
        this.formError = null;
        this.successMsg = null;
    }

    handleUpdate = async (id: number) => {
        const error = this.validateForm();
        if (error) {
            this.formError = error;
            return;
        }
        this.formError = null;
        await this.updateCourse(id, this.form);
        if (this.error) return;
        this.showEdit = null;
        this.form = { name: "", description: "" };
        this.successMsg = "Course updated successfully.";
        await this.loadCourses();
    }

    handleCreate = async () => {
        const error = this.validateForm();
        if (error) {
            this.formError = error;
            return;
        }
        this.formError = null;
        await this.createCourse(this.form);
        if (this.error) return;
        this.showCreate = false;
        this.form = { name: "", description: "" };
        this.successMsg = "Course created successfully.";
        await this.loadCourses();
    }

    loadCourses = async () => {
        try {
            this.loading = true;
            const courses = await coursesApi.getAllCourses();
            this.courses = courses;
        } catch (error) {
            this.error = "Error loading courses";
            console.log("error:: ",error);
        } finally {
            this.loading = false;
        }
    }

    changeShowWithDeleted = () => {
        this.showWithDeleted = !this.showWithDeleted;
    }

    softDeleteCourse = async (id: number) => {
        try {
            await coursesApi.softDeleteCourse(id);
            this.courses.find(course => course.id === id)!.deletedAt = new Date().toISOString();
            this.successMsg = "Course deleted successfully";
        } catch (error) {
            this.error = "Failed to delete course";
            console.log("error:: ",error);
        }
    }

    hardDeleteCourse = async (id: number) => {
        try {
            await coursesApi.hardDeleteCourse(id);
            this.courses = this.courses.filter(course => course.id !== id);
            this.successMsg = "Course deleted successfully";
        } catch (error) {
            this.error = "Failed to delete course";
            console.log("error:: ",error);
        }
    }

    restoreCourse = async (id: number) => {
        try {
            await coursesApi.restoreCourse(id);
            this.courses.find(course => course.id === id)!.deletedAt = null;
            this.successMsg = "Course restored successfully";
        } catch (error) {
            this.error = "Failed to restore course";
            console.log("error:: ",error);
        }
    }

    updateCourse = async (id: number, {name, description}: {name: string, description: string}) => {
        try {
            await coursesApi.updateCourse(id, {name, description});
            this.successMsg = "Course updated successfully";
        } catch (error: unknown) {
            if (error instanceof Error && error.message === "Course not found") {
                this.error = "Course not found";
            } else {
                this.error = "Failed to update course";
                console.log("error:: ",error);
            }
        }
    }

    createCourse = async ({name, description}: {name: string, description: string}) => {
        try {
            await coursesApi.createCourse({name, description});
            this.successMsg = "Course created successfully";
        } catch (error) {
            this.error = "Failed to create course";
            console.log("error:: ",error);
        }
    }
}
