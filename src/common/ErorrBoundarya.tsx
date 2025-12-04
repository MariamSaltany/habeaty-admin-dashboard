// src/common/ErrorBoundary.tsx
import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // You can add error logging service calls here
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI using tailwind classes
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-brand-black p-4">
          <div className="text-center max-w-md animate-fade-in">
            <h1 className="text-6xl font-black text-brand-pink mb-4">OOPS</h1>
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-6">Something went wrong</h2>
            <p className="text-gray-600 mb-8 font-light">
              We encountered an unexpected error. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-black text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-brand-pink transition-all duration-300"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

