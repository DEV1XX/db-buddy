// ============================================
// COMPONENTS
// ============================================

const UsageMetricsSection = ({ usage, plan, queriesLeft, usagePercentage, navigate }) => (
  <section className="mb-8">
    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl shadow-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Activity className="w-7 h-7 text-blue-300" />
          Usage Metrics
        </h2>
        <button 
          onClick={() => navigate('/pricing')}
          className="px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 text-white rounded-lg font-medium hover:bg-white/30 transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)]"
        >
          Upgrade Plan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Plan Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-300" />
            <p className="text-slate-200/70 text-sm">Plan</p>
          </div>
          <p className="text-2xl font-bold text-white">{plan}</p>
        </div>

        {/* Monthly Limit Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-violet-300" />
            <p className="text-slate-200/70 text-sm">Monthly Limit</p>
          </div>
          <p className="text-2xl font-bold text-white">{usage?.limit ?? "—"}</p>
        </div>

        {/* Queries Used Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-indigo-300" />
            <p className="text-slate-200/70 text-sm">Queries Used</p>
          </div>
          <p className="text-2xl font-bold text-white">{usage?.queryCount ?? "—"}</p>
        </div>

        {/* Queries Left Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-emerald-300" />
            <p className="text-slate-200/70 text-sm">Queries Left</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {queriesLeft !== null ? queriesLeft : "Loading..."}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-200/80 mb-2">
          <span>Usage Progress</span>
          <span>{usagePercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 backdrop-blur-xl bg-white/10 rounded-full overflow-hidden border border-white/20">
          <div 
            className="h-full bg-gradient-to-r from-blue-400/80 to-violet-400/80 rounded-full transition-all duration-500"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      {/* Reset Date */}
      <div className="flex items-center gap-2 text-slate-200/70 text-sm">
        <Clock className="w-4 h-4" />
        <span>
          Resets at:{" "}
          <span className="text-white font-medium">
            {usage?.resetAt ? new Date(usage.resetAt).toLocaleString() : "—"}
          </span>
        </span>
      </div>
    </div>
  </section>
);

const ConnectedDatabasesSection = ({ databases, handleDeleteConnection, navigate }) => (
  <section>
    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl shadow-white/10 h-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Server className="w-7 h-7 text-blue-300" />
        Connected Databases
      </h2>

      {databases.length === 0 ? (
        <div className="text-center py-8">
          <Database className="w-16 h-16 text-slate-400/50 mx-auto mb-4" />
          <p className="text-slate-200/70">No databases connected yet</p>
          <p className="text-slate-300/50 text-sm mt-2">
            Connect your first database to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {databases.map((db) => (
            <div
              key={db.connectionId}
              className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all group cursor-pointer"
              onClick={() => navigate(`/userdatabases/${db.connectionId}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-5 h-5 text-blue-300" />
                    <h3 className="font-semibold text-white text-lg">
                      {db.database}
                    </h3>
                  </div>
                  <p className="text-slate-200/70 text-sm">
                    <span className="inline-block px-2 py-0.5 backdrop-blur-sm bg-white/10 rounded text-xs mr-2 border border-white/20">
                      {db.dbType}
                    </span>
                    {db.host}
                  </p>
                </div>

                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConnection(db.connectionId, db.database);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

const ConnectNewDatabaseSection = ({ register, handleSubmit, onSubmit, loading }) => (
  <section>
    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl shadow-white/10 h-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Plus className="w-7 h-7 text-emerald-300" />
        Connect New Database
      </h2>

      <div className="space-y-4">
        {/* Database Type */}
        <div>
          <label className="block text-slate-200/90 text-sm font-medium mb-2">
            Database Type
          </label>
          <select 
            {...register("dbType", { required: true })}
            className="w-full px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-300/50 focus:ring-2 focus:ring-blue-300/20 transition-all"
          >
            <option value="postgres" className="bg-slate-900">PostgreSQL</option>
            <option value="mysql" className="bg-slate-900">MySQL</option>
          </select>
        </div>

        {/* Host */}
        <div>
          <label className="block text-slate-200/90 text-sm font-medium mb-2">
            Host
          </label>
          <input 
            {...register("host", { required: true })}
            placeholder="localhost or IP address"
            className="w-full px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400/70 focus:outline-none focus:border-blue-300/50 focus:ring-2 focus:ring-blue-300/20 transition-all"
          />
        </div>

        {/* Port */}
        <div>
          <label className="block text-slate-200/90 text-sm font-medium mb-2">
            Port (Optional)
          </label>
          <input 
            {...register("port")}
            type="number"
            placeholder="5432 or 3306"
            className="w-full px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400/70 focus:outline-none focus:border-blue-300/50 focus:ring-2 focus:ring-blue-300/20 transition-all"
          />
        </div>

        {/* Database Name */}
        <div>
          <label className="block text-slate-200/90 text-sm font-medium mb-2">
            Database Name
          </label>
          <input 
            {...register("database", { required: true })}
            placeholder="my_database"
            className="w-full px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400/70 focus:outline-none focus:border-blue-300/50 focus:ring-2 focus:ring-blue-300/20 transition-all"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-slate-200/90 text-sm font-medium mb-2">
            Username
          </label>
          <input 
            {...register("username", { required: true })}
            placeholder="db_user"
            className="w-full px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400/70 focus:outline-none focus:border-blue-300/50 focus:ring-2 focus:ring-blue-300/20 transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-slate-200/90 text-sm font-medium mb-2">
            Password
          </label>
          <input 
            {...register("password", { required: true })}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400/70 focus:outline-none focus:border-blue-300/50 focus:ring-2 focus:ring-blue-300/20 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="w-full px-6 py-3 backdrop-blur-2xl bg-white/20 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <ClipLoader color="#ffffff" size={20} />
              <span>Connecting...</span>
            </>
          ) : (
            "Connect Database"
          )}
        </button>
      </div>
    </div>
  </section>
);

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { Database, TrendingUp, Activity, Clock, Server, Plus, Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axios";
import API_ENDPOINTS from "../api/apiendpoints";
import { useNavigate } from "react-router-dom";
import { 
  setAllConnections, 
  addConnection, 
  removeConnection 
} from "../redux/slices/connectionSlice";

export default function Dashboard() {
  const { user } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const databases = useSelector((state) => state.connections.allIds.map(
    id => state.connections.byId[id]
  ));

  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm();

  /* =========================
     FETCH CONNECTED DATABASES
     ========================= */
  const fetchConnections = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.USER.CONNECTIONS);
      const connections = res.connections || [];
      dispatch(setAllConnections(connections));
    } catch (err) {
      console.error("Error fetching connections", err);
      toast.error("Failed to load connections");
    }
  };

  /* =========================
     FETCH USAGE METRICS
     ========================= */
  const fetchUsageMetrics = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.USER.USAGE_METRICS);
      setUsage(res.usage);
    } catch (err) {
      console.error("Error fetching usage metrics", err);
      toast.error("Failed to load usage metrics");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      await Promise.all([fetchConnections(), fetchUsageMetrics()]);
      setInitialLoading(false);
    };
    loadData();
  }, []);

  /* =========================
     CONNECT NEW DATABASE
     ========================= */
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await api.post(API_ENDPOINTS.DATABASE.REGISTER, data);
      
      // Dispatch to Redux with the returned connectionId
      if (res.connectionId) {
        dispatch(addConnection({ 
          connectionId: res.connectionId,
          ...data 
        }));
      }
      
      reset();
      await fetchConnections();
      toast.success("Database connected successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect database");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE DATABASE CONNECTION
     ========================= */
  const handleDeleteConnection = async (connectionId, databaseName) => {
    if (!confirm(`Are you sure you want to delete the connection to "${databaseName}"?`)) {
      return;
    }

    const loadingToast = toast.loading("Deleting connection...");
    
    try {
      await api.delete(API_ENDPOINTS.DATABASE.DELETE(connectionId));
      
      // Dispatch to Redux
      dispatch(removeConnection(connectionId));
      
      await fetchConnections();
      toast.success("Database connection deleted successfully", { id: loadingToast });
    } catch (err) {
      console.error("Error deleting connection", err);
      toast.error("Failed to delete database connection", { id: loadingToast });
    }
  };

  /* =========================
     DERIVED VALUES (SAFE)
     ========================= */
  const plan = user?.publicMetadata?.plan?.toUpperCase() || usage?.plan || "FREE";
  const queriesLeft = usage ? Math.max(usage.limit - usage.queryCount, 0) : null;
  const usagePercentage = usage ? (usage.queryCount / usage.limit) * 100 : 0;

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
        {/* Background Image with Dark Overlay - Same as Landing Page */}
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
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-slate-200/80">Manage your databases and monitor your usage</p>
            </div>

            {initialLoading ? (
              <div className="flex items-center justify-center py-20">
                <ClipLoader color="#60a5fa" size={50} />
              </div>
            ) : (
              <>
                {/* Usage Metrics Section */}
                <UsageMetricsSection 
                  usage={usage}
                  plan={plan}
                  queriesLeft={queriesLeft}
                  usagePercentage={usagePercentage}
                  navigate={navigate}
                />

                {/* Two Column Layout for Desktop */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Connected Databases Section */}
                  <ConnectedDatabasesSection 
                    databases={databases}
                    handleDeleteConnection={handleDeleteConnection}
                    navigate={navigate}
                  />

                  {/* Connect New Database Section */}
                  <ConnectNewDatabaseSection 
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    loading={loading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}