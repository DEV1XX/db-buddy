import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { History, Clock, AlertCircle, CheckCircle, XCircle, Code } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { toast, Toaster } from "react-hot-toast";
import api from "../api/axios";
import API_ENDPOINTS from "../api/apiendpoints";

export default function HistoryPage() {
  const { connectionId } = useParams();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     FETCH QUERY HISTORY
     ========================= */
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(
        API_ENDPOINTS.USER.QUERY_LOGS_BY_DB(connectionId)
      );

      setLogs(res.logs || []);
      
      if (res.logs && res.logs.length > 0) {
        toast.success(`Loaded ${res.logs.length} queries`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load query history");
      toast.error("Failed to load query history");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INITIAL LOAD
     ========================= */
  useEffect(() => {
    fetchHistory();
  }, [connectionId]);

  /* =========================
     GET STATUS STYLING
     ========================= */
  const getStatusBadge = (status) => {
    const styles = {
      success: {
        bg: "bg-emerald-500/20",
        border: "border-emerald-400/30",
        text: "text-emerald-300",
        icon: CheckCircle,
      },
      error: {
        bg: "bg-red-500/20",
        border: "border-red-400/30",
        text: "text-red-300",
        icon: XCircle,
      },
      pending: {
        bg: "bg-yellow-500/20",
        border: "border-yellow-400/30",
        text: "text-yellow-300",
        icon: Clock,
      },
    };

    const style = styles[status] || styles.pending;
    const Icon = style.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${style.bg} border ${style.border} ${style.text} text-sm font-medium`}
      >
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.9)",
            color: "#fff",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

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

      {/* Content - Add top padding for fixed navbar */}
      <div className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
              <History className="w-10 h-10 text-blue-300" />
              Query History
            </h1>
            <p className="text-slate-200/80">
              View all queries executed for this database connection
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-12 shadow-2xl shadow-white/10">
              <div className="flex flex-col items-center justify-center gap-4">
                <ClipLoader color="#93c5fd" size={50} />
                <p className="text-slate-200/90 text-lg">Loading query history...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="backdrop-blur-2xl bg-red-500/10 rounded-3xl border border-red-400/30 p-8 shadow-2xl shadow-red-500/10">
              <div className="flex items-center gap-3 text-red-300">
                <AlertCircle className="w-6 h-6" />
                <p className="text-lg">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && logs.length === 0 && (
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-12 shadow-2xl shadow-white/10">
              <div className="text-center">
                <History className="w-20 h-20 text-slate-400/50 mx-auto mb-4" />
                <p className="text-slate-200/90 text-xl mb-2">No queries executed yet</p>
                <p className="text-slate-300/70">
                  Execute your first query to see it appear here
                </p>
              </div>
            </div>
          )}

          {/* Query Logs */}
          {!loading && !error && logs.length > 0 && (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="backdrop-blur-2xl bg-white/10 rounded-2xl border border-white/20 p-6 md:p-8 shadow-xl shadow-white/10 hover:bg-white/15 transition-all"
                >
                  {/* Question Section */}
                  <div className="mb-6">
                    <div className="flex items-start gap-2 mb-2">
                      <Code className="w-5 h-5 text-blue-300 mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-white">Question</h3>
                    </div>
                    <p className="text-slate-100/90 ml-7 text-base leading-relaxed">
                      {log.naturalLanguage}
                    </p>
                  </div>

                  {/* Generated SQL Section */}
                  <div className="mb-6">
                    <div className="flex items-start gap-2 mb-3">
                      <Code className="w-5 h-5 text-violet-300 mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-white">Generated SQL</h3>
                    </div>
                    <div className="ml-7 backdrop-blur-xl bg-slate-900/50 border border-white/10 rounded-xl p-4 overflow-x-auto">
                      <pre className="text-sm text-slate-200 font-mono leading-relaxed">
                        {log.generatedSQL || "—"}
                      </pre>
                    </div>
                  </div>

                  {/* Status and Metrics */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {getStatusBadge(log.status)}

                    {log.executionTimeMs && (
                      <div className="flex items-center gap-2 px-3 py-1 backdrop-blur-xl bg-white/10 rounded-lg border border-white/20">
                        <Clock className="w-4 h-4 text-indigo-300" />
                        <span className="text-slate-200 text-sm font-medium">
                          {log.executionTimeMs} ms
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {log.errorMessage && (
                    <div className="backdrop-blur-xl bg-red-500/10 border border-red-400/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-red-300 font-semibold mb-1">Error</p>
                          <p className="text-red-200/90 text-sm">{log.errorMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-slate-300/70 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}