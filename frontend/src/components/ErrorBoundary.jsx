import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center bg-[#0a0a0a] rounded-3xl border border-red-500/20 m-4">
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20 font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong loading this view</h2>
          <p className="text-white/50 text-xs font-mono max-w-lg mb-6 break-words bg-white/5 p-4 rounded-xl border border-white/10">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2.5 bg-brand text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-colors shadow-lg"
            >
              Retry View
            </button>
            <button
              onClick={() => { window.location.href = '/admin'; }}
              className="px-5 py-2.5 bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/20 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
