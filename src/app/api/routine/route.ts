import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];
  const checks = await prisma.routineCheck.findMany({ where: { userId: session.user.id, date: new Date(date) }, orderBy: { category: "asc" } });
  return NextResponse.json({ data: checks });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { date, category, item, completed } = await req.json();
  const check = await prisma.routineCheck.upsert({
    where: { userId_date_category_item: { userId: session.user.id, date: new Date(date), category, item } },
    create: { userId: session.user.id, date: new Date(date), category, item, completed },
    update: { completed },
  });
  return NextResponse.json({ data: check });
}
