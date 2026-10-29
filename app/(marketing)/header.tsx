import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="w-full bg-white shadow-2xs">
      <div className="h-20 lg:max-w-screen-lg mx-auto flex items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-x-3 group">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-slate-200/90 shadow-xs transition-transform group-hover:scale-105 bg-white shrink-0">
            <Image
              src="/mascot.png"
              fill
              alt="Paško the Dalmatian"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-x-2">
            <h1 className="text-2xl font-black text-blue-900 tracking-tight">
              CroLingo
            </h1>
            <span className="inline-flex items-center gap-x-1.5 text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
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
          </div>
        </Link>
      </div>

      {/* Symmetrical 2-Row Croatian Checkerboard Ribbon (Šahovnica: exact 8x8px squares in 16px height) */}
      <div className="w-full border-y border-slate-200 bg-white">
        <div
          className="h-4 w-full bg-[length:16px_16px] bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Crect width='16' height='16' fill='%23FFFFFF'/%3E%3Crect x='0' y='0' width='8' height='8' fill='%23DC2626'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23DC2626'/%3E%3C/svg%3E")`,
          }}
          title="Hrvatska Šahovnica"
        />
      </div>
    </header>
  );
};
