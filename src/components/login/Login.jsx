import { useEffect, useState } from "preact/hooks";
import { User, Lock, Eye, EyeOff, AlertTriangle, Music, Mic2, Disc } from "lucide-preact";

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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="min-h-screen w-full flex items-center justify-center bg-nerissa-onyx px-4 py-12 relative overflow-hidden">
      {/* Melodic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-nerissa-teal/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-nerissa-purple/10 rounded-full blur-[120px]"></div>

        {/* Sound Waves Decoration */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 sound-wave"></div>

        {/* Decorative Icons */}
        <div className="absolute top-1/4 left-10 text-nerissa-teal/20 animate-float">
          <Music size={120} />
        </div>
        <div className="absolute bottom-1/4 right-10 text-nerissa-purple/20 animate-float" style={{ animationDelay: '1s' }}>
          <Disc size={100} />
        </div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-fade-in px-4">
        <div className="card-cyber bg-nerissa-midnight/60 backdrop-blur-2xl p-8 md:p-10 border border-white/10 rounded-nerissa-lg shadow-nerissa-lg relative overflow-hidden">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nerissa-teal via-nerissa-purple to-nerissa-teal"></div>

          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-nerissa-teal/20 to-nerissa-purple/20 border border-nerissa-teal/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse-cyan">
              <Mic2 className="w-10 h-10 text-nerissa-teal" />
            </div>
            <h1 className="text-3xl font-display font-black text-white mb-2 tracking-tight italic">
              Selamat Datang
            </h1>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-[0.2em]">
              Sistem Manajemen Perpustakaan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="label">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-nerissa-teal transition-colors w-5 h-5" />
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
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-nerissa-teal transition-colors w-5 h-5" />
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
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
                  <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-nerissa-teal transition-all"></div>
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-200">Ingat saya</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full h-14 text-sm tracking-widest uppercase shadow-nerissa hover:scale-[1.02] active:scale-95 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform"></div>
              <span className="relative z-10 flex items-center gap-3">
                Masuk <Music size={18} className="animate-bounce" />
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 font-medium">
            ID: <span className="text-nerissa-teal/60">SMP Negeri 3 Archive</span>
          </p>
        </div>
      </div>

      {/* Snackbar Alert */}
      <div
        className={`fixed top-8 left-1/2 -translate-x-1/2 transition-all duration-500 z-50 px-8 py-4 rounded-full border shadow-nerissa-lg flex items-center gap-4
        ${snackbarVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-12 opacity-0 scale-95 pointer-events-none"}
        ${snackbar?.type === "success"
            ? "bg-nerissa-teal text-nerissa-onyx border-white/20"
            : "bg-red-500/90 text-white border-white/20"}`}
      >
        {snackbar?.type === "error" ? <AlertTriangle size={20} /> : <div className="w-5 h-5 flex-shrink-0"><Mic2 size={20} /></div>}
        <p className="font-display font-bold text-sm">{snackbar?.message}</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
