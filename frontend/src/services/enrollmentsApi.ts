import baseApi from "./baseApi";

export const enrollmentsApi = {
  getAllEnrollments: async () => {
    const response = await baseApi.get("/enrollments/get-enrollments");
    return response.data;
  },
  createEnrollment: async ({ userId, courseId }: { userId: number; courseId: number }) => {
    const response = await baseApi.post("/enrollments/create-enrollment", { userId, courseId });
    return response.data;
  },
  deleteEnrollment: async (id: number) => {
    const response = await baseApi.delete(`/enrollments/delete-enrollment/${id}`);
    return response.data;
  },
  updateGrade: async (id: number, grade: string) => {
    const response = await baseApi.patch(`/enrollments/update-grade/${id}`, { grade });
    return response.data;
  },
  getActiveUsers: async () => {
    const response = await baseApi.get("/users/get-active-users");
    return response.data;
  },
  getActiveCourses: async () => {
    const response = await baseApi.get("/courses/get-active-courses");
    return response.data;
  },
}; 