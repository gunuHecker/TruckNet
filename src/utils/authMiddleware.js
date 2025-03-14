import { jwtVerify } from "jose";

export async function authenticateAPI(req) {
  try {
    const token = req.cookies.get("token")?.value; // Get token from cookies
    if (!token) {
      return { error: "Unauthorized", status: 401 };
    }

    // Decode the token
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return { user: payload, status: 200 }; // Return user data if valid
  } catch (error) {
    return { error: "Invalid or expired token", status: 401 };
  }
}