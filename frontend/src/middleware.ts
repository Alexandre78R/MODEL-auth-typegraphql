import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface Payload {
  email: string;
  role: string;
}

const SECRET_KEY = process.env.SECRET_KEY || "";

export default async function middleware(request: NextRequest) {
  const { cookies } = request;
  const token = cookies.get("token");
  
  return await checkToken(token?.value, request);
}

export async function verify(token: string): Promise<Payload> {
  const { payload } = await jwtVerify<Payload>(
    token,
    new TextEncoder().encode(SECRET_KEY)
  );
  return payload;
}

async function checkToken(token: string | undefined, request: NextRequest) {
  let response: NextResponse<unknown> = NextResponse.next();
  console.log(token)
  if (request.nextUrl.pathname.startsWith("/auth/logout")) {
    response.cookies.delete("email");
    response.cookies.delete("role");
    console.log("je suis déconnecté")
    response = NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!token) {
    console.log("toto")
    if (
      request.nextUrl.pathname.startsWith("/books/list") ||
      request.nextUrl.pathname.startsWith("/admin/books")
    ) {
      console.log("admin book c sxs")
      response = NextResponse.redirect(new URL("/auth/login", request.url));
    } else {
      response = NextResponse.next();
    }
    
    response.cookies.delete("email");
    response.cookies.delete("role");
    return response;
  }
  
  try {
    const payload = await verify(token);
    console.log(payload)
    if (payload.email && payload.role) {
      response = NextResponse.next();
      //vérifier si la route commence par admin, et que le payload.role n'est pas admin, je redirige
      if (
        request.nextUrl.pathname.startsWith("/admin/books") &&
        payload.role !== "ADMIN"
      ) {
        response = NextResponse.redirect(new URL("/400", request.url));
      }

      response.cookies.set("email", payload.email);
      response.cookies.set("role", payload.role);

      return response;
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } catch (err) {
    console.error("Verification failed", err);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// export const config = {
//   matcher: "/books/list/:path*",
// };
export const config = {
  matcher: "/:path*",
};
