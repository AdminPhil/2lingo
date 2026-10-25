import Link from "next/link";
import { NotebookText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStageThemeForUnit } from "@/lib/theme-registry";

type Props = {
  order?: number;
  title: string;
  description: string;
};

export const UnitBanner = ({
  order = 1,
  title,
  description,
}: Props) => {
  const theme = getStageThemeForUnit(order);

  return (
    <div
      className={cn(
        "w-full rounded-2xl p-5 sm:p-6 text-white flex items-center justify-between shadow-md bg-gradient-to-r relative overflow-hidden border-2 mb-6",
        theme.solidBg,
        theme.gradient,
        theme.accentBorder
      )}
    >
      <div className="space-y-2 max-w-xl relative z-10">
        {/* Regional Stage Pill Badge */}
        <div className="flex items-center gap-x-2">
          <span
            className={cn(
              "text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border shadow-xs backdrop-blur-xs flex items-center gap-2",
              theme.badgeBg
            )}
          >
            <span className="text-base leading-none">{theme.accentEmoji}</span>
            <span>{theme.stageBadgeLabel}</span>
          </span>
        </div>

        {/* Unit Order & Title */}
        <div className="flex items-baseline gap-x-2 pt-0.5">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white/90 shrink-0">
            {title} •
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-2xs">
            {description}
          </h3>
        </div>
      </div>

      {/* Continue Action Button */}
      <Link href="/lesson" className="relative z-10 shrink-0 ml-4">
        <Button
          size="lg"
          className={cn(
            "hidden xl:flex font-black text-sm h-12 px-6 rounded-2xl border-2 border-b-4 shadow-sm transition active:scale-98 cursor-pointer items-center gap-2",
            theme.buttonClass
          )}
        >
          <NotebookText className="h-5 w-5" />
          <span>Nastavi</span>
        </Button>
      </Link>

      {/* Decorative Radial Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(circle_at_right,#FFFFFF_0%,transparent_70%)] pointer-events-none" />
    </div>
  );
};
