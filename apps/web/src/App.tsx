import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./contexts/Auth";
import { RootLayout } from "./components/layouts/RootLayout";
import { Dashboard } from "./features/dashboard/components/Dashboard";
import { Login } from "./features/auth/routes/Login";
import { SignUp } from "./features/auth/routes/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthContextProvider />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      {
        path: "auth",
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
