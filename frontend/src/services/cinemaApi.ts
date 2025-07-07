import { fetchGraphQL } from "./baseGraphqlApi";

// Service for cinema-related API calls
export async function createCinemaApi(name: string, totalScreens: number) {
  const mutation = `
    mutation CreateCinema($input: CreateCinemaInput!) {
      createCinema(input: $input) {
        id
        totalScreens
      }
    }
  `;
  return fetchGraphQL(mutation, { input: { name, totalScreens } });
}

// Fetch all cinemas
export async function getCinemasApi() {
  const query = `
    query GetAllCinemas {
      getAllCinemas {
        id
        name
        totalScreens
        screens {
          id
          name
          totalSeats
          totalBooked
          totalRemaining
        }
      }
    }
  `;
  return fetchGraphQL(query);
}