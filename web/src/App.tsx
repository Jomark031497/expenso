import { AuthLayout } from "@/components/layouts/AuthLayout";
import { RootLayout } from "@/components/layouts/RootLayout";
import { AuthContextProvider } from "@/contexts/Auth";
import { AuthRoute } from "@/features/misc/components/AuthRoute";
import { ProtectedRoute } from "@/features/misc/components/ProtectedRoute";
import { Wallets } from "@/features/wallets/routes/Wallets";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Login } from "@/features/auth/routes/Login";
import { SignUp } from "@/features/auth/routes/SignUp";
import { SingleTransaction } from "@/features/transactions/routes/SingleTransaction";
import { TransactionsList } from "@/features/transactions/routes/TransactionsList";
import { SingleWallet } from "@/features/wallets/routes/SingleWallet";
import { Dashboard } from "@/features/misc/routes/Dashboard";

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
              { index: true, element: <Dashboard /> },
              {
                path: "wallets",
                children: [
                  { index: true, element: <Wallets /> },
                  {
                    path: ":walletId",
                    element: <SingleWallet />,
                  },
                ],
              },
              {
                path: "transactions",
                children: [
                  { index: true, element: <TransactionsList /> },
                  { path: ":transactionId", element: <SingleTransaction /> },
                ],
              },
              { path: "*", element: <p>404!</p> },
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
              { index: true, element: <Navigate to="/auth/login" /> },
              { path: "login", element: <Login /> },
              { path: "sign-up", element: <SignUp /> },
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
