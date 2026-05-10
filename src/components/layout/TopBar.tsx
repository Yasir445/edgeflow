"use client";
import { Bell, Search, Plus } from "lucide-react";
import { useState } from "react";
import { AddTradeModal } from "@/components/journal/AddTradeModal";

export function TopBar() {
  const [showAddTrade, setShowAddTrade] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-bg/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2 ef-card rounded-xl px-3 py-2 w-64">
          <Search size={14} className="text-white/25" />
          <input type="text" placeholder="Search trades, setups..." className="bg-transparent text-sm text-white placeholder-white/20 outline-none w-full" />
          <kbd className="text-[10px] text-white/15 border border-white/10 rounded px-1">⌘K</kbd>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddTrade(true)} className="ef-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
            <Plus size={14} /> Add Trade
          </button>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/5 transition-all text-white/40 hover:text-white">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-green" />
          </button>
        </div>
      </header>
      {showAddTrade && <AddTradeModal onClose={() => setShowAddTrade(false)} />}
    </>
  );
}
