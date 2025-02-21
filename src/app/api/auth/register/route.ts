// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface RegistrationBody {
  username: string;
  email: string;
  password: string;
  level: string;
  bagian: string;
  company: string;
  full_name: string;
}

interface RegistrationError {
  message: string;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<RegistrationError | { message: string }>> {
  try {
    const body = (await req.json()) as RegistrationBody;
    const { username, email, password, level, bagian, company, full_name } =
      body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Please enter all fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username: username,
        email: email,
        company: company,
        level: level,
        bagian: bagian,
        password: hashedPassword,
        full_name: full_name,
      },
    });

    if (user) {
      return NextResponse.json(
        { message: "Registration successful" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Registration failed" },
        { status: 400 }
      );
    }
  } catch (error: Error | unknown) {
    console.error("Registration Error:", error);
    if (error) {
      return NextResponse.json({ message: error as string }, { status: 400 });
    } else if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
