/*
  SettingsView — full-page settings with left sub-nav + right detail pane.
  Design: strict black & white, no blue accents. Active tab uses solid black
  underline. All form fields are paired with leading Lucide icons. Typography
  combines a tighter display heading with a softer body subhead.
*/

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Lock,
  CreditCard,
  Settings as SettingsIcon,
  User,
  Mail,
  Camera,
  Check,
  AlertTriangle,
  Trash2,
  Crown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SettingsTab = "profile" | "password" | "billing" | "account";

const NAV_GROUPS = [
  {
    label: "Account",
    items: [
      { key: "profile" as const, label: "Profile", icon: User },
      { key: "password" as const, label: "Change Password", icon: Lock },
      { key: "billing" as const, label: "Billing", icon: CreditCard },
    ],
  },
  {
    label: "General",
    items: [{ key: "account" as const, label: "Account Settings", icon: SettingsIcon }],
  },
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [userName, setUserName] = useState("Dinesh Kumar");
  const [email, setEmail] = useState("dinesh.865@gmail.com");

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Left settings sub-nav */}
      <aside className="w-[260px] shrink-0 border-r border-border bg-background px-5 py-8 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-7">
            <h3 className="px-3 mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground/45">
              {group.label}
            </h3>
            <nav className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] transition-colors duration-150",
                      isActive
                        ? "font-semibold text-foreground"
                        : "text-foreground/65 hover:bg-accent/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-px left-3 right-3 h-[2px] rounded-full bg-foreground" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </aside>

      {/* Right pane: settings content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-10 py-10">
          {activeTab === "profile" && (
            <ProfilePanel
              userName={userName}
              email={email}
              onUserNameChange={setUserName}
              onEmailChange={setEmail}
            />
          )}
          {activeTab === "password" && <PasswordPanel />}
          {activeTab === "billing" && <BillingPanel />}
          {activeTab === "account" && <AccountPanel />}
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────  Header pattern  ───────────────────────── */

function PanelHeader({ icon: Icon, title, subtitle }: { icon: typeof User; title: string; subtitle: string }) {
  return (
    <header className="mb-9">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
        <h1 className="text-[28px] font-bold tracking-tight text-foreground leading-none">{title}</h1>
      </div>
      <p className="text-[14px] text-foreground/55 ml-12">{subtitle}</p>
    </header>
  );
}

/* ─────────────────────────  Profile  ───────────────────────── */

function ProfilePanel({
  userName,
  email,
  onUserNameChange,
  onEmailChange,
}: {
  userName: string;
  email: string;
  onUserNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
}) {
  return (
    <>
      <PanelHeader icon={User} title="Profile" subtitle="Manage your personal information" />

      {/* Profile photo card */}
      <section className="mb-7 rounded-xl border border-border bg-background p-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Camera className="h-4 w-4 text-foreground/70" strokeWidth={1.75} />
          <h2 className="text-[14px] font-semibold text-foreground">Profile Photo</h2>
        </div>
        <p className="text-[13px] text-foreground/55 mb-5">
          Your profile photo is synced with your account.
        </p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-foreground text-background text-2xl font-bold">
              D
            </div>
            <button
              onClick={() => toast("Upload photo", { description: "Coming soon" })}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground/70 shadow-sm transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Change photo"
            >
              <Camera className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
          <button
            onClick={() => toast("Upload photo", { description: "Coming soon" })}
            className="rounded-md border border-border px-3 py-1.5 text-[12.5px] font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
          >
            Change photo
          </button>
        </div>
      </section>

      {/* Form card */}
      <section className="rounded-xl border border-border bg-background p-6">
        <FormField
          icon={User}
          label="User Name"
          value={userName}
          onChange={onUserNameChange}
          placeholder="Your name"
        />
        <div className="my-5 h-px bg-border" />
        <FormField
          icon={Mail}
          label="Email"
          value={email}
          onChange={onEmailChange}
          placeholder="you@example.com"
          type="email"
        />

        <div className="mt-7 flex justify-end gap-2">
          <button
            onClick={() => toast("Discarded")}
            className="rounded-md px-4 py-2 text-[13px] font-medium text-foreground/65 transition-colors hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <Button
            onClick={() => toast("Saved", { description: "Profile changes saved" })}
            className="bg-foreground text-background hover:bg-foreground/90 gap-1.5"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            Save Changes
          </Button>
        </div>
      </section>
    </>
  );
}

function FormField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
        <Icon className="h-3.5 w-3.5 text-foreground/55" strokeWidth={1.75} />
        {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        className="h-10 text-[14px]"
      />
    </div>
  );
}

/* ─────────────────────────  Change Password  ───────────────────────── */

function PasswordPanel() {
  return (
    <>
      <PanelHeader
        icon={Lock}
        title="Change Password"
        subtitle="Update your password to keep your account secure"
      />

      {/* Info banner — neutral grey, no blue */}
      <div className="mb-7 rounded-xl border border-border bg-accent/40 p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-foreground/65 shrink-0 mt-0.5" strokeWidth={1.75} />
        <div>
          <h3 className="text-[13.5px] font-semibold text-foreground">Password change unavailable</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground/65">
            You are signed in with Google. Password management is handled through your Google account
            settings.
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-background p-6 space-y-5">
        <FormField
          icon={Lock}
          label="Current Password"
          value=""
          onChange={() => {}}
          placeholder="Enter current password"
          type="password"
          disabled
        />
        <FormField
          icon={Lock}
          label="New Password"
          value=""
          onChange={() => {}}
          placeholder="Enter new password (min 8 characters)"
          type="password"
          disabled
        />
        <FormField
          icon={Lock}
          label="Confirm New Password"
          value=""
          onChange={() => {}}
          placeholder="Confirm new password"
          type="password"
          disabled
        />

        <div className="pt-2 flex justify-end">
          <Button
            disabled
            className="bg-accent/60 text-foreground/40 cursor-not-allowed gap-1.5 hover:bg-accent/60"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            Update Password
          </Button>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────  Billing  ───────────────────────── */

function BillingPanel() {
  return (
    <>
      <PanelHeader
        icon={CreditCard}
        title="Billing"
        subtitle="Manage your subscription and payment methods"
      />

      {/* Current plan card */}
      <section className="mb-6 rounded-xl border border-border bg-background p-7">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-foreground/50 mb-1">
              Current Plan
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-bold tracking-tight">Free</span>
              <span className="text-[13px] text-foreground/55">/ forever</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border">
            <Crown className="h-4.5 w-4.5 text-foreground/65" strokeWidth={1.75} />
          </div>
        </div>

        <ul className="space-y-2 mb-6">
          {[
            "30 chat credits per month",
            "Standard models (Gemini 3.1 Flash, Claude Haiku)",
            "Limited to 5 saved chats",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-[13.5px] text-foreground/70">
              <Check className="h-3.5 w-3.5 text-foreground/55" strokeWidth={2} />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          onClick={() => toast("Upgrade", { description: "Pricing coming soon" })}
          className="w-full bg-foreground text-background hover:bg-foreground/90 gap-1.5"
        >
          <Crown className="h-3.5 w-3.5" strokeWidth={1.75} />
          Upgrade to Pro
          <ArrowRight className="h-3.5 w-3.5 ml-auto" strokeWidth={1.75} />
        </Button>
      </section>

      {/* Payment method placeholder */}
      <section className="rounded-xl border border-border bg-background p-6">
        <div className="flex items-center gap-2 mb-1.5">
          <CreditCard className="h-4 w-4 text-foreground/70" strokeWidth={1.75} />
          <h2 className="text-[14px] font-semibold">Payment Method</h2>
        </div>
        <p className="text-[13px] text-foreground/55 mb-4">
          No payment method on file. Add one to unlock Pro features.
        </p>
        <button
          onClick={() => toast("Add payment method", { description: "Coming soon" })}
          className="rounded-md border border-border px-4 py-2 text-[13px] font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
        >
          Add Payment Method
        </button>
      </section>
    </>
  );
}

/* ─────────────────────────  Account Settings  ───────────────────────── */

function AccountPanel() {
  return (
    <>
      <PanelHeader
        icon={SettingsIcon}
        title="Account Settings"
        subtitle="Delete account and other critical settings"
      />

      {/* Clear all chats card */}
      <section className="mb-5 rounded-xl border border-border bg-background p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border">
              <Trash2 className="h-4 w-4 text-foreground/70" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold mb-0.5">Clear All Chats</h3>
              <p className="text-[13px] text-foreground/55">
                Your chat history will be permanently deleted
              </p>
            </div>
          </div>
          <button
            onClick={() => toast("Cleared", { description: "All chats removed" })}
            className="shrink-0 rounded-md border border-foreground/20 px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-accent hover:border-foreground/40"
          >
            Delete All Chats
          </button>
        </div>
      </section>

      {/* Delete account — danger zone */}
      <section className="rounded-xl border border-foreground/30 bg-foreground/[0.03] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-foreground/30 bg-background">
              <AlertTriangle className="h-4 w-4 text-foreground" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold mb-0.5">Delete Account</h3>
              <p className="text-[13px] text-foreground/65">
                Deleting your account is permanent and cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={() => toast("Are you sure?", { description: "This is permanent" })}
            className="shrink-0 rounded-md bg-foreground px-3.5 py-2 text-[12.5px] font-semibold text-background transition-opacity hover:opacity-90"
          >
            Delete Account
          </button>
        </div>
      </section>
    </>
  );
}
