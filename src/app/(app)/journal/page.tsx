import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JournalClient } from "@/components/journal/JournalClient";

export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { entryTime: "desc" },
    take: 50,
    include: {
      screenshots: { select: { id: true, url: true } },
      tags: { include: { tag: true } },
      aiFeedback: { select: { qualityScore: true } },
    },
  });

  return <JournalClient initialTrades={trades as any} />;
}
