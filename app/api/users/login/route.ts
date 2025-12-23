import {connectToDatabase} from "@/dbConfig/dbConfig"
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {  try {
    await connectToDatabase();

    const { email, password } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please register first." },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials. Please try again." },
        { status: 401 }
      );
    }

    const TokenData = {
        id: user._id,
        email: user.email,
        username: user.name,
    }

    const token = jwt.sign(TokenData, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '1h',
    }); 

    const response = NextResponse.json(
      { message: "Login successful.", user: { id: user._id, email: user.email, username: user.username }, success: true },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
    });

    return response;
  }
catch (error) {
    return NextResponse.json(
      { message: "An error occurred during login.", error: (error as Error).message },
      { status: 500 }
    );
  }
}