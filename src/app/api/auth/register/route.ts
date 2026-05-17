export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // Test database connection first
    const { PrismaClient } = await import("@prisma/client");
    const db = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    try {
      await db.$connect();
    } catch (connErr: any) {
      console.error("DB Connection failed:", connErr.message);
      return NextResponse.json({ 
        error: `Database connection failed: ${connErr.message}` 
      }, { status: 500 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      await db.$disconnect();
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        subscription: { create: { plan: "FREE", status: "ACTIVE" } },
        accounts_tp: { create: { name: "Main Account", type: "LIVE", currency: "USD", isDefault: true } },
      },
      select: { id: true, name: true, email: true },
    });

    await db.$disconnect();
    return NextResponse.json({ data: user }, { status: 201 });

  } catch (error: any) {
    console.error("Register error full:", error.message, error.code);
    return NextResponse.json({ 
      error: error.message || "Internal server error" 
    }, { status: 500 });
  }
}
