import { useEffect, useState } from "preact/hooks";
import { User, Lock, Eye, EyeOff, AlertTriangle, Zap, Sparkles, Disc } from "lucide-preact";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const sanitizeInput = (input) => {
    return input
      .replace(/<[^>]*>/g, "")
      .replace(/[{};:']/g, "")
      .trim();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("expired") === "1" || params.get("expired") === "true") {
      setSnackbar({
        message: "Sesi anda telah berakhir, silakan masuk kembali",
        type: "error",
      });
    }
  }, []);

  useEffect(() => {
    if (snackbar) {
      setSnackbarVisible(true);
      const hideTimer = setTimeout(() => {
        setSnackbarVisible(false);
      }, 3000);
      return () => clearTimeout(hideTimer);
    }
  }, [snackbar]);

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: sanitizedUsername,
          password: sanitizedPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.admin));
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", sanitizedUsername);
        } else {
          localStorage.removeItem("rememberedUsername");
        }
        setSnackbar({
          message: "Login berhasil! Mengarahkan ke dashboard...",
          type: "success",
        });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setSnackbar({
          message: data.error || "Login gagal",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setSnackbar({
        message: "Terjadi kesalahan saat login",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zedd-white px-4 py-12 relative overflow-hidden">
      {/* Spectrum Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-zedd-violet/[0.06] rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-zedd-cyan/[0.05] rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zedd-pink/[0.03] rounded-full blur-[120px]"></div>

        {/* Spectrum Grid Lines */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}></div>

        {/* Floating Decorative */}
        <div className="absolute top-1/4 left-16 text-zedd-violet/10 animate-float">
          <Sparkles size={100} />
        </div>
        <div className="absolute bottom-1/4 right-16 text-zedd-cyan/10 animate-float" style={{ animationDelay: "1s" }}>
          <Disc size={80} />
        </div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-fade-in px-4">
        <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 border border-zedd-silver/60 rounded-zedd-lg shadow-zedd-lg relative overflow-hidden">
          {/* Spectrum Top Bar */}
          <div className="absolute top-0 left-0 w-full h-1 spectrum-bar"></div>

          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-zedd-violet/10 to-zedd-cyan/10 border border-zedd-violet/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse-glow">
              <Zap className="w-10 h-10 text-zedd-violet" />
            </div>
            <h1 className="text-3xl font-display font-black text-zedd-carbon mb-2 tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-zedd-steel text-xs font-medium uppercase tracking-[0.2em]">
              Sistem Manajemen Perpustakaan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="label">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zedd-steel group-focus-within:text-zedd-violet transition-colors w-5 h-5" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onInput={(e) => setUsername(e.target.value)}
                  className="input pl-12 h-14"
                  placeholder="Masukkan username Anda"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="label">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zedd-steel group-focus-within:text-zedd-violet transition-colors w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onInput={(e) => setPassword(e.target.value)}
                  className="input pl-12 pr-12 h-14"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zedd-steel hover:text-zedd-violet transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="relative flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-zedd-silver rounded-full peer peer-checked:bg-zedd-violet transition-all"></div>
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5 shadow-sm"></div>
                </div>
                <span className="text-sm text-zedd-steel group-hover:text-zedd-carbon">Ingat saya</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full h-14 text-sm tracking-widest uppercase group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Masuk <Zap size={18} />
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-zedd-steel font-medium">
            ID: <span className="text-spectrum font-bold">SMP Negeri 3 Archive</span>
          </p>
        </div>
      </div>

      {/* Snackbar */}
      <div
        className={`fixed top-8 left-1/2 -translate-x-1/2 transition-all duration-500 z-50 px-8 py-4 rounded-full border shadow-zedd-lg flex items-center gap-4
        ${snackbarVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-12 opacity-0 scale-95 pointer-events-none"}
        ${snackbar?.type === "success"
            ? "bg-white text-emerald-600 border-emerald-200"
            : "bg-white text-red-500 border-red-200"}`}
      >
        {snackbar?.type === "error" ? <AlertTriangle size={20} /> : <Zap size={20} />}
        <p className="font-display font-bold text-sm">{snackbar?.message}</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
