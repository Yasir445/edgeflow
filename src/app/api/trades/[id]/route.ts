export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const trade = await prisma.trade.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { screenshots: true, tags: { include: { tag: true } }, aiFeedback: true, account: true },
  });
  if (!trade) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: trade });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const trade = await prisma.trade.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!trade) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const updated = await prisma.trade.update({
    where: { id: params.id },
    data: { ...body, entryTime: body.entryTime ? new Date(body.entryTime) : undefined, exitTime: body.exitTime ? new Date(body.exitTime) : undefined },
  });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const trade = await prisma.trade.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!trade) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.trade.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
}
