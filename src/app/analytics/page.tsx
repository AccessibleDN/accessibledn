"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnalyticsViewer from "~/components/AnalyticsViewer";
import Navbar from "~/components/Navbar";

export default function AnalyticsPage() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <AnalyticsViewer />
    </QueryClientProvider>
  );
}