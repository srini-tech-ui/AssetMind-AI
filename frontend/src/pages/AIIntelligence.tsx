"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  Search,
  Database,
  ShieldCheck,
  Bot,
  Network,
  FileText,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Server,
  KeyRound,
  Eye,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


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


const API_BASE_URL = "http://127.0.0.1:8000";


const AIIntelligence = () => {

  const [query, setQuery] = useState(
    "When should a production server be reviewed for replacement?"
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [ragResponse, setRagResponse] =
    useState<RAGResponse | null>(null);


  const performRAGSearch = async () => {

    if (query.trim().length < 3) {

      setError(
        "Please enter at least 3 characters."
      );

      return;
    }

    setLoading(true);

    setError(null);

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/v1/rag/search?q=${encodeURIComponent(
          query
        )}&limit=5`
      );

      if (!response.ok) {

        throw new Error(
          `RAG API request failed with status ${response.status}`
        );
      }

      const data: RAGResponse =
        await response.json();

      setRagResponse(data);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the RAG service."
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

      <div>

        <div className="flex items-center gap-3">

          <div className="p-3 rounded-xl bg-blue-100">

            <BrainCircuit className="h-7 w-7 text-blue-700" />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">

              AI Intelligence Center

            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-1">

              Enterprise AI Agent powered by Retrieval-Augmented Generation,
              ChromaDB knowledge retrieval, MCP integration patterns,
              and secure evidence-based decision support.

            </p>

          </div>

        </div>

      </div>


      {/* ===================================== */}
      {/* ARCHITECTURE STATUS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">


        <StatusCard
          icon={<Bot className="h-5 w-5" />}
          title="AI Agent"
          description="Decision orchestration and evidence analysis"
          status="ACTIVE"
          tone="blue"
        />


        <StatusCard
          icon={<Database className="h-5 w-5" />}
          title="RAG Knowledge Base"
          description="ChromaDB semantic vector retrieval"
          status="ONLINE"
          tone="green"
        />


        <StatusCard
          icon={<Network className="h-5 w-5" />}
          title="MCP Integration"
          description="Controlled tool and system integration layer"
          status="READY"
          tone="purple"
        />


        <StatusCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Security Layer"
          description="Role permissions and protected dependencies"
          status="ENABLED"
          tone="orange"
        />

      </div>


      {/* ===================================== */}
      {/* RAG SEARCH */}
      {/* ===================================== */}

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <Search className="h-5 w-5 text-blue-600" />

            Semantic Knowledge Search

          </CardTitle>

          <CardDescription>

            Search the approved enterprise knowledge base using
            Retrieval-Augmented Generation (RAG).

            The vector store is read-only from this interface.

          </CardDescription>

        </CardHeader>


        <CardContent className="space-y-4">


          <div className="flex flex-col md:flex-row gap-3">

            <div className="flex-1">

              <Input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Ask a question about enterprise asset policies..."
              />

            </div>


            <Button
              onClick={performRAGSearch}
              disabled={loading}
              className="min-w-[160px]"
            >

              {loading ? (

                <>

                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />

                  Searching...

                </>

              ) : (

                <>

                  <Search className="h-4 w-4 mr-2" />

                  Search Knowledge

                </>

              )}

            </Button>

          </div>


          {/* ERROR */}

          {error && (

            <div className="flex items-center gap-2 p-4 border border-red-200 bg-red-50 rounded-lg">

              <AlertCircle className="h-5 w-5 text-red-600" />

              <span className="text-sm text-red-700">

                {error}

              </span>

            </div>

          )}


          {/* RESULTS */}

          {ragResponse && (

            <div className="space-y-4">

              <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">

                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <div>

                  <p className="font-medium text-gray-900">

                    Knowledge retrieval completed

                  </p>

                  <p className="text-sm text-gray-600">

                    {ragResponse.result_count} evidence chunk
                    {ragResponse.result_count === 1 ? "" : "s"} retrieved
                    from the approved ChromaDB knowledge base.

                  </p>

                </div>

              </div>


              <div className="space-y-3">

                {ragResponse.results.map(
                  (result, index) => (

                    <div
                      key={result.citation_id}
                      className="border rounded-xl p-5 bg-white dark:bg-gray-800"
                    >

                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">


                        <div className="flex items-start gap-3">


                          <div className="p-2 rounded-lg bg-blue-50">

                            <FileText className="h-5 w-5 text-blue-600" />

                          </div>


                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">

                                Evidence {index + 1}

                              </h3>


                              <Badge variant="outline">

                                {result.document_type}

                              </Badge>


                              <Badge
                                variant="outline"
                                className="font-mono"
                              >

                                {result.citation_id}

                              </Badge>

                            </div>


                            <p className="text-sm text-gray-500 mt-1">

                              {result.title}

                            </p>

                          </div>

                        </div>


                        <div className="text-left md:text-right">

                          <p className="text-xs text-gray-500">

                            Relevance Score

                          </p>

                          <p className="text-lg font-bold text-green-600">

                            {(result.relevance_score * 100).toFixed(1)}%

                          </p>

                        </div>

                      </div>


                      <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border">

                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">

                          {result.excerpt}

                        </p>

                      </div>


                      <div className="flex flex-wrap gap-2 mt-4">

                        <Badge variant="secondary">

                          Document: {result.document_id}

                        </Badge>

                        <Badge variant="secondary">

                          Chunk: {result.chunk_index}

                        </Badge>

                        <Badge variant="secondary">

                          Source: Approved Knowledge Base

                        </Badge>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </CardContent>

      </Card>


      {/* ===================================== */}
      {/* AI AGENT + MCP */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        {/* AI AGENT */}

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-purple-600" />

              AI Agent Decision Flow

            </CardTitle>

            <CardDescription>

              Evidence-driven AI orchestration architecture.

            </CardDescription>

          </CardHeader>


          <CardContent>

            <div className="space-y-4">

              <FlowStep
                number="1"
                title="Receive Asset Question"
                description="The AI Agent receives an enterprise asset decision request."
                icon={<Bot className="h-4 w-4" />}
              />


              <FlowStep
                number="2"
                title="Retrieve Knowledge"
                description="Relevant enterprise policy evidence is retrieved using semantic search."
                icon={<Search className="h-4 w-4" />}
              />


              <FlowStep
                number="3"
                title="Analyze Evidence"
                description="The AI Agent evaluates retrieved evidence together with available asset information."
                icon={<BrainCircuit className="h-4 w-4" />}
              />


              <FlowStep
                number="4"
                title="Generate Explainable Recommendation"
                description="Recommendations include evidence references and require appropriate approval workflows."
                icon={<CheckCircle2 className="h-4 w-4" />}
              />

            </div>

          </CardContent>

        </Card>


        {/* MCP */}

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Network className="h-5 w-5 text-indigo-600" />

              MCP Integration Layer

            </CardTitle>

            <CardDescription>

              Controlled tool integration between AI capabilities and enterprise services.

            </CardDescription>

          </CardHeader>


          <CardContent>

            <div className="space-y-4">


              <IntegrationRow
                icon={<Database className="h-5 w-5" />}
                name="Knowledge Retrieval Tool"
                detail="Approved policy and documentation retrieval"
                status="CONNECTED"
              />


              <IntegrationRow
                icon={<Server className="h-5 w-5" />}
                name="Asset Intelligence Tool"
                detail="Controlled access to enterprise asset information"
                status="READY"
              />


              <IntegrationRow
                icon={<FileText className="h-5 w-5" />}
                name="Evidence & Citation Tool"
                detail="Traceable evidence references for AI recommendations"
                status="ACTIVE"
              />


              <IntegrationRow
                icon={<Lock className="h-5 w-5" />}
                name="Permission Gateway"
                detail="Security boundaries before tool execution"
                status="ENFORCED"
              />


            </div>

          </CardContent>

        </Card>

      </div>


      {/* ===================================== */}
      {/* SECURITY */}
      {/* ===================================== */}

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <ShieldCheck className="h-5 w-5 text-green-600" />

            Enterprise Security Controls

          </CardTitle>

          <CardDescription>

            Security controls implemented around AI, RAG,
            API access, and enterprise actions.

          </CardDescription>

        </CardHeader>


        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">


            <SecurityCard
              icon={<KeyRound className="h-5 w-5" />}
              title="Role Permissions"
              detail="Permission checks through the application security layer."
            />


            <SecurityCard
              icon={<Lock className="h-5 w-5" />}
              title="Read-Only RAG Access"
              detail="Knowledge search does not expose vector store modification."
            />


            <SecurityCard
              icon={<Eye className="h-5 w-5" />}
              title="Evidence Traceability"
              detail="Retrieved chunks include document and citation identifiers."
            />


            <SecurityCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Controlled Actions"
              detail="High-impact asset actions remain subject to approval workflows."
            />


          </div>

        </CardContent>

      </Card>


    </div>

  );

};


const StatusCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  tone: "blue" | "green" | "purple" | "orange";
}> = ({
  icon,
  title,
  description,
  status,
  tone,
}) => {

  const tones = {

    blue:
      "bg-blue-50 border-blue-200 text-blue-700",

    green:
      "bg-green-50 border-green-200 text-green-700",

    purple:
      "bg-purple-50 border-purple-200 text-purple-700",

    orange:
      "bg-orange-50 border-orange-200 text-orange-700",

  };


  return (

    <Card className={tones[tone]}>

      <CardContent className="p-5">

        <div className="flex items-start justify-between">

          <div className="p-2 rounded-lg bg-white/70">

            {icon}

          </div>


          <Badge variant="outline">

            {status}

          </Badge>

        </div>


        <h3 className="font-semibold mt-4">

          {title}

        </h3>


        <p className="text-xs mt-1 opacity-80">

          {description}

        </p>

      </CardContent>

    </Card>

  );

};


const FlowStep: React.FC<{
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({
  number,
  title,
  description,
  icon,
}) => (

  <div className="flex gap-4">

    <div className="flex flex-col items-center">

      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">

        {number}

      </div>

    </div>


    <div className="pb-4">

      <div className="flex items-center gap-2">

        {icon}

        <h3 className="font-semibold">

          {title}

        </h3>

      </div>


      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">

        {description}

      </p>

    </div>

  </div>

);


const IntegrationRow: React.FC<{
  icon: React.ReactNode;
  name: string;
  detail: string;
  status: string;
}> = ({
  icon,
  name,
  detail,
  status,
}) => (

  <div className="flex items-center justify-between gap-3 p-4 border rounded-lg">

    <div className="flex items-center gap-3">

      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">

        {icon}

      </div>


      <div>

        <p className="font-medium">

          {name}

        </p>


        <p className="text-xs text-gray-500">

          {detail}

        </p>

      </div>

    </div>


    <Badge className="bg-green-100 text-green-700 border-green-200">

      {status}

    </Badge>

  </div>

);


const SecurityCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  detail: string;
}> = ({
  icon,
  title,
  detail,
}) => (

  <div className="p-4 border rounded-xl">

    <div className="flex items-center gap-2 text-green-600">

      {icon}

      <CheckCircle2 className="h-4 w-4" />

    </div>


    <h3 className="font-semibold mt-3">

      {title}

    </h3>


    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">

      {detail}

    </p>

  </div>

);


export default AIIntelligence;