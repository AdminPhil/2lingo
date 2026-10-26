import Image from "next/image";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2 bg-white">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full text-slate-700">
        <Button size="lg" variant="ghost" className="w-full cursor-default hover:bg-transparent font-bold">
          <Image 
            src="/hr.svg" 
            alt="Croatian" 
            height={28} 
            width={36}
            className="mr-3 rounded-md border"
          />
          Hrvatski (Croatian)
        </Button>
        <Button size="lg" variant="ghost" className="w-full cursor-default hover:bg-transparent text-amber-600 font-bold">
          <Image 
            src="/streak.svg" 
            alt="Daily Streaks" 
            height={24} 
            width={24}
            className="mr-2"
          />
          Daily Streaks
        </Button>
        <Button size="lg" variant="ghost" className="w-full cursor-default hover:bg-transparent text-rose-600 font-bold">
          <Image 
            src="/heart.svg" 
            alt="Heart Practice" 
            height={24} 
            width={24}
            className="mr-2"
          />
          Practice for Hearts
        </Button>
        <Button size="lg" variant="ghost" className="w-full cursor-default hover:bg-transparent text-blue-800 font-bold">
          <Image 
            src="/leaderboard.svg" 
            alt="Family & Classroom Teams" 
            height={26} 
            width={26}
            className="mr-2"
          />
          Family & Classroom Teams
        </Button>
      </div>
    </footer>
  );
};
