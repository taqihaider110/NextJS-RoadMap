import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface TokenData {
  id: string;
  email: string;
  username: string;
}

export const getDataFromToken = (request: NextRequest): TokenData => {
  try {
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      throw new Error("No token found");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as TokenData;

    return decodedToken;
  } catch (error: any) {
    throw new Error(error.message || "Invalid token");
  }
};
