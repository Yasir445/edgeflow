import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JournalClient } from "@/components/journal/JournalClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <JournalClient initialTrades={[]} />;
}
