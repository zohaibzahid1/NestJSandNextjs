import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  // Parse the request body (GraphQL query and variables)
  const body = await req.json();

  try {
    // Forward the GraphQL login mutation to the backend GraphQL endpoint
    const backendRes = await axios.post(
      process.env.NEXT_PUBLIC_DEPLOYED_URL + '/graphql',
      body,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    // Extract Set-Cookie headers from backend response
    const setCookie = backendRes.headers['set-cookie'];

    // Create a NextResponse with the backend response data
    const response = NextResponse.json(backendRes.data, {
      status: backendRes.status,
    });

    // Forward all Set-Cookie headers to the client
    if (setCookie) {
      if (Array.isArray(setCookie)) {
        setCookie.forEach((cookie) => {
          response.headers.append('set-cookie', cookie);
        });
      } else {
        response.headers.set('set-cookie', setCookie);
      }
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || 'Login failed' },
      { status: error.response?.status || 500 }
    );
  }
} 