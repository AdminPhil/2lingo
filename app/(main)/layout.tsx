import { auth } from "@clerk/nextjs";

import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { isAdmin } from "@/lib/admin";
import { getUserPods, getUserProgress } from "@/db/queries";
import { RoleOnboardingModal } from "@/components/modals/role-onboarding-modal";
import { ChildOnboardingModal } from "@/components/modals/child-onboarding-modal";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({
  children,
}: Props) => {
  const { userId } = auth();
  const admin = await isAdmin();
  const userProgress = await getUserProgress();
  const userPods = await getUserPods();

  const needsRoleOnboarding = !!userId && userProgress?.role === "unassigned";
  const needsChildOnboarding = !!userId && userProgress?.role === "learner" && userPods.length === 0;

  return (
    <>
      <MobileHeader isAdmin={admin} />
      <Sidebar className="hidden lg:flex" isAdmin={admin} />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="max-w-[1056px] mx-auto pt-6 h-full">
          {children}
        </div>
      </main>
      <RoleOnboardingModal initialOpen={needsRoleOnboarding} />
      <ChildOnboardingModal initialOpen={needsChildOnboarding} />
    </>
  );
};
 
export default MainLayout;
