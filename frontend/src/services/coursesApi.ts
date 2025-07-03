import { fetchGraphQL } from "@/services/baseGraphqlApi";

export async function getActiveCourses() {
  const query = `
    query GetActiveCourses {
      getActiveCourses {
        id
        name
        description
        createdAt
        deletedAt
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.getActiveCourses;
}

export async function getAllCourses() {
  const query = `
    query GetAllCourses {
      getAllCourses {
        id
        name
        description
        createdAt
        deletedAt
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.getAllCourses;
}

export async function createCourse(input: { name: string; description: string }) {
  const mutation = `
    mutation CreateCourse($input: CreateCourseInput!) {
      createCourse(input: $input) {
        id
        name
        description
        createdAt
        deletedAt
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { input });
  return data.createCourse;
}

export async function updateCourse(id: number, input: { name?: string; description?: string }) {
  const mutation = `
    mutation UpdateCourse($id: Int!, $input: UpdateCourseInput!) {
      updateCourse(id: $id, input: $input) {
        id
        name
        description
        createdAt
        deletedAt
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { id, input });
  return data.updateCourse;
}

export async function softDeleteCourse(id: number) {
  const mutation = `
    mutation SoftDeleteCourse($id: Int!) {
      softDeleteCourse(id: $id)
    }
  `;
  const data = await fetchGraphQL(mutation, { id });
  return data.softDeleteCourse;
}

export async function restoreCourse(id: number) {
  const mutation = `
    mutation RestoreCourse($id: Int!) {
      restoreCourse(id: $id)
    }
  `;
  const data = await fetchGraphQL(mutation, { id });
  return data.restoreCourse;
}

export async function hardDeleteCourse(id: number) {
  const mutation = `
    mutation HardDeleteCourse($id: Int!) {
      hardDeleteCourse(id: $id)
    }
  `;
  const data = await fetchGraphQL(mutation, { id });
  return data.hardDeleteCourse;
}