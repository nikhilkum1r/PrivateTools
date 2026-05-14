"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props & { t: any }, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const { t } = this.props;
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-8 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
            <div className="relative p-6 rounded-3xl bg-destructive/10 border border-destructive/20 text-destructive shadow-2xl">
              <AlertCircle className="w-16 h-16" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
              {t("error.title") || "System Failure"}
            </h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              {this.state.error?.message?.includes("Hydration") 
                ? t("error.hydration") || "A rendering discrepancy was detected. This usually happens with browser extensions or translation tools."
                : t("error.description") || "An unexpected error occurred while processing your request locally in the browser."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              size="lg"
              onClick={() => window.location.reload()}
              className="h-14 px-8 rounded-2xl bg-destructive hover:bg-destructive/90 text-white font-bold gap-3 shadow-xl shadow-destructive/20"
            >
              <RefreshCcw className="w-5 h-5" /> {t("error.retry") || "Restart Studio"}
            </Button>
            <Link 
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-14 px-8 rounded-2xl border-border bg-background hover:bg-secondary font-bold gap-3 flex items-center justify-center"
              )}
            >
              <Home className="w-5 h-5" /> {t("error.goHome") || "Back to Safety"}
            </Link>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border text-left w-full overflow-auto max-h-40">
              <p className="text-xs font-mono text-muted-foreground break-all">
                {this.state.error?.stack}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children }: Props) {
  const t = useTranslations("common");
  return <ErrorBoundaryClass t={t}>{children}</ErrorBoundaryClass>;
}
