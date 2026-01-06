import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Database, RefreshCw, Send, Terminal, AlertCircle, History } from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axios";
import API_ENDPOINTS from "../api/apiEndpoints";
import { useUser } from "@clerk/clerk-react";



export default function UserDatabase() {
  
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const {user} = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [schema, setSchema] = useState(null);
  const [schemaLoading, setSchemaLoading] = useState(false);

  const [queryLoading, setQueryLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  /* =========================
     FETCH DB SCHEMA
     ========================= */
  const fetchSchema = async () => {
    try {
      setSchemaLoading(true);
      setError(null);

      const res = await api.post(
        API_ENDPOINTS.DATABASE.EXTRACT_SCHEMA(connectionId)
      );

      setSchema(res.formattedSchema);
      toast.success("Schema loaded successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch schema");
      toast.error("Failed to fetch schema");
    } finally {
      setSchemaLoading(false);
    }
  };

  /* =========================
     EXECUTE NL QUERY
     ========================= */
  const executeQuery = async (data) => {
    try {
      setQueryLoading(true);
      setOutput(null);
      setError(null);

      const res = await api.post(API_ENDPOINTS.QUERY.EXECUTE, {
        connectionId,
        question: data.nlQuery,
      });

      setOutput(res.results);
      reset();
      toast.success("Query executed successfully");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Query execution failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setQueryLoading(false);
    }
  };

  /* =========================
     INITIAL LOAD
     ========================= */
  useEffect(() => {
    fetchSchema();
  }, [connectionId]);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/db-buddy-bg2.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-slate-950/85" />
          
          {/* Subtle Gradient Overlays */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-400/8 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-400/8 rounded-full filter blur-3xl"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-24 px-4 pb-12">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
                    <Database className="w-10 h-10 md:w-12 md:h-12 text-blue-300" />
                    {user ? `${user.firstName}'s Database ` : "Database"}
                  </h1>
                  <p className="text-slate-200/80">Ask questions in natural language and explore your database schema</p>
                </div>
                
                <button
                  onClick={() => navigate(`/history/${connectionId}`)}
                  className="flex items-center gap-2 px-5 py-3 backdrop-blur-xl bg-white/20 border border-white/30 text-white rounded-xl font-medium hover:bg-white/30 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] whitespace-nowrap"
                >
                  <History className="w-5 h-5" />
                  <span>View Query History</span>
                </button>
              </div>
            </div>

            {/* Database Schema Section */}
            <section className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl shadow-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <Database className="w-7 h-7 text-blue-300" />
                  Database Schema
                </h2>
                
                <button
                  onClick={fetchSchema}
                  disabled={schemaLoading}
                  className="flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 text-white rounded-xl font-medium hover:bg-white/30 transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {schemaLoading ? (
                    <>
                      <ClipLoader color="#ffffff" size={16} />
                      <span>Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh Schema</span>
                    </>
                  )}
                </button>
              </div>

              <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-4 overflow-hidden">
                <pre className="text-sm text-slate-200 overflow-auto max-h-80 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {schema ? JSON.stringify(schema, null, 2) : "No schema available"}
                </pre>
              </div>
            </section>

            {/* Natural Language Query Section */}
            <section className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl shadow-white/10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Terminal className="w-7 h-7 text-emerald-300" />
                Ask a Question
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-200/90 text-sm font-medium mb-2">
                    Natural Language Query
                  </label>
                  <textarea
                    {...register("nlQuery", {
                      required: "Query cannot be empty",
                    })}
                    placeholder="e.g. Show total orders grouped by month"
                    className="w-full px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400/70 focus:outline-none focus:border-blue-300/50 focus:ring-2 focus:ring-blue-300/20 transition-all resize-none"
                    rows={4}
                  />
                  
                  {errors.nlQuery && (
                    <div className="flex items-center gap-2 mt-2 text-red-300 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.nlQuery.message}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit(executeQuery)}
                  disabled={queryLoading}
                  className="w-full sm:w-auto px-6 py-3 backdrop-blur-2xl bg-white/20 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {queryLoading ? (
                    <>
                      <ClipLoader color="#ffffff" size={20} />
                      <span>Running Query...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Run Query</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Output Section */}
            <section className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl shadow-white/10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Terminal className="w-7 h-7 text-violet-300" />
                Output
              </h2>

              {error && (
                <div className="mb-4 backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                  <div className="text-red-200">{error}</div>
                </div>
              )}

              <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-4 overflow-hidden">
                <pre className="text-sm text-slate-200 overflow-auto max-h-96 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {output ? JSON.stringify(output, null, 2) : "No output yet"}
                </pre>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}