import Image from "next/image";
import Link from "next/link";
import { Loader, Sparkles, KeyRound, ArrowRight } from "lucide-react";
import { 
  ClerkLoaded, 
  ClerkLoading, 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { getUserProgress } from "@/db/queries";

export default async function Home() {
  const userProgress = await getUserProgress();
  const isParent = userProgress?.role === "parent";

  return (
    <div className="max-w-[1120px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 gap-8 lg:gap-14">
      {/* High-Resolution Croatian Hero Artwork (Paško the Dalmatian, Trajekt, Licitarsko Srce, Adriatic Sun) */}
      <div className="relative w-full max-w-[360px] h-[320px] sm:max-w-[460px] sm:h-[400px] lg:max-w-[500px] lg:h-[450px] shrink-0 drop-shadow-sm flex items-center justify-center">
        <Image
          src="/pasko-hero.jpg"
          fill
          alt="Paško the Dalmatian Pup learning Croatian with CroLingo"
          className="object-contain"
          priority
        />
      </div>

      {/* Hero Content & Dual Child-Friendly Action Gates */}
      <div className="flex flex-col items-center lg:items-start gap-y-6 text-center lg:text-left max-w-[480px]">
        {/* Cultural Heritage Pill Badge */}
        <div className="inline-flex items-center gap-x-2 px-3.5 py-1 bg-amber-50 border border-amber-200 rounded-full shadow-2xs">
          <span className="text-sm">🇭🇷</span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-900">
            100% Focused on Croatian
          </span>
        </div>

        {/* Playful Bold Headline */}
        <div className="space-y-2.5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-800 tracking-tight leading-tight">
            <span className="text-blue-900">Bok!</span> Learn Croatian the playful way.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-[420px]">
            Bite-sized, engaging lessons for kids, diaspora families, and heritage learners.
          </p>
        </div>

        {/* Two Kid-Friendly Action Gates */}
        <div className="flex flex-col items-center lg:items-start gap-y-3.5 w-full max-w-[340px]">
          <ClerkLoading>
            <div className="h-28 flex items-center justify-center w-full">
              <Loader className="h-6 w-6 text-green-600 animate-spin" />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            <SignedOut>
              {/* Gate 1: Returning Learner / Account Holder */}
              <SignInButton
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn"
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full text-base font-black shadow-md bg-green-600 hover:bg-green-700 active:scale-98 transition flex items-center justify-center gap-x-2.5 h-13 rounded-2xl cursor-pointer"
                >
                  <KeyRound className="h-5 w-5" />
                  <span>I Already Have an Account</span>
                </Button>
              </SignInButton>

              {/* Gate 2: First-time learner / New account */}
              <SignUpButton
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn"
              >
                <Button
                  size="lg"
                  variant="primaryOutline"
                  className="w-full text-sm font-extrabold border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 active:scale-98 transition flex items-center justify-center gap-x-2 h-12 rounded-2xl cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>I&apos;m New Here! Start Learning</span>
                </Button>
              </SignUpButton>

              <p className="text-[11px] text-muted-foreground/80 text-center w-full font-medium mt-0.5">
                Free for families & learners • No credit card required
              </p>
            </SignedOut>

            <SignedIn>
              <Button
                size="lg"
                variant="secondary"
                className="w-full text-base font-black h-13 rounded-2xl bg-green-600 hover:bg-green-700 shadow-md flex items-center justify-center gap-x-2"
                asChild
              >
                <Link href={isParent ? "/admin" : "/learn"}>
                  <span>{isParent ? "Open Parent Center" : "Continue Learning"}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}
