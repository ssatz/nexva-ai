/*
  TopBar — 3-column grid so the session title is truly centered across the canvas.
  [ left: (reserved / empty) ]  [ center: title ]  [ right: Share · Kebab · Upgrade · Avatar ]
  Session mode is triggered by passing a `title`.
*/

import {
  Zap,
  ChevronRight,
  User,
  BookOpen,
  MessageCircle,
  Globe,
  Sparkles,
  LogOut,
  Share2,
  MoreHorizontal,
  Pencil,
  Download,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface TopBarProps {
  /** Centered title — when provided, the top bar is in "session mode". */
  title?: string;
  onShare?: () => void;
  onRename?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
}

export function TopBar({ title, onShare, onRename, onExport, onDelete }: TopBarProps) {
  const inSession = !!title;

  return (
    <div className="grid h-11 w-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
      {/* LEFT — reserved (keeps center column truly centered) */}
      <div aria-hidden />

      {/* CENTER — session title */}
      <div className="min-w-0 text-center">
        {inSession && (
          <span className="block truncate text-[12px] font-medium tracking-tight text-foreground/90 sm:text-[14px]">
            {title}
          </span>
        )}
      </div>

      {/* RIGHT — action cluster */}
      <div className="flex items-center justify-end gap-0.5">
        {inSession && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    onShare ? onShare() : toast("Share", { description: "Link copy coming soon" })
                  }
                  aria-label="Share"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Share2 className="h-[15px] w-[15px]" strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Share</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="More"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                >
                  <MoreHorizontal className="h-[16px] w-[16px]" strokeWidth={1.75} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-[200px] rounded-xl p-1">
                <DropdownMenuItem
                  onClick={() =>
                    onRename ? onRename() : toast("Rename", { description: "Coming soon" })
                  }
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="text-[13px]">Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onExport ? onExport() : toast("Export", { description: "Coming soon" })
                  }
                >
                  <Download className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="text-[13px]">Export</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() =>
                    onDelete ? onDelete() : toast("Delete", { description: "Coming soon" })
                  }
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="text-[13px]">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="mx-1 h-5 w-px bg-border" aria-hidden />
          </>
        )}

        {/* Credits pill (hidden on very small widths) */}
        <div className="hidden items-center gap-2 rounded-full border border-border bg-background py-1 pl-3 pr-1 text-[12px] text-foreground/80 sm:flex">
          <span className="flex items-center gap-1 font-medium text-foreground">
            <span className="font-mono text-[12px]">100</span>
            <span className="text-foreground/60">Credits</span>
          </span>
        </div>

        {/* Account avatar + dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Account"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-foreground text-[12px] font-medium text-background transition-opacity hover:opacity-90"
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
    </div>
  );
}
