import { fetchGraphQL } from "@/services/baseGraphqlApi";

// Get all enrollments
export async function getAllEnrollments() {
  const query = `
    query GetEnrollments {
      getEnrollments {
        id
        grade
        user { id firstName lastName email }
        course { id name }
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.getEnrollments;
}

// Create enrollment
export async function createEnrollment(input: { userId: number; courseId: number }) {
  const mutation = `
    mutation CreateEnrollment($input: CreateEnrollmentInput!) {
      createEnrollment(input: $input) {
        id
        grade
        user { id firstName lastName email }
        course { id name }
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { input });
  return data.createEnrollment;
}

// Delete enrollment
export async function deleteEnrollment(id: number) {
  
  const mutation = `
    mutation DeleteEnrollment($id: Int!) {
      deleteEnrollment(id: $id)
    } 
  `;
  const data = await fetchGraphQL(mutation, { id });
  return data.deleteEnrollment;
}

// Update grade
export async function updateGrade(input: {id: number, grade: string}) {
 
  const mutation = `
    mutation UpdateGrade($input: UpdateGradeInput!) {
      updateGrade(input: $input) {
        id
        grade
        user { id firstName lastName email }
        course { id name }
      }
    }
  `;

  const data = await fetchGraphQL(mutation, {input});
  return data.updateGrade;
}

// Get all users (for dropdown)
export async function getActiveUsers() {
  const query = `
    query GetActiveUsers {
      getActiveUsers {
        id
        firstName
        lastName
        email
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.getActiveUsers;
}

// Get all courses (for dropdown)
export async function getActiveCourses() {
  const query = `
    query GetActiveCourses {
      getActiveCourses {
        id
        name
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.getActiveCourses;
} 