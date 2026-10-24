import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import { 
  ClerkLoaded, 
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="h-20 lg:max-w-screen-lg mx-auto flex items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-x-3 group">
          <div className="relative w-11 h-11 transition-transform group-hover:scale-105">
            <Image
              src="/mascot.svg"
              fill
              alt="Paško the Dalmatian"
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-x-2">
            <h1 className="text-2xl font-black text-green-600 tracking-tight">
              2lingo
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              Hrvatski 🇭🇷
            </span>
          </div>
        </Link>

        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        
        <ClerkLoaded>
          <SignedIn>
            <div className="flex items-center gap-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="font-extrabold text-xs text-slate-700 hover:text-green-700 hover:bg-green-50 border border-slate-200 rounded-xl px-3.5 h-9 hidden sm:flex items-center gap-1.5 shadow-2xs"
                asChild
              >
                <Link href="/admin">
                  <span>Parent Portal</span>
                  <span className="text-muted-foreground">→</span>
                </Link>
              </Button>
              <UserButton
                afterSignOutUrl="/"
              />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              afterSignInUrl="/admin"
              afterSignUpUrl="/admin"
            >
              <Button
                size="sm"
                variant="ghost"
                className="font-extrabold text-xs text-slate-700 hover:text-green-700 hover:bg-green-50 border border-slate-200 rounded-xl px-3.5 h-9 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>Parent Portal</span>
                <span className="text-muted-foreground">→</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>

      {/* Subtle Croatian Checkered Accent Stripe */}
      <div className="h-[3px] w-full bg-[repeating-linear-gradient(90deg,#DC2626_0px,#DC2626_12px,#FFFFFF_12px,#FFFFFF_24px)] opacity-85" />
    </header>
  );
};
