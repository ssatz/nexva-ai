import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Lock, CreditCard, Settings as SettingsIcon, User, Eye, EyeOff } from "lucide-react";

type SettingsTab = "profile" | "password" | "billing" | "account";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [userName, setUserName] = useState("Dinesh Kumar");
  const [email, setEmail] = useState("dinesh.865@gmail.com");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-full bg-white">
      {/* Left sidebar: Settings nav */}
      <div className="w-64 border-r border-border bg-slate-50 p-6">
        {/* ACCOUNT section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Account</h3>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === "password"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === "billing"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Billing
            </button>
          </nav>
        </div>

        {/* GENERAL section */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">General</h3>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === "account"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Account Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Right pane: Settings content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Profile page */}
        {activeTab === "profile" && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-slate-600 mb-8">Manage your personal information</p>

            {/* Profile Photo */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Profile Photo</h2>
              <p className="text-sm text-slate-600 mb-4">Your profile photo is synced with your account.</p>
              <div className="w-24 h-24 rounded-lg bg-slate-200 flex items-center justify-center">
                <span className="text-slate-400 text-sm">Photo</span>
              </div>
            </div>

            {/* User Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">User Name</label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="max-w-md"
              />
            </div>

            {/* Save button */}
            <Button className="bg-black text-white hover:bg-black/90">Save Changes</Button>
          </div>
        )}

        {/* Change Password page */}
        {activeTab === "password" && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Change Password</h1>
            <p className="text-slate-600 mb-8">Update your password to keep your account secure</p>

            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 text-sm">Password Change Unavailable</h3>
                <p className="text-sm text-blue-800 mt-1">
                  You are signed in with Google. Password management is handled through your Google account settings.
                </p>
              </div>
            </div>

            {/* Password fields (disabled) */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <Input
                placeholder="Enter current password"
                type="password"
                disabled
                className="max-w-md"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">New Password</label>
              <Input
                placeholder="Enter new password (min 8 characters)"
                type="password"
                disabled
                className="max-w-md"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <Input
                placeholder="Confirm new password"
                type="password"
                disabled
                className="max-w-md"
              />
            </div>

            <Button disabled className="bg-slate-300 text-slate-500 cursor-not-allowed">
              Update Password
            </Button>
          </div>
        )}

        {/* Billing page */}
        {activeTab === "billing" && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Billing</h1>
            <p className="text-slate-600 mb-8">Manage your subscription and payment methods</p>

            {/* Current plan */}
            <div className="border border-border rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
              <p className="text-3xl font-bold mb-1">Free</p>
              <p className="text-sm text-slate-600 mb-6">Limited access to features</p>
              <Button className="w-full bg-black text-white hover:bg-black/90">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        )}

        {/* Account Settings page */}
        {activeTab === "account" && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-slate-600 mb-8">Delete account and other critical settings</p>

            {/* Clear All Chats */}
            <div className="border border-border rounded-lg p-6 mb-6 max-w-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Clear All Chats</h3>
                  <p className="text-sm text-slate-600">Your chat history will be permanently deleted</p>
                </div>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  Delete All Chats
                </Button>
              </div>
            </div>

            {/* Delete Account */}
            <div className="border border-red-200 rounded-lg p-6 max-w-2xl bg-red-50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-800">Deleting your account is permanent and cannot be undone</p>
                </div>
                <Button className="bg-red-600 text-white hover:bg-red-700">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
