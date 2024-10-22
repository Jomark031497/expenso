import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <>
      <main className="flex h-[100vh] flex-col items-center justify-center p-4">
        <Outlet />
      </main>

      <Toaster position="bottom-center" />
    </>
  );
};
