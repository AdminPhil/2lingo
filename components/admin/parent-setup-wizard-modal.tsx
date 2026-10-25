"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Sparkles, 
  Plus, 
  Trash2, 
  Printer, 
  Copy, 
  Check, 
  QrCode, 
  ArrowRight, 
  ArrowLeft, 
  Tablet, 
  ShieldCheck,
  Trophy,
  Loader2
} from "lucide-react";
import QRCode from "qrcode";
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
import { createMultipleChildAccounts } from "@/actions/child-account";
import { updatePodSettings } from "@/actions/pod";

const AVATAR_OPTIONS = [
  { label: "Paško", src: "/avatars/pasko.png" },
  { label: "Luka", src: "/avatars/luka.png" },
  { label: "Mia", src: "/avatars/mia.png" },
  { label: "Matija", src: "/avatars/matija.png" },
  { label: "Roko", src: "/avatars/roko.png" },
  { label: "Delfi", src: "/avatars/delfi.png" },
];

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  podId: number;
  podName: string;
  inviteCode: string;
};

type ChildDraft = {
  id: string;
  name: string;
  username: string;
  avatar: string;
};

type CreatedChild = {
  id: string;
  name: string;
  username: string;
  password: string;
  userImageSrc: string;
  qrCodeUrl?: string;
};

export const ParentSetupWizardModal = ({
  isOpen,
  onOpenChange,
  podId,
  podName,
  inviteCode,
}: Props) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [pending, startTransition] = useTransition();

  // Step 1 State: Family Circle Name
  const [familyCircleName, setFamilyCircleName] = useState(podName || "The Family");

  // Step 2 State: Kids Form
  const [children, setChildren] = useState<ChildDraft[]>([
    { id: "1", name: "", username: "", avatar: "/avatars/pasko.png" },
  ]);

  // Step 3 State: Created Kids & QR Data
  const [createdChildren, setCreatedChildren] = useState<CreatedChild[]>([]);
  const [copiedLinks, setCopiedLinks] = useState(false);
  const [origin, setOrigin] = useState("https://2lingo.onrender.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (podName) {
      setFamilyCircleName(podName);
    }
  }, [podName]);

  const handleAddChildRow = () => {
    if (children.length >= 5) {
      toast.error("You can add up to 5 children at one time.");
      return;
    }
    const nextNum = children.length + 1;
    const nextAvatar = AVATAR_OPTIONS[(nextNum - 1) % AVATAR_OPTIONS.length].src;
    setChildren((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", username: "", avatar: nextAvatar },
    ]);
  };

  const handleRemoveChildRow = (id: string) => {
    if (children.length <= 1) return;
    setChildren((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateChild = (id: string, field: keyof ChildDraft, val: string) => {
    setChildren((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (field === "name") {
          const autoUser = val.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
          return {
            ...c,
            name: val,
            username: !c.username || c.username.startsWith(autoUser.slice(0, 3)) ? autoUser : c.username,
          };
        }
        return { ...c, [field]: val };
      })
    );
  };

  // Step 1 Submit
  const handleStep1Next = () => {
    if (!familyCircleName.trim()) {
      toast.error("Please enter a family circle name.");
      return;
    }

    if (familyCircleName.trim() !== podName) {
      startTransition(async () => {
        try {
          await updatePodSettings(podId, {
            name: familyCircleName.trim(),
            inviteCode,
            targetXp: 1000,
          });
          toast.success("Family circle updated!");
          setCurrentStep(2);
        } catch {
          setCurrentStep(2);
        }
      });
    } else {
      setCurrentStep(2);
    }
  };

  // Step 2 Submit: Provision Accounts
  const handleStep2Submit = () => {
    const validChildren = children.filter((c) => c.name.trim().length > 0);
    if (validChildren.length === 0) {
      toast.error("Please enter at least one child's name.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = validChildren.map((c, idx) => {
          const cleanName = c.name.trim();
          const cleanUser = (c.username.trim() || cleanName.toLowerCase().replace(/[^a-z0-9]/g, "")) + (idx > 0 ? idx : "");
          const randomNum = Math.floor(10 + Math.random() * 90);
          const safeName = cleanName.replace(/[^a-zA-Z]/g, "") || "Lingo";
          const generatedPass = `Cro${safeName}${randomNum}!`;

          return {
            childName: cleanName,
            username: cleanUser,
            password: generatedPass,
            userImageSrc: c.avatar,
            podId,
          };
        });

        const res = await createMultipleChildAccounts(payload);

        if (!res.success || !res.created || res.created.length === 0) {
          toast.error(res.errors?.[0] || "Failed to create accounts. Please check usernames.");
          return;
        }

        // Generate QR codes for each child
        const createdWithQRs: CreatedChild[] = [];
        for (const child of res.created) {
          const loginUrl = `${window.location.origin}/qr-login?u=${encodeURIComponent(
            child.username
          )}&p=${encodeURIComponent(child.password)}`;

          const qrUrl = await QRCode.toDataURL(loginUrl, {
            width: 240,
            margin: 1,
            color: { dark: "#1E3A8A", light: "#FFFFFF" },
          });

          createdWithQRs.push({
            id: child.id,
            name: child.name,
            username: child.username,
            password: child.password,
            userImageSrc: (child as any).userImageSrc || "/avatars/pasko.png",
            qrCodeUrl: qrUrl,
          });
        }

        setCreatedChildren(createdWithQRs);
        setCurrentStep(3);
        toast.success(`🎉 Created ${createdWithQRs.length} learner accounts!`);
      } catch {
        toast.error("An error occurred while creating child accounts.");
      }
    });
  };

  const handleCopyAllLinks = () => {
    if (createdChildren.length === 0) return;
    const text = createdChildren
      .map(
        (c) =>
          `CroLingo Pass for ${c.name}:\nUsername: ${c.username}\nPassword: ${c.password}\nFast Pass Link: ${origin}/qr-login?u=${encodeURIComponent(
            c.username
          )}&p=${encodeURIComponent(c.password)}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(text);
    setCopiedLinks(true);
    toast.success("All student login links copied to clipboard!");
    setTimeout(() => setCopiedLinks(false), 2000);
  };

  const handlePrintSheet = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleFinish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("parent_wizard_completed", "true");
    }
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl p-6 sm:p-8 sm:rounded-3xl border-2 border-slate-200 max-h-[92vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900">
                  CroLingo Family Setup Wizard
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-medium">
                  Step-by-step setup to get your kids learning Croatian on shared devices
                </DialogDescription>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Step {currentStep} of 4
            </span>
          </div>
        </DialogHeader>

        {/* Stepper Progress Bar */}
        <div className="my-4 relative">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2">
            <span className={currentStep >= 1 ? "text-green-700 font-extrabold" : ""}>1. Family Circle</span>
            <span className={currentStep >= 2 ? "text-green-700 font-extrabold" : ""}>2. Add Kids</span>
            <span className={currentStep >= 3 ? "text-green-700 font-extrabold" : ""}>3. Fridge Sheet</span>
            <span className={currentStep >= 4 ? "text-green-700 font-extrabold" : ""}>4. Tablet Handoff</span>
          </div>
        </div>

        {/* ================= STEP 1: FAMILY CIRCLE ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 py-2">
            <div className="p-4 bg-blue-50/70 border-2 border-blue-100 rounded-2xl flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-blue-950">Name Your Family Circle</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Your family circle connects your kids, pools XP toward shared weekly goals, and enables 1-tap tablet switching.
                </p>
              </div>
            </div>

            <div className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
                  Family Circle Name
                </label>
                <Input
                  value={familyCircleName}
                  onChange={(e) => setFamilyCircleName(e.target.value)}
                  placeholder="e.g. The Novak Family"
                  className="h-12 text-base font-bold text-slate-900 rounded-xl border-2 border-slate-200 focus:border-green-500"
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <Trophy className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">
                    Weekly 1,000 XP Team Target
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Every lesson your children complete adds points to your family goal. When you reach 1,000 XP each week, a Croatian cultural celebration unlocks!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                onClick={handleStep1Next}
                disabled={pending}
                className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs h-11 px-6 rounded-xl cursor-pointer"
              >
                Continue: Add Kids <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ADD KIDS ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 py-2">
            <div className="p-4 bg-emerald-50/70 border-2 border-emerald-100 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-black text-emerald-950">Who is Learning Croatian?</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Add your kids below. <strong>No email address required</strong>. Each child gets personal progress, hearts, and their own Croatian mascot avatar!
                </p>
              </div>
            </div>

            <div className="space-y-4 max-w-xl mx-auto">
              {children.map((child, idx) => (
                <div
                  key={child.id}
                  className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wide">
                      Child {idx + 1}
                    </span>
                    {children.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChildRow(child.id)}
                        className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Remove child"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        First Name
                      </label>
                      <Input
                        value={child.name}
                        onChange={(e) => handleUpdateChild(child.id, "name", e.target.value)}
                        placeholder="e.g. Luka or Mia"
                        className="h-10 text-sm font-bold bg-white rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Username (auto)
                      </label>
                      <Input
                        value={child.username}
                        onChange={(e) => handleUpdateChild(child.id, "username", e.target.value)}
                        placeholder="username"
                        className="h-10 text-sm font-mono bg-slate-100 text-slate-600 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                      Choose Avatar
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {AVATAR_OPTIONS.map((av) => {
                        const isSelected = child.avatar === av.src;
                        return (
                          <button
                            key={av.label}
                            type="button"
                            onClick={() => handleUpdateChild(child.id, "avatar", av.src)}
                            className={`p-1 rounded-xl border-2 flex flex-col items-center gap-1 transition cursor-pointer ${
                              isSelected
                                ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                              <Image src={av.src} alt={av.label} fill className="object-cover" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                              {av.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {children.length < 5 && (
                <Button
                  type="button"
                  variant="primaryOutline"
                  onClick={handleAddChildRow}
                  className="w-full h-11 border-2 border-dashed border-slate-300 text-slate-700 hover:border-slate-400 font-bold text-xs rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  + Add Another Sibling
                </Button>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-slate-500"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                variant="primary"
                onClick={handleStep2Submit}
                disabled={pending}
                className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs h-11 px-6 rounded-xl cursor-pointer"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Creating Accounts...
                  </>
                ) : (
                  <>
                    Create Accounts &amp; Get Passes <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: FAMILY FRIDGE SHEET ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 py-2">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                🎉 Your Student Fast Passes Are Ready!
              </h3>
              <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                Print this sheet for your refrigerator or desk. Each child simply points the iPad camera at their card to log in instantly.
              </p>
            </div>

            {/* Printable Multi-Badge Grid */}
            <div
              id="printable-family-sheet"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 bg-slate-50/50 rounded-2xl border border-slate-200"
            >
              {createdChildren.map((child) => (
                <div
                  key={child.id}
                  className="bg-white border-2 border-slate-300 rounded-2xl p-4 text-center shadow-xs space-y-2.5 relative overflow-hidden"
                >
                  {/* Top Stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, #DC2626 0, #DC2626 10px, #FFFFFF 10px, #FFFFFF 20px, #1E3A8A 20px, #1E3A8A 30px)",
                    }}
                  />

                  <div className="flex items-center justify-between pt-1 border-b border-slate-100 pb-1">
                    <span className="text-[10px] font-black uppercase text-blue-900 tracking-wider">
                      🇭🇷 CroLingo Pass
                    </span>
                    <span className="text-[9px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">
                      Student Badge
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2.5">
                    <div className="relative w-10 h-10 rounded-full border border-amber-300 overflow-hidden shrink-0">
                      <Image
                        src={child.userImageSrc || "/avatars/pasko.png"}
                        alt={child.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-black text-slate-900 leading-tight">
                        {child.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 font-bold">
                        @{child.username}
                      </p>
                    </div>
                  </div>

                  {child.qrCodeUrl && (
                    <div className="py-1">
                      <div className="p-1.5 bg-white rounded-xl border border-slate-200 inline-block shadow-2xs">
                        <img
                          src={child.qrCodeUrl}
                          alt={`QR for ${child.name}`}
                          className="w-28 h-28 mx-auto"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-blue-900 mt-1 flex items-center justify-center gap-1">
                        <QrCode className="h-3 w-3" />
                        Scan with tablet camera for 1-tap login
                      </p>
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-lg p-1.5 text-[10px] font-mono font-bold text-slate-700 border border-slate-200 flex justify-between px-2">
                    <span>User: {child.username}</span>
                    <span>Pass: {child.password}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                variant="primary"
                onClick={handlePrintSheet}
                className="h-11 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                <Printer className="h-4 w-4 mr-1.5" />
                Print Refrigerator Sheet
              </Button>
              <Button
                variant="primaryOutline"
                onClick={handleCopyAllLinks}
                className="h-11 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer"
              >
                {copiedLinks ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5 text-green-600" />
                    Links Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copy Login Links
                  </>
                )}
              </Button>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(2)}
                className="text-xs font-bold text-slate-500"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(4)}
                className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs h-11 px-6 rounded-xl cursor-pointer"
              >
                Next: Tablet Setup <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: TABLET HANDOFF ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 py-2">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 mx-auto flex items-center justify-center font-black text-2xl shadow-xs">
                🎉
              </div>
              <h3 className="text-xl font-black text-slate-900">
                You&apos;re All Set! How to Hand Off to Your Kids
              </h3>
              <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                Getting started on the living room iPad or tablet takes less than 30 seconds:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2 text-left">
                <span className="text-[10px] font-black uppercase text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  Method A (Fastest)
                </span>
                <h4 className="text-sm font-black text-slate-900">Instant Camera Scan</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Open the standard Camera app on the iPad and aim at the printed card. Tap the link to open CroLingo and log in directly into Unit 1!
                </p>
              </div>

              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2 text-left">
                <span className="text-[10px] font-black uppercase text-green-900 bg-green-100 px-2.5 py-0.5 rounded-full">
                  Method B (Netflix-Style)
                </span>
                <h4 className="text-sm font-black text-slate-900">1-Tap Profile Switcher</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Once each child scans their card on the tablet once, they can take turns anytime by tapping their face picture in <strong>&ldquo;Tko danas uči?&rdquo;</strong> without typing passwords.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={handleFinish}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm rounded-xl cursor-pointer"
              >
                Go to Parent Dashboard →
              </Button>
              <Button
                variant="primaryOutline"
                onClick={() => {
                  handleFinish();
                  router.push("/learn");
                }}
                className="flex-1 h-12 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-xl cursor-pointer"
              >
                Preview Learning Path
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
