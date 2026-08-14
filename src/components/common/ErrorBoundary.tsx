import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-400 max-w-md mb-6">
            {this.state.error?.message || 'The application encountered an unexpected state.'}
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-[#EAB308] text-black font-bold rounded-xl text-xs flex items-center space-x-2 cursor-pointer hover:bg-[#CA8A04] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload App</span>
            </button>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-white/10 text-gray-300 font-semibold rounded-xl text-xs hover:bg-white/20 transition-colors cursor-pointer"
            >
              <span>Clear Cache & Restart</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
