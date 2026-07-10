import React from 'react'

/**
 * ErrorBoundary — prevents one crashing section from blanking the whole app,
 * and renders the actual error message so failures are visible/diagnosable.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', this.props.name || '', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div
          data-error-boundary={this.props.name || 'section'}
          style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: '#fca5a5',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            position: 'relative',
            zIndex: 100,
          }}
        >
          <strong>Section failed to render{this.props.name ? ` (${this.props.name})` : ''}:</strong>
          <br />
          {String(this.state.error && (this.state.error.message || this.state.error))}
        </div>
      )
    }
    return this.props.children
  }
}
