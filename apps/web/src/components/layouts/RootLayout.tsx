import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { Sidebar } from "@/components/layouts/Sidebar";
import { Header } from "@/components/layouts/Header";
import { Backdrop } from "@/components/layouts/Backdrop";

export const RootLayout = () => {
  const { close, open, isOpen } = useToggle();

  return (
    <>
      <div id="root_layout" className="flex h-screen w-screen">
        <Sidebar isOpen={isOpen} />
        <div className="flex-1">
          <Header onMenuClick={open} />
          <main className="min-h-[calc(100vh-64px)] p-4">
            <Outlet />
          </main>
        </div>
      </div>
      <Backdrop isOpen={isOpen} onClick={close} />
      <Toaster position="bottom-center" />
    </>
  );
};
