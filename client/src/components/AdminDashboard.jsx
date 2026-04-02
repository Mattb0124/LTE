import { useState, useEffect } from 'react'

const TIMELINE_LABELS = {
  immediately: 'Immediately',
  '30days': 'Within 30 Days',
  '1-3months': '1–3 Months',
  '3-6months': '3–6 Months',
  browsing: 'Just Browsing',
}

export default function AdminDashboard({ onLogout }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetch('/api/leads', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    onLogout()
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Luke's <span>LTE</span></h1>
          <p className="tagline">Lead Dashboard</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </header>

      <main className="admin-main">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-number">{leads.length}</div>
            <div className="stat-label">Total Leads</div>
          </div>
        </div>

        {loading ? (
          <p className="admin-loading-text">Loading leads...</p>
        ) : leads.length === 0 ? (
          <div className="admin-empty">
            <p>No leads yet. They'll appear here when someone submits the form.</p>
          </div>
        ) : (
          <div className="leads-table-wrap">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Timeline</th>
                  <th>Trade-In</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="td-name">{lead.full_name}</td>
                    <td><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
                    <td><a href={`tel:${lead.phone}`}>{lead.phone}</a></td>
                    <td>{TIMELINE_LABELS[lead.timeline] || lead.timeline}</td>
                    <td>
                      {lead.vin || lead.mileage || lead.modifications || lead.asking_price ? (
                        <button
                          className="btn-details"
                          onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                        >
                          {expandedId === lead.id ? 'Hide' : 'View'}
                        </button>
                      ) : (
                        <span className="no-trade">—</span>
                      )}
                    </td>
                    <td className="td-date">{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Expanded trade-in details */}
            {expandedId && (() => {
              const lead = leads.find((l) => l.id === expandedId)
              if (!lead) return null
              return (
                <div className="trade-in-details">
                  <h3>Trade-In Details — {lead.full_name}</h3>
                  <div className="details-grid">
                    {lead.vin && <div><strong>VIN:</strong> {lead.vin}</div>}
                    {lead.mileage && <div><strong>Mileage:</strong> {lead.mileage.toLocaleString()}</div>}
                    {lead.modifications && <div><strong>Modifications:</strong> {lead.modifications}</div>}
                    {lead.asking_price && <div><strong>Desired Value:</strong> {lead.asking_price}</div>}
                  </div>
                  <button className="btn-close-details" onClick={() => setExpandedId(null)}>Close</button>
                </div>
              )
            })()}
          </div>
        )}
      </main>
    </div>
  )
}
