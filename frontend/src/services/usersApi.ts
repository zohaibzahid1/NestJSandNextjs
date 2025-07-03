import { fetchGraphQL } from "@/services/baseGraphqlApi";

export const usersApi = {
    getAllUsers: async () => {
        const query = `
            query GetAllUsers {
                getAllUsers {
                    id
                    email
                    firstName
                    lastName
                    deletedAt
                    createdAt
                }
            }
        `;
        const data = await fetchGraphQL(query);
        return data.getAllUsers;
    },
    softDeleteUser: async (id: number) => {
        const mutation = `
            mutation SoftDeleteUser($id: Int!) {
                softDeleteUser(id: $id)
            }
        `;
        const data = await fetchGraphQL(mutation, { id: Number(id) });
        return data.softDeleteUser;
    },
    hardDeleteUser: async (id: number) => {
        const mutation = `
            mutation HardDeleteUser($id: Int!) {
                hardDeleteUser(id: $id)
            }
        `;
        const data = await fetchGraphQL(mutation, { id: Number(id) });
        return data.hardDeleteUser;
    },
    restoreUser: async (id: number) => {
        const mutation = `
            mutation RestoreUser($id: Int!) {
                restoreUser(id: $id)
            }
        `;
        const data = await fetchGraphQL(mutation, { id: Number(id) });
        return data.restoreUser;
    },
}