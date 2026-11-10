"use client";

import React from "react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  Boxes,
  CircleDot,
  GitCompare,
  UserCircle2,

  Sparkles,
  ShieldAlert,
  Repeat,
  Wallet,
  Lightbulb,

  Bot,
  BrainCircuit,
  Database,
  ShieldCheck,

  CheckSquare,
  Workflow,
  History,
  FileText,
} from "lucide-react";


interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}


interface NavGroup {
  title: string;
  items: NavItem[];
}


const navGroups: NavGroup[] = [

  /* ========================================= */
  /* DISCOVER */
  /* ========================================= */

  {
    title: "DISCOVER",

    items: [

      {
        label: "Dashboard",
        to: "/",
        icon: LayoutDashboard,
      },

      {
        label: "Asset Inventory",
        to: "/inventory",
        icon: Boxes,
      },

      {
        label: "Asset 360",
        to: "/inventory/360",
        icon: CircleDot,
      },

      {
        label: "Reconciliation",
        to: "/reconciliation",
        icon: GitCompare,
      },

      {
        label: "Ownership",
        to: "/ownership",
        icon: UserCircle2,
      },

    ],
  },


  /* ========================================= */
  /* DECIDE */
  /* ========================================= */

  {
    title: "DECIDE",

    items: [

      {
        label: "AI Asset Advisor",
        to: "/advisor",
        icon: Sparkles,
      },

      {
        label: "Risk & Compliance",
        to: "/risk",
        icon: ShieldAlert,
      },

      {
        label: "Lifecycle",
        to: "/lifecycle",
        icon: Repeat,
      },

      {
        label: "Cost Optimization",
        to: "/cost",
        icon: Wallet,
      },

      {
        label: "Recommendations",
        to: "/recommendations",
        icon: Lightbulb,
      },

    ],
  },


  /* ========================================= */
  /* AI INTELLIGENCE */
  /* ========================================= */

  {
    title: "AI INTELLIGENCE",

    items: [

      {
        label: "AI Governance",
        to: "/ai-governance",
        icon: Bot,
      },

    ],
  },


  /* ========================================= */
  /* ACT */
  /* ========================================= */

  {
    title: "ACT",

    items: [

      {
        label: "Approvals",
        to: "/approvals",
        icon: CheckSquare,
      },

      {
        label: "Workflows",
        to: "/workflows",
        icon: Workflow,
      },

      {
        label: "Audit & History",
        to: "/audit",
        icon: History,
      },

      {
        label: "Reporting",
        to: "/reporting",
        icon: FileText,
      },

    ],
  },

];


const Sidebar: React.FC = () => {

  return (

    <aside
      className="
        w-60
        bg-slate-50
        border-r
        border-slate-200
        h-full
        flex
        flex-col
      "
    >

      {/* ===================================== */}
      {/* APPLICATION TITLE */}
      {/* ===================================== */}

      <div
        className="
          px-4
          py-4
          border-b
          border-slate-200
        "
      >

        <span
          className="
            text-sm
            font-semibold
            text-slate-800
            tracking-wide
          "
        >

          AI Asset Intelligence

        </span>

      </div>


      {/* ===================================== */}
      {/* NAVIGATION */}
      {/* ===================================== */}

      <nav
        className="
          flex-1
          overflow-y-auto
          py-3
        "
        aria-label="Main navigation"
      >

        {navGroups.map(
          (group) => (

            <div
              key={group.title}
              className="mb-4"
            >

              {/* GROUP TITLE */}

              <div
                className="
                  px-4
                  mb-1.5
                "
              >

                <span
                  className="
                    text-[10px]
                    font-semibold
                    tracking-widest
                    text-slate-500
                    uppercase
                  "
                >

                  {group.title}

                </span>

              </div>


              {/* NAVIGATION ITEMS */}

              <ul className="space-y-0.5">

                {group.items.map(
                  (item) => {

                    const Icon = item.icon;

                    return (

                      <li
                        key={item.to}
                      >

                        <NavLink

                          to={item.to}

                          end={
                            item.to === "/"
                          }

                          className={
                            ({ isActive }) =>

                              cn(

                                `
                                flex
                                items-center
                                gap-2.5
                                px-4
                                py-1.5
                                text-sm
                                transition-colors
                                `,

                                isActive

                                  ? `
                                    bg-blue-50
                                    text-blue-700
                                    border-l-2
                                    border-blue-700
                                    font-medium
                                    `

                                  : `
                                    text-slate-700
                                    hover:bg-slate-100
                                    border-l-2
                                    border-transparent
                                    `

                              )
                          }

                        >

                          <Icon
                            className="
                              h-4
                              w-4
                              shrink-0
                            "
                          />

                          <span className="truncate">

                            {item.label}

                          </span>

                        </NavLink>

                      </li>

                    );

                  }
                )}

              </ul>

            </div>

          )
        )}

      </nav>

    </aside>

  );

};


export default Sidebar;