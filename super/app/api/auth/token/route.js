import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';

const secret = process.env.JWT_SECRET;

async function handler(req) {
  try {
    // Retrieve the token from the request
    const token = await getToken({ req, secret });

    if (!token) {
      // If no token is found, return an unauthorized NextResponseponse
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Token found, proceed with the request
    console.log("User token:", token);

    return NextResponse.json({
      message: "Token retrieved successfully",
      token,
    }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export { handler as GET };