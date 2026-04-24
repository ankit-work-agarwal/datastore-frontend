import { Link } from 'react-router-dom'

function ModulePlaceholderPage({ title, apiPath }) {
  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h2>{title} Details</h2>
      <p>The CRUD screen for this module will be added next, similar to Family.</p>
      <p>
        Backend endpoint available: <code>{apiPath}</code>
      </p>
      <p>
        Go back to <Link to="/">Dashboard</Link>
      </p>
    </div>
  )
}

export default ModulePlaceholderPage

