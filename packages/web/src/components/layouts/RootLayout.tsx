import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layouts/Header";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const RootLayout = () => {
  return (
    <>
      <div id="root_layout" className="relative mx-auto h-screen max-w-md bg-background text-textSecondary shadow">
        <Header />
        <Breadcrumb />
        <main className="h-[calc(100vh-64px)] scroll-m-2 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};
