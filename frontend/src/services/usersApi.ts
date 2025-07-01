import baseApi from "./baseApi";
export const usersApi = {
    getAllUsers: async () => {
        const response = await baseApi.get("/users/get-all-users");
        return response.data;
    },
    softDeleteUser: async (id: number) => {
        const response = await baseApi.delete(`/users/soft-delete-user/${id}`);
        return response.data;
    },
    hardDeleteUser: async (id: number) => {
        const response = await baseApi.delete(`/users/hard-delete-user/${id}`);
        return response.data;
    },
    restoreUser: async (id: number) => {
        const response = await baseApi.patch(`/users/restore-user/${id}`);
        return response.data;
    },
    
}