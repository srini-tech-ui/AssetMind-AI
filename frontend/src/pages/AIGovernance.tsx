"use client";

import React, { useState } from "react";

import {
  Bot,
  BrainCircuit,
  Database,
  ShieldCheck,
  Search,
  Server,
  FileText,
  CheckCircle2,
  Lock,
  Shield,
  Network,
  Activity,
  KeyRound,
  Workflow,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  BookOpen,
  Terminal,
  CircleCheck,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";


/* ============================================
   TYPES
============================================ */

interface RAGResult {
  citation_id: string;
  title: string;
  document_type: string;
  excerpt: string;
  relevance_score: number;
  document_id: string;
  chunk_index: number;
}


interface RAGResponse {
  query: string;
  result_count: number;
  results: RAGResult[];
}


/* ============================================
   CONFIGURATION
============================================ */

const API_BASE_URL =
  "http://127.0.0.1:8000/api/v1";


/* ============================================
   MAIN COMPONENT
============================================ */

const AIGovernance = () => {

  const [query, setQuery] = useState(
    "When should a production server be reviewed for replacement?"
  );

  const [results, setResults] =
    useState<RAGResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  /* ==========================================
     RAG SEARCH
  ========================================== */

  const handleSearch = async () => {

    if (query.trim().length < 3) {

      setError(
        "Please enter at least 3 characters."
      );

      return;

    }

    setLoading(true);

    setError(null);


    try {

      const response =
        await fetch(

          `${API_BASE_URL}/rag/search?q=${encodeURIComponent(
            query
          )}&limit=5`

        );


      if (!response.ok) {

        throw new Error(
          `RAG API returned HTTP ${response.status}`
        );

      }


      const data: RAGResponse =
        await response.json();


      setResults(data);

    } catch (err) {

      console.error(
        "RAG search failed:",
        err
      );

      setError(
        "Unable to connect to the RAG API. " +
        "Make sure the FastAPI backend is running on port 8000."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="space-y-6">


      {/* ===================================== */}
      {/* PAGE HEADER */}
      {/* ===================================== */}

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                text-white
                shadow-sm
              "
            >

              <BrainCircuit className="h-6 w-6" />

            </div>


            <div>

              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >

                AI Intelligence & Governance

              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-600
                "
              >

                Enterprise AI Agent, Retrieval-Augmented Generation,
                MCP integration and security governance.

              </p>

            </div>

          </div>

        </div>


        <Badge
          className="
            w-fit
            border
            border-green-200
            bg-green-50
            px-3
            py-1.5
            text-green-700
          "
        >

          <CheckCircle2 className="mr-2 h-4 w-4" />

          AI Platform Operational

        </Badge>

      </div>



      {/* ===================================== */}
      {/* PLATFORM STATUS */}
      {/* ===================================== */}

      <Card>

        <CardHeader>

          <CardTitle
            className="
              flex
              items-center
              gap-2
              text-lg
            "
          >

            <Activity className="h-5 w-5 text-blue-600" />

            AI Platform Architecture

          </CardTitle>


          <CardDescription>

            Current implementation status of the
            AI intelligence and governance components.

          </CardDescription>

        </CardHeader>


        <CardContent>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
              xl:grid-cols-4
            "
          >


            {/* AI AGENT */}

            <StatusCard

              icon={
                <Bot className="h-6 w-6" />
              }

              title="AI Agent"

              description="
                Asset intelligence, context analysis
                and recommendation generation.
              "

              status="Implemented"

              tone="blue"

            />


            {/* RAG */}

            <StatusCard

              icon={
                <Database className="h-6 w-6" />
              }

              title="RAG Knowledge Base"

              description="
                ChromaDB semantic search over
                approved enterprise knowledge.
              "

              status="Operational"

              tone="purple"

            />


            {/* MCP */}

            <StatusCard

              icon={
                <Network className="h-6 w-6" />
              }

              title="MCP Integration"

              description="
                Controlled tool access and
                structured enterprise operations.
              "

              status="Integrated"

              tone="orange"

            />


            {/* SECURITY */}

            <StatusCard

              icon={
                <ShieldCheck className="h-6 w-6" />
              }

              title="Security Controls"

              description="
                Permissions, dependencies,
                approvals and audit controls.
              "

              status="Enabled"

              tone="green"

            />

          </div>

        </CardContent>

      </Card>



      {/* ===================================== */}
      {/* AI AGENT */}
      {/* ===================================== */}

      <Card>

        <CardHeader>

          <CardTitle
            className="
              flex
              items-center
              gap-2
              text-lg
            "
          >

            <Bot className="h-5 w-5 text-blue-600" />

            AI Asset Intelligence Agent

          </CardTitle>


          <CardDescription>

            The AI agent combines enterprise asset
            signals and approved knowledge to support
            explainable recommendations.

          </CardDescription>

        </CardHeader>


        <CardContent>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-3
            "
          >


            <FeatureCard

              icon={
                <Search className="h-5 w-5" />
              }

              title="Context Gathering"

              description="
                Collects asset, lifecycle, risk,
                compliance and cost signals.
              "

            />


            <FeatureCard

              icon={
                <BrainCircuit className="h-5 w-5" />
              }

              title="Reasoning Layer"

              description="
                Evaluates available evidence and
                identifies relevant asset conditions.
              "

            />


            <FeatureCard

              icon={
                <Sparkles className="h-5 w-5" />
              }

              title="Explainable Output"

              description="
                Produces recommendations with
                findings, evidence and actions.
              "

            />

          </div>


          <div
            className="
              mt-5
              rounded-lg
              border
              border-blue-200
              bg-blue-50
              p-4
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <Terminal
                className="
                  mt-0.5
                  h-5
                  w-5
                  text-blue-600
                "
              />


              <div>

                <p
                  className="
                    font-medium
                    text-blue-900
                  "
                >

                  AI Agent Execution Flow

                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    text-blue-800
                  "
                >

                  Enterprise Data →
                  Context Analysis →
                  RAG Knowledge Retrieval →
                  Evidence Evaluation →
                  Recommendation →
                  Approval / Workflow

                </p>

              </div>

            </div>

          </div>

        </CardContent>

      </Card>



      {/* ===================================== */}
      {/* RAG KNOWLEDGE BASE */}
      {/* ===================================== */}

      <Card>

        <CardHeader>

          <div
            className="
              flex
              flex-col
              gap-3
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            <div>

              <CardTitle
                className="
                  flex
                  items-center
                  gap-2
                  text-lg
                "
              >

                <Database
                  className="
                    h-5
                    w-5
                    text-purple-600
                  "
                />

                RAG Semantic Knowledge Search

              </CardTitle>


              <CardDescription
                className="mt-1"
              >

                Search approved enterprise knowledge
                using ChromaDB vector embeddings.

              </CardDescription>

            </div>


            <Badge
              variant="outline"
              className="
                w-fit
                border-purple-200
                bg-purple-50
                text-purple-700
              "
            >

              <Database className="mr-2 h-3.5 w-3.5" />

              ChromaDB

            </Badge>

          </div>

        </CardHeader>


        <CardContent
          className="space-y-5"
        >


          {/* RAG STATS */}

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-3
            "
          >

            <MetricCard
              label="Knowledge Documents"
              value="1"
              icon={
                <FileText className="h-4 w-4" />
              }
            />


            <MetricCard
              label="Indexed Chunks"
              value="2"
              icon={
                <BookOpen className="h-4 w-4" />
              }
            />


            <MetricCard
              label="Vector Store"
              value="ChromaDB"
              icon={
                <Server className="h-4 w-4" />
              }
            />

          </div>



          {/* SEARCH */}

          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              p-4
            "
          >

            <div
              className="
                flex
                flex-col
                gap-3
                md:flex-row
              "
            >

              <div className="flex-1">

                <Input

                  value={query}

                  onChange={
                    (event) =>
                      setQuery(
                        event.target.value
                      )
                  }

                  onKeyDown={
                    (event) => {

                      if (
                        event.key === "Enter"
                      ) {

                        handleSearch();

                      }

                    }
                  }

                  placeholder="
                    Ask a question about enterprise
                    asset lifecycle policy...
                  "

                  className="bg-white"

                />

              </div>


              <Button

                onClick={handleSearch}

                disabled={loading}

                className="
                  min-w-[150px]
                "
              >

                {loading ? (

                  <>
                    <Loader2
                      className="
                        mr-2
                        h-4
                        w-4
                        animate-spin
                      "
                    />

                    Searching...

                  </>

                ) : (

                  <>
                    <Search
                      className="
                        mr-2
                        h-4
                        w-4
                      "
                    />

                    Search Knowledge

                  </>

                )}

              </Button>

            </div>


            <p
              className="
                mt-2
                text-xs
                text-slate-500
              "
            >

              Read-only semantic search.
              The UI cannot modify the
              ChromaDB knowledge store.

            </p>

          </div>



          {/* ERROR */}

          {error && (

            <div
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-red-200
                bg-red-50
                p-3
                text-sm
                text-red-700
              "
            >

              <AlertTriangle
                className="
                  h-4
                  w-4
                "
              />

              {error}

            </div>

          )}



          {/* RESULTS */}

          {results && (

            <div
              className="space-y-3"
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <h3
                    className="
                      font-semibold
                      text-slate-900
                    "
                  >

                    Semantic Search Results

                  </h3>


                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >

                    {results.result_count}
                    {" "}
                    knowledge chunk
                    {results.result_count === 1
                      ? ""
                      : "s"}
                    {" "}
                    retrieved

                  </p>

                </div>


                <Badge
                  className="
                    bg-green-100
                    text-green-700
                  "
                >

                  <CircleCheck
                    className="
                      mr-1
                      h-3.5
                      w-3.5
                    "
                  />

                  RAG Response

                </Badge>

              </div>



              {results.results.map(
                (result) => (

                  <div

                    key={
                      result.citation_id
                    }

                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        md:flex-row
                        md:items-start
                        md:justify-between
                      "
                    >

                      <div
                        className="flex-1"
                      >

                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >

                          <FileText
                            className="
                              h-4
                              w-4
                              text-purple-600
                            "
                          />

                          <span
                            className="
                              font-semibold
                              text-slate-900
                            "
                          >

                            {result.title}

                          </span>


                          <Badge
                            variant="outline"
                          >

                            {result.document_type}

                          </Badge>

                        </div>


                        <p
                          className="
                            mt-3
                            text-sm
                            leading-6
                            text-slate-700
                          "
                        >

                          {result.excerpt}

                        </p>

                      </div>


                      <div
                        className="
                          min-w-[150px]
                          rounded-lg
                          bg-slate-50
                          p-3
                          text-xs
                        "
                      >

                        <p
                          className="
                            text-slate-500
                          "
                        >

                          Relevance Score

                        </p>


                        <p
                          className="
                            mt-1
                            text-lg
                            font-bold
                            text-green-600
                          "
                        >

                          {result.relevance_score}

                        </p>


                        <p
                          className="
                            mt-3
                            text-slate-500
                          "
                        >

                          Citation

                        </p>


                        <p
                          className="
                            mt-1
                            break-all
                            font-mono
                            text-[10px]
                            text-slate-700
                          "
                        >

                          {result.citation_id}

                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </CardContent>

      </Card>



      {/* ===================================== */}
      {/* MCP */}
      {/* ===================================== */}

      <Card>

        <CardHeader>

          <CardTitle
            className="
              flex
              items-center
              gap-2
              text-lg
            "
          >

            <Network
              className="
                h-5
                w-5
                text-orange-600
              "
            />

            MCP Integration Layer

          </CardTitle>


          <CardDescription>

            Model Context Protocol provides
            structured and controlled interaction
            between AI capabilities and enterprise
            operations.

          </CardDescription>

        </CardHeader>


        <CardContent>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-3
            "
          >

            <FeatureCard

              icon={
                <Network className="h-5 w-5" />
              }

              title="Controlled Tool Access"

              description="
                AI operations are exposed through
                structured tool interfaces.
              "

            />


            <FeatureCard

              icon={
                <Workflow className="h-5 w-5" />
              }

              title="Enterprise Workflows"

              description="
                AI recommendations can connect to
                approval and workflow processes.
              "

            />


            <FeatureCard

              icon={
                <Lock className="h-5 w-5" />
              }

              title="Read-Only Knowledge"

              description="
                RAG retrieval is separated from
                knowledge base modification.
              "

            />

          </div>

        </CardContent>

      </Card>



      {/* ===================================== */}
      {/* SECURITY */}
      {/* ===================================== */}

      <Card>

        <CardHeader>

          <CardTitle
            className="
              flex
              items-center
              gap-2
              text-lg
            "
          >

            <ShieldCheck
              className="
                h-5
                w-5
                text-green-600
              "
            />

            Security & Governance Controls

          </CardTitle>


          <CardDescription>

            Security controls protect enterprise
            data, AI operations and governance
            workflows.

          </CardDescription>

        </CardHeader>


        <CardContent>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
              xl:grid-cols-4
            "
          >

            <SecurityCard

              icon={
                <KeyRound className="h-5 w-5" />
              }

              title="RBAC Permissions"

              description="
                Role-based permission controls
                govern access to protected actions.
              "

            />


            <SecurityCard

              icon={
                <Shield className="h-5 w-5" />
              }

              title="Security Dependencies"

              description="
                Centralized dependencies support
                protected API access patterns.
              "

            />


            <SecurityCard

              icon={
                <CheckCircle2 className="h-5 w-5" />
              }

              title="Approval Controls"

              description="
                High-impact enterprise actions
                require appropriate approval.
              "

            />


            <SecurityCard

              icon={
                <FileText className="h-5 w-5" />
              }

              title="Audit Trail"

              description="
                Enterprise actions and workflow
                activity can be recorded for review.
              "

            />

          </div>


          <div
            className="
              mt-5
              rounded-xl
              border
              border-green-200
              bg-green-50
              p-4
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <ShieldCheck
                className="
                  mt-0.5
                  h-5
                  w-5
                  text-green-600
                "
              />


              <div>

                <p
                  className="
                    font-semibold
                    text-green-900
                  "
                >

                  Governance Principle

                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    text-green-800
                  "
                >

                  AI-generated recommendations are
                  supported by available enterprise
                  evidence and approved knowledge.
                  High-impact actions remain subject
                  to approval and workflow controls.

                </p>

              </div>

            </div>

          </div>

        </CardContent>

      </Card>

    </div>

  );

};


/* ============================================
   STATUS CARD
============================================ */

const StatusCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  tone: "blue" | "purple" | "orange" | "green";
}> = ({
  icon,
  title,
  description,
  status,
  tone,
}) => {

  const styles = {

    blue:
      "border-blue-200 bg-blue-50 text-blue-700",

    purple:
      "border-purple-200 bg-purple-50 text-purple-700",

    orange:
      "border-orange-200 bg-orange-50 text-orange-700",

    green:
      "border-green-200 bg-green-50 text-green-700",

  };


  return (

    <div
      className={`
        rounded-xl
        border
        p-4
        ${styles[tone]}
      `}
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        {icon}


        <CheckCircle2
          className="
            h-4
            w-4
          "
        />

      </div>


      <h3
        className="
          mt-4
          font-semibold
        "
      >

        {title}

      </h3>


      <p
        className="
          mt-2
          text-sm
          opacity-80
        "
      >

        {description}

      </p>


      <Badge
        className="
          mt-4
          bg-white/70
          text-current
          border
          border-current/20
        "
      >

        {status}

      </Badge>

    </div>

  );

};


/* ============================================
   FEATURE CARD
============================================ */

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({
  icon,
  title,
  description,
}) => (

  <div
    className="
      rounded-xl
      border
      border-slate-200
      bg-white
      p-4
    "
  >

    <div
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-lg
        bg-slate-100
        text-slate-700
      "
    >

      {icon}

    </div>


    <h3
      className="
        mt-4
        font-semibold
        text-slate-900
      "
    >

      {title}

    </h3>


    <p
      className="
        mt-2
        text-sm
        leading-6
        text-slate-600
      "
    >

      {description}

    </p>

  </div>

);


/* ============================================
   SECURITY CARD
============================================ */

const SecurityCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({
  icon,
  title,
  description,
}) => (

  <div
    className="
      rounded-xl
      border
      border-green-200
      bg-green-50
      p-4
    "
  >

    <div
      className="
        flex
        items-center
        gap-2
        text-green-700
      "
    >

      {icon}


      <span
        className="
          font-semibold
        "
      >

        {title}

      </span>

    </div>


    <p
      className="
        mt-3
        text-sm
        leading-6
        text-green-800
      "
    >

      {description}

    </p>


    <div
      className="
        mt-4
        flex
        items-center
        gap-1.5
        text-xs
        font-medium
        text-green-700
      "
    >

      <CircleCheck
        className="
          h-3.5
          w-3.5
        "
      />

      Enabled

    </div>

  </div>

);


/* ============================================
   METRIC CARD
============================================ */

const MetricCard: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({
  label,
  value,
  icon,
}) => (

  <div
    className="
      flex
      items-center
      justify-between
      rounded-lg
      border
      border-slate-200
      bg-white
      p-3
    "
  >

    <div>

      <p
        className="
          text-xs
          text-slate-500
        "
      >

        {label}

      </p>


      <p
        className="
          mt-1
          text-lg
          font-bold
          text-slate-900
        "
      >

        {value}

      </p>

    </div>


    <div
      className="
        text-purple-600
      "
    >

      {icon}

    </div>

  </div>

);


export default AIGovernance;