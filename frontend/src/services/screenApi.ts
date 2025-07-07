import { fetchGraphQL } from "./baseGraphqlApi";

export async function createScreenApi(name: string, totalSeats: number, cinemaId: number) {
  const mutation = `
    mutation CreateScreen($input: CreateScreenInput!) {
      createScreen(input: $input) {
        id
        name
        totalSeats
        cinema { id }
      }
    }
  `;
  return fetchGraphQL(mutation, { input: { name, totalSeats, cinemaId } });
} 