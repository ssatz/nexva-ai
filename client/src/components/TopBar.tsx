/*
  TopBar — credits/upgrade pill + circular account avatar with Lovart-style dropdown.
  - Pill: "⚡ 30  Upgrade" — left segment shows credits, right segment is the CTA.
  - Avatar: opens DropdownMenu (no "Create a Team" per brief).
*/

import { Zap, ChevronRight, User, BookOpen, MessageCircle, Globe, Sparkles, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function TopBar() {
  return (
    <div className="flex items-center gap-2">
      {/* Credits + Upgrade pill */}
      <button
        onClick={() => toast("Upgrade", { description: "Pricing coming soon" })}
        className="group flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-2.5 pr-1 text-[12px] text-foreground/80 transition-colors hover:bg-accent"
      >
        <span className="flex items-center gap-1 text-foreground">
          <Zap className="h-3 w-3" strokeWidth={1.5} fill="currentColor" />
          <span className="font-mono text-[11px]">30</span>
        </span>
        <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-medium text-background">
          Upgrade
        </span>
      </button>

      {/* Account avatar + dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Account"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-foreground text-[12px] font-medium text-background transition-opacity hover:opacity-90"
          >
            D
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-[260px] rounded-xl p-1.5">
          <DropdownMenuLabel className="px-2 py-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[12px] font-medium text-background">
                D
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-foreground">
                  Dinesh Kumar
                </div>
                <div className="truncate text-[11px] font-normal text-muted-foreground">
                  dinesh.865@gmail.com
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          {/* Plan row */}
          <button
            onClick={() => toast("Free plan", { description: "30 credits available" })}
            className="mx-1 my-1 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-md px-2 py-1.5 text-[12px] text-foreground/80 hover:bg-accent transition-colors"
          >
            <span className="font-medium">Free</span>
            <span className="flex items-center gap-1 text-foreground/70">
              <Zap className="h-3 w-3" strokeWidth={1.5} fill="currentColor" />
              <span className="font-mono text-[11px]">30</span>
              <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
            </span>
          </button>

          <div className="px-1.5 pb-1.5 pt-0.5">
            <button
              onClick={() => toast("Upgrade", { description: "Pricing coming soon" })}
              className="w-full rounded-md bg-foreground py-1.5 text-[12px] font-medium text-background transition-opacity hover:opacity-90"
            >
              Upgrade
            </button>
          </div>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem onClick={() => toast("Manage Account", { description: "Coming soon" })}>
            <User className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="text-[13px]">Manage Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast("User Guide", { description: "Coming soon" })}>
            <BookOpen className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="text-[13px]">User Guide</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast("Contact Us", { description: "support@nexva.ai" })}>
            <MessageCircle className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="text-[13px]">Contact Us</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast("Language", { description: "English" })}>
            <Globe className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="text-[13px]">English</span>
            <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground" strokeWidth={1.75} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast("OpenClaw for Nexva", { description: "Coming soon" })}>
            <Sparkles className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="text-[13px]">OpenClaw for Nexva</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem onClick={() => toast("Logged out", { description: "See you soon" })}>
            <LogOut className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="text-[13px]">Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
