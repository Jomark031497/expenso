import { Navbar } from "@/components/layouts/Navbar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] flex-1 overflow-auto px-4">
        <Outlet />
      </main>

      <Toaster position="bottom-center" />
    </>
  );
};
