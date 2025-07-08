import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';



export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  console.log("token:: ",token);
  // Protect these routes
  const protectedRoutes = ['/dfs']; // add more routes here
  // i have added temprorary route here address is not being verified 
  
  const isProtected = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );
  console.log("isProtected:: ",isProtected);
  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        // call a backend api to verify the token using axios
        await axios.post(`${process.env.NEXT_PUBLIC_DEPLOYED_URL}/auth/verify-token`, { token });     
    } catch (err) {
        console.log("err:: ",err);
      return NextResponse.redirect(new URL('/login', req.url));
      
    }
  }
  return NextResponse.next();
}

