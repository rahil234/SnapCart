// import React from 'react';
//
// class ErrorBoundary extends React.Component<
//   { fallback: React.ReactNode },
//   { hasError: boolean }
// > {
//   constructor(props: any) {
//     super(props);
//     this.state = { hasError: false };
//   }
//
//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }
//
//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error("ErrorBoundary caught an error", error, errorInfo);
//   }
//
//   render() {
//     if (this.state.hasError) {
//       return this.props.fallback;
//     }
//
//     return this.props.children;
//   }
// }
//
// export default ErrorBoundary;