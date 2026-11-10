"use client";

import React, { useMemo, useState } from "react";
import {
  mockWorkflows,
  mockWorkflowInstances,
} from "@/mocks/workflows";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Activity,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  GitBranch,
  ListChecks,
  PlayCircle,
  Workflow,
} from "lucide-react";

// ---------- Helper functions ----------

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";

    case "running":
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";

    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    case "failed":
    case "error":
      return "bg-red-100 text-red-800 border-red-200";

    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatLabel = (value: string) => {
  return value
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString();
};

// ---------- Workflows Page ----------

const Workflows = () => {
  const [expandedWorkflowId, setExpandedWorkflowId] =
    useState<string | null>(null);

  // ---------- Summary Metrics ----------

  const metrics = useMemo(() => {
    return {
      totalWorkflows: mockWorkflows.length,

      activeWorkflows: mockWorkflows.filter(
        (workflow) => workflow.status === "active"
      ).length,

      totalInstances: mockWorkflowInstances.length,

      runningInstances: mockWorkflowInstances.filter(
        (instance) => instance.status === "running"
      ).length,
    };
  }, []);

  return (
    <div className="space-y-6">

      {/* ---------- Header ---------- */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Workflow className="h-7 w-7 text-blue-600" />
          Workflows
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage automated workflows for asset processes.
        </p>
      </div>

      {/* ---------- Summary Cards ---------- */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workflows
            </CardTitle>

            <Workflow className="h-4 w-4 text-gray-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalWorkflows}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Workflow definitions available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workflows
            </CardTitle>

            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.activeWorkflows}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Currently active definitions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Workflow Runs
            </CardTitle>

            <GitBranch className="h-4 w-4 text-purple-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.totalInstances}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Recorded workflow instances
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Running
            </CardTitle>

            <PlayCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.runningInstances}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Workflows currently in progress
            </p>
          </CardContent>
        </Card>

      </div>

      {/* ---------- Workflow Definitions ---------- */}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Workflow className="h-5 w-5 text-blue-500" />
            Workflow Definitions
          </CardTitle>

          <p className="text-sm text-gray-500">
            View workflow configuration, triggers, processing steps, and workflow runs.
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">

            {mockWorkflows.map((workflow) => {
              const isExpanded =
                expandedWorkflowId === workflow.id;

              const instancesForWorkflow =
                mockWorkflowInstances.filter(
                  (instance) =>
                    instance.workflowId === workflow.id
                );

              return (
                <Card
                  key={workflow.id}
                  className="border border-gray-200 dark:border-gray-700"
                >
                  <CardContent className="p-5">

                    {/* Workflow Header */}

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div className="flex-1">

                        <div className="flex items-center gap-3 flex-wrap">

                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {workflow.name}
                          </h3>

                          <Badge
                            variant="outline"
                            className={getStatusColor(
                              workflow.status
                            )}
                          >
                            {formatLabel(workflow.status)}
                          </Badge>

                          <Badge variant="outline">
                            v{workflow.version}
                          </Badge>

                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {workflow.description}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">

                          <span>
                            Type:{" "}
                            <strong className="text-gray-700 dark:text-gray-300">
                              {formatLabel(workflow.type)}
                            </strong>
                          </span>

                          <span>
                            Trigger:{" "}
                            <strong className="text-gray-700 dark:text-gray-300">
                              {formatLabel(
                                workflow.trigger.type
                              )}
                            </strong>
                          </span>

                          <span>
                            Steps:{" "}
                            <strong className="text-gray-700 dark:text-gray-300">
                              {workflow.steps.length}
                            </strong>
                          </span>

                          <span>
                            Runs:{" "}
                            <strong className="text-gray-700 dark:text-gray-300">
                              {instancesForWorkflow.length}
                            </strong>
                          </span>

                        </div>

                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExpandedWorkflowId((current) =>
                            current === workflow.id
                              ? null
                              : workflow.id
                          )
                        }
                      >
                        {isExpanded ? (
                          <>
                            Hide Details
                            <ChevronUp className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            View Details
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>

                    </div>

                    {/* ---------- Expanded Details ---------- */}

                    {isExpanded && (

                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">

                        {/* Workflow Steps */}

                        <div>

                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                            <ListChecks className="h-5 w-5 text-blue-500" />
                            Workflow Steps
                          </h4>

                          <div className="space-y-3">

                            {[...workflow.steps]
                              .sort(
                                (a, b) =>
                                  a.order - b.order
                              )
                              .map((step, index) => (

                                <div
                                  key={step.id}
                                  className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                                >

                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                                    {index + 1}
                                  </div>

                                  <div className="flex-1">

                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                      {step.name}
                                    </div>

                                    <div className="text-sm text-gray-500 mt-1">
                                      {formatLabel(step.type)}
                                      {" • "}
                                      Assignee:{" "}
                                      {formatLabel(
                                        step.assigneeType
                                      )}
                                    </div>

                                  </div>

                                  <Badge variant="outline">
                                    Step {index + 1}
                                  </Badge>

                                </div>

                              ))}

                          </div>

                        </div>

                        {/* Workflow Runs */}

                        <div>

                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                            <Activity className="h-5 w-5 text-purple-500" />
                            Workflow Runs
                          </h4>

                          {instancesForWorkflow.length === 0 ? (

                            <div className="text-sm text-gray-500 p-4 border rounded-lg">
                              No workflow runs are currently available for this workflow.
                            </div>

                          ) : (

                            <div className="space-y-3">

                              {instancesForWorkflow.map(
                                (instance) => (

                                  <div
                                    key={instance.id}
                                    className="p-4 rounded-lg border dark:border-gray-700"
                                  >

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                                      <div>

                                        <div className="flex items-center gap-2 flex-wrap">

                                          <span className="font-medium text-gray-900 dark:text-gray-100">
                                            Run {instance.id}
                                          </span>

                                          <Badge
                                            variant="outline"
                                            className={getStatusColor(
                                              instance.status
                                            )}
                                          >
                                            {formatLabel(
                                              instance.status
                                            )}
                                          </Badge>

                                        </div>

                                        <div className="text-sm text-gray-500 mt-2">
                                          Started:{" "}
                                          {formatDate(
                                            instance.startedAt
                                          )}
                                        </div>

                                      </div>

                                      <div className="text-sm text-gray-500">
                                        Current Step:{" "}

                                        <strong className="text-gray-700 dark:text-gray-300">
                                          {instance.currentStepId ??
                                            "Completed"}
                                        </strong>
                                      </div>

                                    </div>

                                    {instance.steps &&
                                      instance.steps.length > 0 && (

                                        <div className="mt-4 border-t pt-4 space-y-2">

                                          {instance.steps.map(
                                            (step) => (

                                              <div
                                                key={step.stepId}
                                                className="flex items-center justify-between text-sm"
                                              >

                                                <span className="text-gray-700 dark:text-gray-300">
                                                  {step.name}
                                                </span>

                                                <Badge
                                                  variant="outline"
                                                  className={getStatusColor(
                                                    step.status
                                                  )}
                                                >
                                                  {formatLabel(
                                                    step.status
                                                  )}
                                                </Badge>

                                              </div>

                                            )
                                          )}

                                        </div>

                                      )}

                                  </div>

                                )
                              )}

                            </div>

                          )}

                        </div>

                      </div>

                    )}

                  </CardContent>
                </Card>
              );
            })}

          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default Workflows;