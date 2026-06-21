import { useState } from "react";
import { User, Building2, Home } from "lucide-react";
import { authApi } from "../../api/auth";

export function LoginPage({ onNavigate, setCart }) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "buyer",
      icon: User,
      title: "Người mua",
      description: "Mua hải sản tươi sống chất lượng cao",
    },
    {
      id: "business",
      icon: Building2,
      title: "Doanh nghiệp",
      description: "Tìm nguồn hải sản số lượng lớn",
    },
    {
      id: "farmer",
      icon: Home,
      title: "Người nuôi",
      description: "Đăng bán sản lượng hải sản",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert("Vui lòng nhập đúng định dạng Email (ví dụ: example@gmail.com)!");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await authApi.login(email, password);
        // Save auth state
        localStorage.setItem("token", response.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: response.user?.email || response.email || email,
            name: response.user?.name || response.name || "User",
            role: response.user?.role || response.role || "buyer",
            token: response.token,
          }),
        );

        alert(`Đăng nhập thành công!`);
        onNavigate("home");
      } else {
        if (password !== confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          return;
        }

        const registrationData = {
          name: fullName,
          email,
          password,
        };

        await authApi.register(registrationData);
        alert("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
        setIsLogin(true);
        setSelectedRole(null);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId =
      "273398524893-lu4liu2k1ei4ppn14beasfuq3afkh3bp.apps.googleusercontent.com";
    const redirectUri = window.location.origin;
    const scope = "openid email profile";
    const nonce = Math.random().toString(36).substring(2);

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=${encodeURIComponent(scope)}` +
      `&nonce=${nonce}` +
      `&prompt=select_account`;

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    if (!popup) {
      alert("Vui lòng cho phép mở popup để đăng nhập bằng Google!");
      return;
    }

    const checkPopup = setInterval(async () => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        return;
      }

      try {
        const currentUrl = popup.location.href;
        if (currentUrl.includes(redirectUri) && popup.location.hash) {
          const hash = popup.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const idToken = params.get("id_token");

          if (idToken) {
            popup.close();
            clearInterval(checkPopup);

            setLoading(true);
            try {
              const apiResponse = await authApi.googleLogin(idToken);

              localStorage.setItem("token", apiResponse.token);
              localStorage.setItem(
                "currentUser",
                JSON.stringify({
                  email: apiResponse.user?.email || apiResponse.email,
                  name:
                    apiResponse.user?.name || apiResponse.name || "Google User",
                  role: apiResponse.user?.role || apiResponse.role || "buyer",
                  token: apiResponse.token,
                }),
              );

              alert("Đăng nhập qua Google thành công!");
              onNavigate("home");
            } catch (error) {
              console.error("Google login error:", error);
              alert(error.message || "Đăng nhập qua Google thất bại!");
            } finally {
              setLoading(false);
            }
          }
        }
      } catch (e) {
        // Cross-origin access block is expected while popup is loading Google pages
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1611794501034-13369f948303?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYmx1ZXxlbnwxfHx8fDE3NzI2MzU4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Seafood"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <svg width="60" height="60" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 5C15 5 10 8 8 12C6 16 8 20 10 22C12 24 16 26 20 28C24 26 28 24 30 22C32 20 34 16 32 12C30 8 25 5 20 5Z"
                    fill="#0A2647"
                  />
                  <ellipse cx="20" cy="15" rx="8" ry="5" fill="#2C5F8D" />
                  <path
                    d="M20 18C22 18 24 17 25 15.5C26 14 26 12 25 11C24 10 22 9 20 9C18 9 16 10 15 11C14 12 14 14 15 15.5C16 17 18 18 20 18Z"
                    fill="#00BCD4"
                  />
                  <circle cx="18" cy="13" r="1.5" fill="white" />
                </svg>
              </div>
              <h1
                className="mb-2 font-bold text-2xl"
                style={{ color: "#0A2647" }}
              >
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </h1>
              <p className="text-gray-600">
                {isLogin ? "Chào mừng bạn trở lại" : "Tạo tài khoản mới"}
              </p>
            </div>

            {!isLogin && !selectedRole ? (
              <div>
                <h3
                  className="mb-4 text-center font-medium"
                  style={{ color: "#0A2647" }}
                >
                  Chọn loại tài khoản
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className="p-4 border rounded-lg hover:border-[#00BCD4] hover:bg-blue-50 transition-colors text-left"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: "#0A2647" }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4
                              className="mb-1 font-semibold"
                              style={{ color: "#0A2647" }}
                            >
                              {role.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setIsLogin(true)}
                  className="w-full mt-6 text-center text-sm font-medium"
                  style={{ color: "#00BCD4" }}
                >
                  Đã có tài khoản? Đăng nhập ngay
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        style={{ borderColor: "#e5e7eb" }}
                        placeholder="Nguyễn Văn A"
                        required
                        disabled={loading}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Email
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                      style={{ borderColor: "#e5e7eb" }}
                      placeholder="example@gmail.com"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                      style={{ borderColor: "#e5e7eb" }}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Xác nhận mật khẩu
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        style={{ borderColor: "#e5e7eb" }}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-cyan-500"
                          disabled={loading}
                        />
                        Ghi nhớ đăng nhập
                      </label>
                      <a
                        href="#"
                        className="font-medium"
                        style={{ color: "#00BCD4" }}
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-md text-white font-bold hover:opacity-90 transition-opacity shadow-md flex justify-center items-center gap-2"
                    style={{ backgroundColor: "#00BCD4" }}
                    disabled={loading}
                  >
                    {loading && (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {isLogin
                      ? "Đăng nhập"
                      : `Đăng ký với vai trò ${roles.find((r) => r.id === selectedRole)?.title}`}
                  </button>
                </div>

                <div className="mt-6 text-center text-sm">
                  {isLogin ? (
                    <p>
                      Chưa có tài khoản?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(false);
                          setSelectedRole(null);
                        }}
                        className="font-bold"
                        style={{ color: "#00BCD4" }}
                        disabled={loading}
                      >
                        Đăng ký ngay
                      </button>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(true);
                        setSelectedRole(null);
                      }}
                      className="font-medium"
                      style={{ color: "#00BCD4" }}
                      disabled={loading}
                    >
                      ← Quay lại đăng nhập
                    </button>
                  )}
                </div>

                <div
                  className="mt-6 pt-6 border-t"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <p className="text-center text-sm text-gray-600 mb-4">
                    Hoặc đăng nhập với
                  </p>
                  <div className="flex gap-3 items-center justify-between">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="flex-1 py-2.5 border rounded-md hover:bg-gray-50 text-sm font-medium transition-colors flex items-center justify-center gap-2 h-[40px] cursor-pointer"
                      style={{ borderColor: "#e5e7eb" }}
                      disabled={loading}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-2.5 border rounded-md hover:bg-gray-50 text-sm font-medium transition-colors flex items-center justify-center h-[40px]"
                      style={{ borderColor: "#e5e7eb" }}
                      disabled={loading}
                    >
                      Facebook
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
