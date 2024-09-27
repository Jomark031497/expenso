import { AuthLayout } from "@/components/layouts/AuthLayout";
import { RootLayout } from "@/components/layouts/RootLayout";
import { AuthContextProvider } from "@/contexts/Auth";
import { Login } from "@/features/auth/routes/Login";
import { SignUp } from "@/features/auth/routes/SignUp";
import { Dashboard } from "@/features/dashboard/components/Dashboard";
import { AuthRoute } from "@/features/misc/components/AuthRoute";
import { ProtectedRoute } from "@/features/misc/components/ProtectedRoute";
import { SingleWallet } from "@/features/wallets/routes/SingleWallet";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthContextProvider />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            element: <ProtectedRoute />,
            children: [
              {
                index: true,
                element: <Dashboard />,
              },
              {
                path: "wallets",
                children: [
                  {
                    index: true,
                    element: <>Wallets</>,
                  },
                  {
                    path: ":walletId",
                    element: <SingleWallet />,
                  },
                ],
              },
              {
                path: "*",
                element: <p>404!</p>,
              },
            ],
          },
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            element: <AuthRoute />,
            children: [
              {
                index: true,
                element: <Navigate to="/auth/login" />,
              },
              {
                path: "login",
                element: <Login />,
              },
              {
                path: "sign-up",
                element: <SignUp />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
