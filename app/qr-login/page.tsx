"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useClerk } from "@clerk/nextjs";
import { QrCode, Loader2, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QRLoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const searchParams = useSearchParams();
  const router = useRouter();

  const u = searchParams.get("u");
  const p = searchParams.get("p");

  const [status, setStatus] = useState<"idle" | "authenticating" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isLoaded && u && p && status === "idle") {
      setStatus("authenticating");
      signIn
        .create({
          identifier: u,
          password: p,
        })
        .then((result) => {
          if (result.status === "complete") {
            setActive({ session: result.createdSessionId });
            setStatus("success");
            setTimeout(() => {
              router.push("/learn");
            }, 800);
          } else {
            setStatus("error");
            setErrorMessage("Unable to complete login. Please try again.");
          }
        })
        .catch((err) => {
          setStatus("error");
          setErrorMessage(err?.errors?.[0]?.message || "Invalid QR credentials.");
        });
    }
  }, [isLoaded, u, p, status, signIn, setActive, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6">
        {/* Paško Mascot Header */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20 rounded-full border-4 border-amber-300 overflow-hidden shadow-sm">
            <Image
              src="/mascot.png"
              fill
              alt="Paško the Dalmatian"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tight">
            CroLingo Fast Pass
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Student Badge & Quick Login
          </p>
        </div>

        {status === "authenticating" && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-y-3">
            <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
            <p className="text-sm font-bold text-slate-700">
              Logging you in with your Student Badge...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="p-6 bg-green-50 rounded-2xl border border-green-200 flex flex-col items-center justify-center gap-y-3 text-green-700 animate-in fade-in zoom-in-95">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <p className="text-base font-black">
              Bok, {u}! Dobrodošao! 🇭🇷
            </p>
            <p className="text-xs font-semibold text-green-600">
              Entering your Croatian adventure...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-700 text-xs font-medium space-y-2">
            <p className="font-bold">Login Failed</p>
            <p>{errorMessage}</p>
            <Button
              variant="primaryOutline"
              size="sm"
              onClick={() => router.push("/")}
              className="mt-2 text-xs"
            >
              Back to Home
            </Button>
          </div>
        )}

        {status === "idle" && (
          <div className="space-y-4">
            <div className="p-6 bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl flex flex-col items-center justify-center gap-y-3">
              <QrCode className="h-12 w-12 text-blue-900" />
              <div className="text-xs font-bold text-slate-700 leading-relaxed">
                Scan your <span className="text-blue-900 font-black">CroLingo Family Passport</span> QR code using your tablet or iPad camera to log in instantly!
              </div>
            </div>

            <Button
              asChild
              className="w-full h-12 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-black"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
