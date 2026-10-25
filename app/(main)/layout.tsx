import { Suspense } from "react";
import { auth } from "@clerk/nextjs";

import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { isAdmin } from "@/lib/admin";
import { RoleOnboardingModal } from "@/components/modals/role-onboarding-modal";
import { ChildOnboardingModal } from "@/components/modals/child-onboarding-modal";
import { ParentalGateModal } from "@/components/modals/parental-gate-modal";
import { ProfileSwitcherModal } from "@/components/modals/profile-switcher-modal";
import { AutoJoinPod } from "@/components/auto-join-pod";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({
  children,
}: Props) => {
  const admin = await isAdmin();

  return (
    <>
      <MobileHeader isAdmin={admin} />
      <Sidebar className="hidden lg:flex" isAdmin={admin} />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="max-w-[1056px] mx-auto pt-6 h-full w-full">
          {children}
        </div>
      </main>

      <Suspense fallback={null}>
        <AutoJoinPod />
      </Suspense>

      <ParentalGateModal />
      <ProfileSwitcherModal />
      <RoleOnboardingModal initialOpen={false} />
      <ChildOnboardingModal initialOpen={false} />
    </>
  );
};
 
export default MainLayout;
