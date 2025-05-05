// ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 p-8 rounded-lg shadow-md max-w-md mx-auto mt-10">
          <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ ما</h2>
          <p className="text-gray-700 mb-4">عذراً، حدث خطأ أثناء محاولة عرض هذه الصفحة.</p>
          {this.state.error && (
            <div className="bg-white p-4 rounded border border-red-200 mb-4 overflow-auto">
              <p className="font-mono text-sm text-red-500">{this.state.error.toString()}</p>
            </div>
          )}
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            العودة إلى صفحة تسجيل الدخول
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;