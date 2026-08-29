"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import InventoryDetail from "./pages/InventoryDetail";
import Asset360 from "./pages/Asset360";
import Reconciliation from "./pages/Reconciliation";
import Ownership from "./pages/Ownership";
import Advisor from "./pages/Advisor";
import Risk from "./pages/Risk";
import Lifecycle from "./pages/Lifecycle";
import Cost from "./pages/Cost";
import Recommendations from "./pages/Recommendations";
import Approvals from "./pages/Approvals";
import Workflows from "./pages/Workflows";
import Audit from "./pages/Audit";
import Reporting from "./pages/Reporting";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/360" element={<Asset360 />} />
            <Route path="inventory/:assetId" element={<InventoryDetail />} />
            <Route path="reconciliation" element={<Reconciliation />} />
            <Route path="ownership" element={<Ownership />} />
            <Route path="advisor" element={<Advisor />} />
            <Route path="risk" element={<Risk />} />
            <Route path="lifecycle" element={<Lifecycle />} />
            <Route path="cost" element={<Cost />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="audit" element={<Audit />} />
            <Route path="reporting" element={<Reporting />} />
            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;