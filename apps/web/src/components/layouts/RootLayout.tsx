import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <>
      <div className="md:flex">
        <main className="min-h-[100vh-64px] flex-1 overflow-auto px-4 md:h-screen">
          <div className="md:h-16" />
          <Outlet />
        </main>
      </div>
    </>
  );
};
