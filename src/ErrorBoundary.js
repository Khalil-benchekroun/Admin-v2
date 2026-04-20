import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: "40px",
            fontFamily: "monospace",
            background: "#1a0000",
            color: "#ff6b6b",
            minHeight: "100vh",
          }}
        >
          <div
            style={{ fontSize: "24px", marginBottom: "16px", color: "#ff4444" }}
          >
            ❌ Erreur React
          </div>
          <div
            style={{ fontSize: "16px", marginBottom: "24px", color: "#ffaaaa" }}
          >
            {this.state.error.message}
          </div>
          <pre
            style={{
              fontSize: "12px",
              color: "#ff8888",
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
            }}
          >
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
