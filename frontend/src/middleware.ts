import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';



export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  
  // Protect these routes
  const protectedRoutes = ['/address']; // add more routes here

  
  const isProtected = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );

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

