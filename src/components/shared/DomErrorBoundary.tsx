"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorCount: number;
}

/**
 * DomErrorBoundary - Catches and recovers from DOM manipulation errors
 * caused by browser extensions (password managers, translation tools, etc.)
 * that modify the DOM outside of React's control.
 *
 * Based on: https://medium.com/@fabrizio.azzarri/fixing-the-next-js-15-react-19-removechild-dom-error-a33b57cbc3b1
 */
export class DomErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryDelay = 100;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true, errorCount: 0 };
  }

  componentDidCatch(error: Error): void {
    // Check if this is a DOM manipulation error caused by browser extensions
    const isDomError =
      error.message.includes("removeChild") ||
      error.message.includes("insertBefore") ||
      error.message.includes("appendChild") ||
      error.message.includes("NotFoundError");

    if (isDomError && this.state.errorCount < this.maxRetries) {
      // Auto-recover after a brief delay
      setTimeout(() => {
        this.setState((prevState) => ({
          hasError: false,
          errorCount: prevState.errorCount + 1,
        }));
      }, this.retryDelay);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Show fallback or nothing while recovering
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}

export default DomErrorBoundary;
