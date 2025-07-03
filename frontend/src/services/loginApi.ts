import { fetchGraphQL } from "@/services/baseGraphqlApi";

export const loginApi = {
  // Standard login with email and password
  login: async (email: string, password: string) => {
    // If backend supports GraphQL login mutation, use it. Otherwise, fallback to REST.
    // Example GraphQL mutation (update if your backend expects a different structure):
    const mutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          message
          accessToken
          user {
            id
            email
          }
        }
      }
    `;
    try {
      const data = await fetchGraphQL(mutation, { email, password });
      return data.login;
    } catch (err) {
      throw err;
    }
  },

  // Google login (redirect)
  googleLogin: () => {
    window.location.href = "http://localhost:3000/auth/google";
  },
}; 