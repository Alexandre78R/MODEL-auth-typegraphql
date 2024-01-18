import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { setTimeout } from "timers";

interface Payload {
  email: string;
  role: string;
}

const SECRET_KEY = process.env.SECRET_KEY || "";

export default async function middleware(request: NextRequest) {
  const { cookies } = request;
  const token = cookies.get("token");
  
  setTimeout( async () => {
    return await checkToken(token?.value, request);
  }, 5000)
}

export async function verify(token: string): Promise<Payload> {
  const { payload } = await jwtVerify<Payload>(
    token,
    new TextEncoder().encode(SECRET_KEY)
  );
  return payload;
}

async function checkToken(token: string | undefined, request: NextRequest) {
  // let response: NextResponse<unknown>;
  let response: NextResponse<unknown> = NextResponse.next();
  // if (!token) {
  //   response.cookies.delete("email");
  //   response.cookies.delete("role");
  //   return NextResponse.redirect(new URL("/auth/login", request.url));

  // }

  console.log("token", token);
  
  
  //   if (!token) {
  //   if (
  //     request.nextUrl.pathname.startsWith("/books/list") ||
  //     request.nextUrl.pathname.startsWith("/admin/books")
  //   ) {
  //     console.log("book list")
  //     // response = NextResponse.redirect(new URL("/auth/login", request.url));
  //   } else {
  //     response = NextResponse.next();
  //   }
    
  //   // response.cookies.delete("email");
  //   // response.cookies.delete("role");
  //   return response;
  // }
  // console.log()
  // response.cookies.delete("toto");
  if (!token) {
    console.log('j ai pas de token')
    // if (
    //   request.nextUrl.pathname.startsWith("/books/list") ||
    //   request.nextUrl.pathname.startsWith("/admin/books")
    // ) {
    //   console.log("book list")
    //   // response = NextResponse.redirect(new URL("/auth/login", request.url));
    // } else {
    //   // response = NextResponse.next();
    // }
    
    // // response.cookies.delete("email");
    // // response.cookies.delete("role");
    // console.log("toto")
    // return response;
    // if (request.nextUrl.pathname === "/books/list") {
      if (request.nextUrl.pathname.startsWith("/books/list")) {
      // console.log("je suis bien sur la route", request.nextUrl.pathname)
      // response = NextResponse.redirect(new URL("/auth/login", request.url)); 
      console.log("Je suis bien sur la route", request.nextUrl.pathname);
      console.log("Redirection vers /auth/login");
      response = NextResponse.redirect(new URL("/auth/login", request.url));
      // return new NextResponse(null, {
      //   status: 302,
      //   headers: {
      //     Location: "/auth/login",
      //   },
      // });
      // return NextResponse.redirect(new URL("/auth/login", `https://${request.nextUrl.host}`)); 
    }

    // console.log("kdsnkdsnsdkndkdnsksdndf")
    console.log(response)
    return response
  }

  try {
    const payload = await verify(token);
    
    console.log(payload)
    if (payload?.email) {
      console.log("toto")
      response = NextResponse.next();
      return response;
    }
    console.log("tata")
    response.cookies.set("email", payload.email);
		return NextResponse.redirect(new URL("/auth/login", request.url));
    
  } catch (err) {
    console.error("Verification failed", err);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: "/:path*",
};

// export const config = {
//   matcher: "/books/list/:path*",
// };