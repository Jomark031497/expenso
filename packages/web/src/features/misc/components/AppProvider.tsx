import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        {children}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

const ErrorFallback = () => (
  <div role="alert">
    <h2>Oops! Something went wrong.</h2>
    <p>We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
  </div>
);
