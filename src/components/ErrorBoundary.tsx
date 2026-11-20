import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-12 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 text-[#0B1F3A]">
          <h2 className="text-lg font-semibold text-red-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-800">{this.state.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="mt-4 cursor-pointer rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#132D52]"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
