const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function fetchGraphQL(query: string, variables?: Record<string, unknown>) {
  
  // if(variables){
  //   if(variables.id){
  //     variables.id = Number(variables.id);
  //   }
  //   if(variables.input){
  //     variables.input.id = Number(variables.input.id);
  //   }
  // }
 // console.log("Final Payload:", JSON.stringify({ query, variables }, null, 2));

 
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
} 