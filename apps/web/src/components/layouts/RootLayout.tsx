import { Navbar } from "@/components/layouts/Navbar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <>
      <Navbar />

      <div className="md:flex">
        <main className="min-h-[100vh-64px] flex-1 overflow-auto px-4 md:h-screen">
          <div className="md:h-16" />
          <Outlet />
        </main>
      </div>

      <Toaster position="bottom-center" />
    </>
  );
};
