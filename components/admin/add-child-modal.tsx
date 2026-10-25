"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { UserPlus, Sparkles, Copy, Check, Eye, EyeOff, ShieldCheck, Printer } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChildAccount } from "@/actions/child-account";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  podId: number;
  podName: string;
};

const AVATAR_OPTIONS = [
  { label: "Paško", src: "/avatars/pasko.png" },
  { label: "Luka", src: "/avatars/luka.png" },
  { label: "Mia", src: "/avatars/mia.png" },
  { label: "Matija", src: "/avatars/matija.png" },
  { label: "Roko", src: "/avatars/roko.png" },
  { label: "Delfi", src: "/avatars/delfi.png" },
  { label: "Baka", src: "/grandma.svg" },
  { label: "Dida", src: "/grandpa.svg" },
  { label: "Srce", src: "/heart.svg" },
];

export const AddChildModal = ({ isOpen, onOpenChange, podId, podName }: Props) => {
  const [childName, setChildName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("lingo123");
  const [selectedAvatar, setSelectedAvatar] = useState("/avatars/pasko.png");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://twolingo.onrender.com");
  const [domain, setDomain] = useState("twolingo.onrender.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      setDomain(window.location.host);
    }
  }, []);

  const [createdChild, setCreatedChild] = useState<{
    name: string;
    username: string;
    password: string;
  } | null>(null);

  const [pending, startTransition] = useTransition();

  // Auto-suggest username when child name changes if not manually edited
  const handleNameChange = (val: string) => {
    setChildName(val);
    const suggested = val.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (suggested && (!username || username.startsWith(suggested.slice(0, 3)))) {
      setUsername(suggested);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      toast.error("Please enter your child's name.");
      return;
    }
    if (!username.trim() || username.length < 4) {
      toast.error("Username must be at least 4 characters long.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createChildAccount({
          childName,
          username,
          password,
          userImageSrc: selectedAvatar,
          podId,
        });

        if (res?.error) {
          toast.error(res.error);
        } else if (res?.success && res.child) {
          toast.success(`🎉 ${res.child.name}'s account created!`);
          setCreatedChild({
            name: res.child.name,
            username: res.child.username,
            password: res.child.password,
          });
        }
      } catch (err) {
        toast.error("Failed to create child account. Please try again.");
      }
    });
  };

  const handleCopyCredentials = () => {
    if (!createdChild) return;
    const text = `CroLingo Login for ${createdChild.name}:\nUsername: ${createdChild.username}\nPassword: ${createdChild.password}\nLogin at: ${origin}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Login details copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setChildName("");
    setUsername("");
    setPassword("lingo123");
    setCreatedChild(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => {
      if (!pending && !openState) {
        handleClose();
      }
    }}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] overflow-hidden border-2 border-slate-200 p-6 sm:p-8 sm:rounded-3xl">
        {!createdChild ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader className="text-left mb-1">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-xs">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-black text-slate-800">
                    Add Child Learner
                  </DialogTitle>
                  <p className="text-xs text-slate-500 font-medium">
                    Adding to <span className="font-bold text-green-700">{podName}</span>
                  </p>
                </div>
              </div>
              <DialogDescription className="text-slate-500 font-medium text-xs mt-2">
                Create a kid-safe login for your child. No email address required!
              </DialogDescription>
            </DialogHeader>

            {/* Avatar Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Choose Mascot Avatar
                </label>
                <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                  Selected: {AVATAR_OPTIONS.find((a) => a.src === selectedAvatar)?.label || "Mascot"}
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {AVATAR_OPTIONS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.src;
                  return (
                    <button
                      key={avatar.src}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.src)}
                      className={`group flex flex-col items-center gap-1.5 p-1 rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white shadow-xs ring-2 ring-green-500 scale-105"
                          : "hover:bg-white/80 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="relative h-12 w-12 sm:h-13 sm:w-13 rounded-full overflow-hidden bg-white border border-slate-200 p-0.5">
                        <Image
                          src={avatar.src}
                          alt={avatar.label}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <span className={`text-[11px] font-bold truncate max-w-full leading-none ${
                        isSelected ? "text-green-700" : "text-slate-600"
                      }`}>
                        {avatar.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Child's Name & Username (2 columns on tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Child's Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Child&apos;s First Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Luka or Mia"
                  value={childName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={pending}
                  className="h-11 rounded-xl border-2 font-medium"
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. luka or mia"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  disabled={pending}
                  className="h-11 rounded-xl border-2 font-mono font-bold"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Letters & numbers. Used to log in.
                </p>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Child Password / PIN <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="e.g. lingo123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={pending}
                  className="h-11 rounded-xl border-2 font-mono pr-10 font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                At least 6 characters. Easy for your child to remember.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={pending || !childName.trim() || !username.trim()}
                className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {pending ? (
                  <span>Creating learner account...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Create {childName.trim() || "Child"}&apos;s Account
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center py-2">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center animate-bounce">
                <ShieldCheck className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div>
              <DialogTitle className="text-2xl font-black text-slate-800">
                🎉 {createdChild.name}&apos;s Account is Ready!
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-medium mt-1">
                Successfully enrolled in <span className="font-bold text-green-700">{podName}</span>.
              </DialogDescription>
            </div>

            {/* Credentials Card */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold uppercase">Username:</span>
                <span className="font-mono font-black text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {createdChild.username}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold uppercase">Password:</span>
                <span className="font-mono font-black text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {createdChild.password}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed px-2">
              {createdChild.name} can now log into <strong>CroLingo</strong> at <strong>{domain}</strong> on any iPad, tablet, or computer with this username and password!
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                variant="primaryOutline"
                onClick={handleCopyCredentials}
                className="w-full h-11 rounded-xl text-xs font-bold"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5 text-green-600" />
                    Credentials Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copy Login Credentials
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="primaryOutline"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
                className="w-full h-11 rounded-xl text-xs font-bold border-2 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <Printer className="h-4 w-4 mr-1.5 text-slate-600" />
                Print / Save Access Card
              </Button>

              <Button
                type="button"
                onClick={handleClose}
                className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
