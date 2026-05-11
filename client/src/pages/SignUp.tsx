/*
  SignUp — public auth page at /signup.
  Strict B&W theme matching the rest of Nexva.
  
  Layout: centered card with Nexva logo, email/password/confirm fields, 
          Sign up with Gmail button, and link to /signin.
*/

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, UserPlus, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation
  const passwordStrength = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
  const passwordMatch = password && confirmPassword && password === confirmPassword;
  const isFormValid = email && password && confirmPassword && passwordMatch && Object.values(passwordStrength).every(Boolean);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please meet all password requirements");
      return;
    }
    setLoading(true);
    // Mock sign-up (would be real API call)
    setTimeout(() => {
      toast.success(`Account created for ${email}`);
      setLoading(false);
      setLocation("/");
    }, 800);
  };

  const handleGmailSignUp = () => {
    toast.info("Gmail sign-up would redirect to OAuth flow");
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
            Create your account
          </h1>
          <p className="mt-2 text-[13.5px] text-neutral-500">
            Join Nexva to unlock AI-powered tools
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
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
            {/* Password strength indicator */}
            {password && (
              <div className="mt-2 space-y-1.5 text-[11.5px]">
                <StrengthRow met={passwordStrength.length} label="At least 8 characters" />
                <StrengthRow met={passwordStrength.hasUpper} label="One uppercase letter" />
                <StrengthRow met={passwordStrength.hasLower} label="One lowercase letter" />
                <StrengthRow met={passwordStrength.hasNumber} label="One number" />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wide text-neutral-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.75} />
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-9 h-11 border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-neutral-900 ${
                  confirmPassword && !passwordMatch ? "border-red-300" : ""
                }`}
              />
            </div>
            {confirmPassword && !passwordMatch && (
              <p className="mt-1.5 text-[11.5px] text-red-600">Passwords do not match</p>
            )}
            {confirmPassword && passwordMatch && (
              <p className="mt-1.5 text-[11.5px] text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" strokeWidth={2.5} />
                Passwords match
              </p>
            )}
          </div>

          {/* Sign up button */}
          <Button
            type="submit"
            disabled={loading || !isFormValid}
            className="h-11 w-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" strokeWidth={1.75} />
                Sign up
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
          onClick={handleGmailSignUp}
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
          Sign up with Gmail
        </Button>

        {/* Sign in link */}
        <p className="mt-6 text-center text-[13px] text-neutral-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setLocation("/signin")}
            className="font-semibold text-neutral-900 hover:underline"
          >
            Sign in
          </button>
        </p>

        {/* Terms */}
        <p className="mt-4 text-center text-[11px] text-neutral-500">
          By signing up, you agree to our{" "}
          <button type="button" className="underline hover:text-neutral-700">
            Terms of Service
          </button>{" "}
          and{" "}
          <button type="button" className="underline hover:text-neutral-700">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}

function StrengthRow({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-neutral-600">
      {met ? (
        <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={2.5} />
      ) : (
        <X className="h-3.5 w-3.5 text-neutral-300" strokeWidth={2.5} />
      )}
      <span className={met ? "text-green-600" : ""}>{label}</span>
    </div>
  );
}
