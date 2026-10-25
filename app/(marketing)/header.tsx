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
                className="font-extrabold text-xs text-slate-700 hover:text-blue-800 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl px-3.5 h-9 hidden sm:flex items-center gap-1.5 shadow-2xs cursor-pointer"
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
              afterSignUpUrl="/learn?intent=parent"
            >
              <Button
                size="sm"
                variant="ghost"
                className="font-extrabold text-xs text-slate-700 hover:text-blue-800 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl px-3.5 h-9 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>Parent Portal</span>
                <span className="text-muted-foreground">→</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>

      {/* Wide Aesthetic Croatian Checkerboard Ribbon (Šahovnica) */}
      <div 
        className="h-4 w-full border-t border-red-200/90 border-b-2 border-blue-900/20 bg-[repeating-conic-gradient(#DC2626_0%_25%,#FFFFFF_0%_50%)] bg-[length:16px_16px] shadow-2xs" 
        title="Hrvatska Šahovnica"
      />
    </header>
  );
};
