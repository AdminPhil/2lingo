"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ParentModeBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 text-white rounded-2xl p-3 sm:px-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5 text-center sm:text-left">
        <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-black tracking-wide uppercase text-green-100">
            Parent Account
          </p>
          <p className="text-xs font-semibold text-white/95">
            You are browsing the Learning Path as a parent.
          </p>
        </div>
      </div>

      <Button
        size="sm"
        variant="secondary"
        className="h-8 px-3 rounded-xl bg-white text-green-800 hover:bg-green-50 font-black text-xs shrink-0 shadow-xs flex items-center gap-1 cursor-pointer"
        asChild
      >
        <Link href="/admin">
          <span>Parent Center</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
};
