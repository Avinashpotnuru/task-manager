import { connectDB } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

import User from "@/models/user";

export async function POST(req) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password || !confirmPassword) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({ message: "Passwords do not match" }),
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        userId: user._id,
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}
