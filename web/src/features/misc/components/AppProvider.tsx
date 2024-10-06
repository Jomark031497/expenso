import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ErrorBoundary fallback={<>Something went wrong with the application</>}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        {children}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
