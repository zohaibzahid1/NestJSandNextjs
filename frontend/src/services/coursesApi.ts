import baseApi from "./baseApi";

export const coursesApi = {
    getAllCourses: async () => {
        const response = await baseApi.get("/courses/get-all-courses");
        return response.data;
    },
    softDeleteCourse: async (id: number) => {
        const response = await baseApi.delete(`/courses/soft-delete-course/${id}`);
        return response.data;
    },
    hardDeleteCourse: async (id: number) => {
        const response = await baseApi.delete(`/courses/hard-delete-course/${id}`);
        return response.data;
    },
    restoreCourse: async (id: number) => {
        const response = await baseApi.patch(`/courses/restore-course/${id}`);
        return response.data;
    },
    updateCourse: async (id: number, {name, description}: {name: string, description: string}) => {
        const response = await baseApi.patch(`/courses/update-course/${id}`, {name, description});
        return response.data;
    },
    createCourse: async ({name, description}: {name: string, description: string}) => {
        const response = await baseApi.post("/courses/create-course", {name, description});
        return response.data;
    },
}