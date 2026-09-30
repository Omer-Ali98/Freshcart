"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Provider } from "react-redux";
import CompareProvider from "./CompareProvider";
import { store } from "@/store/store";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      }),
  );

  return (
    <SessionProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CompareProvider>{children}</CompareProvider>
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}
