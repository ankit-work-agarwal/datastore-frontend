import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { moduleConfigs } from '../config/modules'
import { getDashboardSummary } from '../services/dashboardService'

const moduleIcons = {
  familyMembers: '👨‍👩‍👧‍👦',
  vehicles: '🚗',
  documents: '📄',
  investments: '📈',
  insurances: '🛡️',
  medicalRecords: '🏥',
  properties: '🏠',
  bankAccounts: '🏦',
  contacts: '📞',
  subscriptions: '📺',
  loans: '💳',
}

function SkeletonCard() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, backgroundColor: '#f3f4f6' }}>
      <div style={{ height: 18, width: '60%', backgroundColor: '#d1d5db', borderRadius: 4, marginBottom: 10 }} />
      <div style={{ height: 32, width: '30%', backgroundColor: '#d1d5db', borderRadius: 4, marginBottom: 10 }} />
      <div style={{ height: 14, width: '40%', backgroundColor: '#d1d5db', borderRadius: 4 }} />
    </div>
  )
}

function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getDashboardSummary()
        setSummary(data)
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load dashboard summary.')
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h2>Dashboard</h2>
      <p style={{ marginTop: 0 }}>Overview of your datastore and quick links to each details page.</p>

      {error ? <p style={{ color: '#d32f2f' }}>{error}</p> : null}

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {loading
          ? moduleConfigs.map((module) => <SkeletonCard key={module.path} />)
          : moduleConfigs.map((module) => (
              <div
                key={module.path}
                style={{ border: '1px solid #d7d7d7', borderRadius: 8, padding: 12, backgroundColor: '#fafafa' }}
              >
                <h3 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span aria-hidden="true">{moduleIcons[module.key] || '📁'}</span>
                  <span>{module.label}</span>
                </h3>
                <Link
                  to={module.path}
                  style={{
                    display: 'inline-block',
                    margin: '0 0 10px',
                    fontSize: 28,
                    fontWeight: 700,
                    textDecoration: 'none',
                    color: '#1d4ed8',
                  }}
                  title={`Open ${module.label} details`}
                >
                  {summary[module.key] ?? 0}
                </Link>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 12 }}>Click the count to open details</p>
              </div>
            ))}
      </div>

      {!loading && summary ? (
        <div style={{ marginTop: 24 }}>
          <h3>Financial Snapshot</h3>
          <table cellPadding="8" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries({
                'Total Invested': summary.totalInvestedAmount,
                'Current Investment Value': summary.totalCurrentInvestmentValue,
                'Total Property Value': summary.totalPropertyValue,
                'Outstanding Loan': summary.totalOutstandingLoanAmount,
                'Monthly Subscription Cost': summary.totalMonthlySubscriptionCost,
                'Active Subscriptions': summary.activeSubscriptions,
              }).map(([label, value]) => (
                <tr key={label}>
                  <td style={{ color: '#6b7280', paddingRight: 24 }}>{label}</td>
                  <td style={{ fontWeight: 600 }}>{value ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

export default DashboardPage

