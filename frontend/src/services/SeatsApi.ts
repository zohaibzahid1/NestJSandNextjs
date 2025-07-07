import { fetchGraphQL } from "./baseGraphqlApi";

export async function getSeatsApi(screenId: number) {
  const query = `
    query GetSeats($screenId: Int!) {
      getSeats(screenId: $screenId) {
        id
        seatNumber
        user { id }
      }
    }
  `;
  return fetchGraphQL(query, { screenId });
}

export async function bookSeatApi(seatNumber: number, screenId: number) {
  console.log("bookSeatApi");
  const mutation = `
    mutation bookSeat($input: BookSeatInput!) {
      bookSeat(input: $input) {
        id
        seatNumber
        
        user { id }
      }
    }
  `;
  return fetchGraphQL(mutation, { input: { screenId: screenId, seatNumber: seatNumber } });
}