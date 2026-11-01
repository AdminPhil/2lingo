import Image from "next/image";
import { Award, Sparkles, Compass } from "lucide-react";

export const LevelMilestoneGateway = () => {
  return (
    <div className="w-full my-8 relative overflow-hidden rounded-3xl border-3 border-amber-400 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-xl">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-44 h-44 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Mascot & Crown medallion */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xs border-2 border-white/40 flex items-center justify-center shadow-md transform -rotate-3 hover:rotate-0 transition">
            <Image
              src="/kruna.svg"
              alt="Zlatna kruna"
              width={54}
              height={54}
              className="drop-shadow-sm"
            />
          </div>
          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-yellow-300 text-yellow-950 font-black text-[10px] tracking-wide uppercase border border-yellow-400 shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Level Up
          </span>
        </div>

        {/* Milestone copy */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-xs border border-white/30 text-xs font-black uppercase tracking-wider text-amber-100">
            <Award className="w-3.5 h-3.5 text-yellow-300" />
            Čestitamo! Level 1 Završen
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
            Dobrodošli u Level 2: Mali Istraživač
          </h2>

          <p className="text-sm font-bold text-amber-50/95 leading-relaxed max-w-xl">
            Uspješno ste svladali prvih 20 jedinica i osnove jezika! Sada krećemo na uzbudljivo putovanje kroz drevnu Istru, slavonska polja i legendarne dvorce Zagorja.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-[11px] font-black text-white flex items-center gap-1">
              <Compass className="w-3 h-3" /> CEFR A2 Razina
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-[11px] font-black text-white">
              🏛️ Istra • 🌾 Slavonija • 🏰 Zagorje
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
