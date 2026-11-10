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

// ============================================
// AI GOVERNANCE
// ============================================
//
// This page displays:
// - AI Agent implementation
// - RAG semantic search
// - MCP integration
// - Security implementation
//
import AIGovernance from "./pages/AIGovernance";


const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>

      <Toaster />
      <Sonner />

      <BrowserRouter>

        <Routes>

          {/* ================================= */}
          {/* MAIN APPLICATION LAYOUT */}
          {/* ================================= */}

          <Route
            path="/"
            element={<Layout />}
          >

            {/* DASHBOARD */}

            <Route
              index
              element={<Index />}
            />


            {/* ================================= */}
            {/* DISCOVER */}
            {/* ================================= */}

            <Route
              path="inventory"
              element={<Inventory />}
            />

            <Route
              path="inventory/360"
              element={<Asset360 />}
            />

            <Route
              path="inventory/:assetId"
              element={<InventoryDetail />}
            />

            <Route
              path="reconciliation"
              element={<Reconciliation />}
            />

            <Route
              path="ownership"
              element={<Ownership />}
            />


            {/* ================================= */}
            {/* DECIDE */}
            {/* ================================= */}

            <Route
              path="advisor"
              element={<Advisor />}
            />

            <Route
              path="risk"
              element={<Risk />}
            />

            <Route
              path="lifecycle"
              element={<Lifecycle />}
            />

            <Route
              path="cost"
              element={<Cost />}
            />

            <Route
              path="recommendations"
              element={<Recommendations />}
            />


            {/* ================================= */}
            {/* AI GOVERNANCE */}
            {/* ================================= */}

            <Route
              path="ai-governance"
              element={<AIGovernance />}
            />


            {/* ================================= */}
            {/* ACT */}
            {/* ================================= */}

            <Route
              path="approvals"
              element={<Approvals />}
            />

            <Route
              path="workflows"
              element={<Workflows />}
            />

            <Route
              path="audit"
              element={<Audit />}
            />

            <Route
              path="reporting"
              element={<Reporting />}
            />

            <Route
              path="unauthorized"
              element={<Unauthorized />}
            />

          </Route>


          {/* ================================= */}
          {/* FALLBACK */}
          {/* ================================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);


export default App;