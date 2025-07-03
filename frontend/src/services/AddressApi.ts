import { fetchGraphQL } from "@/services/baseGraphqlApi";

export async function getAddress() {
  const query = `
    query GetAddress {
      getAddress {
        houseNumber
        street
        town
        city
        state
        country
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.getAddress;
}

export async function saveAddress(address: any) {
  const mutation = `
    mutation SaveAddress($address: AddressInput!) {
      saveAddress(address: $address) 
    }
  `;
  const data = await fetchGraphQL(mutation, { address });
  return data.saveAddress;
}

export async function updateAddress(address: any) {
  const mutation = `
    mutation UpdateAddress($address: AddressInput!) {
      updateAddress(address: $address)
    }`;
  const data = await fetchGraphQL(mutation, { address });
  return data;
} 