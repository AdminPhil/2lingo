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
      <span className="inline-flex items-center gap-x-1.5 text-[10px] font-black uppercase tracking-wider text-rose-200 bg-rose-950/50 border border-rose-400/30 px-2 py-0.5 rounded-full">
        <svg width="10" height="10" viewBox="0 0 20 20" className="rounded-[2px] overflow-hidden shrink-0" aria-hidden="true">
          <rect width="20" height="20" fill="#FFFFFF" />
          <rect x="0" y="0" width="5" height="5" fill="#DC2626" />
          <rect x="10" y="0" width="5" height="5" fill="#DC2626" />
          <rect x="5" y="5" width="5" height="5" fill="#DC2626" />
          <rect x="15" y="5" width="5" height="5" fill="#DC2626" />
          <rect x="0" y="10" width="5" height="5" fill="#DC2626" />
          <rect x="10" y="10" width="5" height="5" fill="#DC2626" />
          <rect x="5" y="15" width="5" height="5" fill="#DC2626" />
          <rect x="15" y="15" width="5" height="5" fill="#DC2626" />
        </svg>
        <span>Hrvatski</span>
      </span>
    </nav>
  );
};
