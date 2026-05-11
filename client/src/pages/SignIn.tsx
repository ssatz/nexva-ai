/*
  SignIn — public auth page at /signin.
  Strict B&W theme matching the rest of Nexva.
  
  Layout: centered card with Nexva logo, email/password fields, 
          Sign in with Gmail button, and link to /signup.
*/

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    // Mock sign-in (would be real API call)
    setTimeout(() => {
      toast.success(`Signed in as ${email}`);
      setLoading(false);
      setLocation("/");
    }, 800);
  };

  const handleGmailSignIn = () => {
    toast.info("Gmail sign-in would redirect to OAuth flow");
    // In production: window.location.href = `${OAUTH_SERVER_URL}/authorize?...`
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
            <span className="text-sm font-bold text-white">N</span>
          </div>
          <span className="text-lg font-semibold text-neutral-900">Nexva.ai</span>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-bold tracking-tight text-neutral-900">
            Welcome back
          </h1>
          <p className="mt-2 text-[13.5px] text-neutral-500">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wide text-neutral-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.75} />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11 border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wide text-neutral-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.75} />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-11 border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Forgot password link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => toast.info("Password reset would be sent to your email")}
              className="text-[12.5px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign in button */}
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-4 w-4" strokeWidth={1.75} />
                Sign in
              </span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-[12px] text-neutral-500">or</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        {/* Gmail button */}
        <Button
          type="button"
          onClick={handleGmailSignIn}
          variant="outline"
          className="h-11 w-full border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Gmail
        </Button>

        {/* Sign up link */}
        <p className="mt-6 text-center text-[13px] text-neutral-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setLocation("/signup")}
            className="font-semibold text-neutral-900 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
