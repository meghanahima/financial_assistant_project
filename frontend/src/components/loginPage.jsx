import React, { useState } from "react";
import { BarChart3, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../utilities/card";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Password validation function
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  // Real-time email validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  // Real-time password validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate inputs before sending
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    // If there are validation errors, stop submission
    if (emailValidationError || passwordValidationError) {
      setLoading(false);
      return;
    }

    const url = isLogin
      ? `${import.meta.env.VITE_API_BASE_URL}/api/user/login`
      : `${import.meta.env.VITE_API_BASE_URL}/api/user/register`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail: email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setSuccess(isLogin ? "Login successful!" : "Registration successful!");

      if (isLogin) {
        // Store both user ID and email for login
        localStorage.setItem(
          "financial_user",
          JSON.stringify({
            id: data.data._id,
            email: data.data.mail,
          })
        );
      } else {
        // For registration, store the new user data
        localStorage.setItem(
          "financial_user",
          JSON.stringify({
            id: data.data._id,
            email: data.data.mail,
          })
        );
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">
      {/* Left/Form side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex justify-center items-center gap-4 mb-2">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg shadow-teal-100/50 border border-white/30">
            <span className="text-3xl filter drop-shadow-sm">🔐</span>
          </div>
          <div>
            <h2 className="font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-red-600 bg-clip-text text-transparent text-xl sm:text-2xl">
              FinanceAssistant
            </h2>
          </div>
        </div>
        <p className="py-5 text-center text-gray-600">
          {isLogin
            ? "Welcome back! Sign in to your account"
            : "Create your account to get started"}
        </p>

        {/* Demo credentials section */}
        <div className="mb-4 w-full max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="font-semibold text-yellow-800 mb-1 text-base sm:text-lg">
            Try with demo credentials
          </div>
          <div className="text-xs sm:text-sm text-yellow-700 mb-2">
            <div>
              mail: <span className="font-mono break-all">demo@gmail.com</span>
            </div>
            <div>
              password: <span className="font-mono">demopass</span>
            </div>
          </div>
          <button
            type="button"
            className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 font-medium text-xs sm:text-sm"
            onClick={() => {
              setEmail("demo@gmail.com");
              setPassword("demopass");
              setEmailError("");
              setPasswordError("");
            }}
          >
            Fill Demo Credentials
          </button>
        </div>

        <Card className="border-teal-100 shadow-lg w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-teal-800">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access your dashboard"
                : "Fill in your details to create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-2">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-200 focus:outline-none transition-colors ${
                      emailError 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-gray-300 focus:border-teal-500"
                    }`}
                  />
                </div>
                {emailError && (
                  <div className="text-red-500 text-sm mt-1">{emailError}</div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-teal-200 focus:outline-none transition-colors ${
                      passwordError 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-gray-300 focus:border-teal-500"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="" /> : <Eye />}
                  </button>
                </div>
                {passwordError && (
                  <div className="text-red-500 text-sm mt-1">{passwordError}</div>
                )}
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}
              {success && (
                <div className="text-green-600 text-sm mb-2">{success}</div>
              )}

              <button
                type="submit"
                onClick={handleLogin}
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-lime-500 rounded-lg text-white font-semibold mt-6 hover:from-teal-600 hover:to-lime-600 transition-colors"
              >
                {loading ? "Loading..." : isLogin ? "Sign In ->" : "Sign Up ->"}
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setEmailError("");
                      setPasswordError("");
                      setError("");
                      setSuccess("");
                    }}
                    className="ml-1 text-teal-600 hover:text-teal-800 underline font-medium"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* right side */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-lime-500 items-center justify-center flex-col text-white p-8">
        <div className="rounded-full w-24 h-24 flex items-center justify-center bg-white/20 mb-8">
          <BarChart3 className="text-5xl w-12 h-12" />
        </div>
        <h2 className="text-4xl font-bold mb-4 text-center">
          Take Control of Your Finances
        </h2>
        <p className="text-lg text-white/90 text-center mb-12 max-w-md">
          Track expenses, manage budgets, and achieve your financial goals with
          our intuitive personal finance assistant.
        </p>

        {/* Stats boxes */}
        <div className="flex gap-8 mt-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-2xl font-bold">$12,450</div>
            <div className="text-sm text-white/80">Total Savings</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-white/80">Budget Goal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
