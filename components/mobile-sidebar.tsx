"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";

type Props = {
  isAdmin?: boolean;
};

export const MobileSidebar = ({ isAdmin }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open mobile navigation menu"
          className="p-1 -ml-1 text-white hover:opacity-80 transition cursor-pointer"
        >
          <Menu className="text-white h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent className="p-0 z-[100]" side="left">
        <Sidebar
          isAdmin={isAdmin}
          onAction={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
};
