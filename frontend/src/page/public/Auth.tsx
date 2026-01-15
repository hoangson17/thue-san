import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Icon, Lock, Mail, Phone, User } from "lucide-react";
import { Footer, Header } from "@/components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "@/stores/actions/authActions";
import { toast } from "sonner";
import { IconBrandFacebook } from "@tabler/icons-react";

interface AuthProps {
  type: "login" | "register";
}

const Auth: React.FC<AuthProps> = ({ type }) => {
  const isLogin = type === "login";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await dispatch(login(loginForm.email, loginForm.password) as any);
      } else {
        await dispatch(register(registerForm) as any);
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="h-[100vh] flex items-center justify-center bg-blue-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl rounded-3xl p-8 bg-white">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold text-center text-gray-800">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>

              <p className="text-center text-gray-500 text-sm">
                {isLogin
                  ? "Sign in to continue to your account"
                  : "Join us and get started"}
              </p>

              {/* {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )} */}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        className="pl-12 py-6 rounded-xl"
                        required
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        name="phone"
                        type="text"
                        placeholder="Phone Number"
                        className="pl-12 py-6 rounded-xl"
                        required
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="pl-12 py-6 rounded-xl"
                    required
                    value={isLogin ? loginForm.email : registerForm.email}
                    onChange={
                      isLogin ? handleLoginChange : handleRegisterChange
                    }
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="pl-12 py-6 rounded-xl"
                    required
                    autoComplete="off"
                    value={isLogin ? loginForm.password : registerForm.password}
                    onChange={
                      isLogin ? handleLoginChange : handleRegisterChange
                    }
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 text-base rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  {loading
                    ? "Processing..."
                    : isLogin
                    ? "Sign In"
                    : "Create Account"}
                </Button>

                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`${
                      import.meta.env.VITE_SERVER_API
                    }/auth/google/redirect`}
                    className="w-full py-3 text-base rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    Login Google
                  </a>

                  <a
                    href={`${import.meta.env.VITE_SERVER_API}/auth/facebook`}
                    className="w-full py-3 text-base rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3"
                  >
                    <IconBrandFacebook className="w-5 h-5" />
                    Login Facebook
                  </a>
                </div>
              </form>

              <p className="text-center text-sm text-gray-600 pt-2">
                {isLogin ? (
                  <>
                    Don’t have an account?
                    <Link to="/register" className="text-blue-600 font-medium">
                      {" "}
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?
                    <Link to="/login" className="text-blue-600 font-medium">
                      {" "}
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Auth;
