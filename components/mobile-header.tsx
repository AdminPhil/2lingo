import Link from "next/link";
import Image from "next/image";
import { MobileSidebar } from "./mobile-sidebar";

type Props = {
  isAdmin?: boolean;
};

export const MobileHeader = ({ isAdmin }: Props) => {
  return (
    <nav className="lg:hidden px-4 h-[50px] flex items-center justify-between bg-blue-900 border-b border-blue-950 fixed top-0 w-full z-50 shadow-xs">
      <div className="flex items-center gap-x-3">
        <MobileSidebar isAdmin={isAdmin} />
        <Link href={isAdmin ? "/admin" : "/learn"} className="flex items-center gap-x-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/40 bg-white shrink-0">
            <Image
              src="/mascot.png"
              fill
              alt="Paško the Dalmatian"
              className="object-cover"
            />
          </div>
          <span className="text-lg font-black text-white tracking-tight">
            CroLingo
          </span>
        </Link>
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider text-rose-200 bg-rose-950/50 border border-rose-400/30 px-2 py-0.5 rounded-full">
        Hrvatski 🇭🇷
      </span>
    </nav>
  );
};
