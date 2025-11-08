import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="flex flex-col items-center w-full max-w-2xl p-8 bg-slate-800/50 rounded-lg border border-slate-700">
            <AlertTriangle
              size={48}
              className="text-red-400 mb-6 flex-shrink-0"
            />

            <h2 className="text-2xl font-bold text-white mb-2">
              Oops! This book took an unexpected plot twist.
            </h2>
            
            <p className="text-slate-400 mb-6 text-center">
              Something went wrong, but don't worry - your reading journey can continue.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 w-full rounded bg-slate-900/50 overflow-auto mb-6 border border-slate-700">
                <pre className="text-sm text-slate-500 whitespace-break-spaces">
                  {this.state.error?.stack}
                </pre>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg",
                "bg-gradient-to-r from-blue-600 to-purple-600",
                "hover:from-blue-700 hover:to-purple-700",
                "text-white font-semibold cursor-pointer transition-all"
              )}
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
