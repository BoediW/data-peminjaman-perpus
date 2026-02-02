import { useEffect, useState } from "preact/hooks";
import { User, Lock, Eye, EyeOff, AlertTriangle } from "lucide-preact";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#C3DDF8] px-4 py-12 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-16 top-12 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl"
          aria-hidden
        />
      </div>
      <div className="max-w-md w-full backdrop-blur-sm rounded-2xl p-8 transform transition-all duration-300">
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <img
              src="/assets/img/navbar.png"
              alt="Logo"
              width={120}
              height={120}
              className="mx-auto rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang
          </h1>
          <p className="text-[var(--foreground)] text-sm">
            Masuk untuk memantau aktivitas baca dan manajemen buku setiap hari
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-[var(--foreground)] mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(sanitizeInput(e.target.value))}
                required
                className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                placeholder="Masukkan username Anda"
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[var(--foreground)] mb-2"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                required
                className="pl-12 pr-12 py-3 w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                placeholder="Masukkan kata sandi"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[var(--btn)] focus:ring-[var(--btn)] border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-[var(--foreground)]"
            >
              Ingat saya
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F67F5F] text-white py-3 px-4 rounded-xl font-semibold transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F67F5F] cursor-pointer"
          >
            Masuk
          </button>
        </form>
      </div>
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 transform transition-all duration-500 z-50 ${
          snackbarVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-6 opacity-0 scale-95"
        } ${
          snackbar?.type === "success"
            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400"
            : snackbar?.type === "error"
              ? "bg-gradient-to-r from-rose-500 to-rose-600 border-rose-400"
              : "bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400"
        } text-white px-6 py-4 rounded-2xl shadow-2xl border-2 pointer-events-none max-w-sm`}
        aria-live="assertive"
      >
        <div className="flex items-center gap-3">
          {snackbar?.type === "error" && (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <div className="font-medium text-sm leading-relaxed">
            {snackbar?.message}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
