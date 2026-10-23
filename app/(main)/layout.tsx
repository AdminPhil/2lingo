import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { isAdmin } from "@/lib/admin";

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
        <div className="max-w-[1056px] mx-auto pt-6 h-full">
          {children}
        </div>
      </main>
    </>
  );
};
 
export default MainLayout;
