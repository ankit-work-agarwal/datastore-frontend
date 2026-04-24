const thStyle = { textAlign: 'left', padding: '6px 10px', backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }
const tdStyle = { padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontSize: 14 }

function SubTable({ title, rows, columns }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <strong style={{ display: 'block', marginBottom: 6, color: '#374151' }}>{title}</strong>
      {rows.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>No records.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={thStyle}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id ?? idx}>
                {columns.map((col) => (
                  <td key={col.key} style={tdStyle}>
                    {row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function FamilyMemberDetail({ member }) {
  return (
    <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 24 }}>

        <SubTable
          title="🚗 Vehicles"
          rows={member.vehicles || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'type', label: 'Type' },
            { key: 'model', label: 'Model' },
            { key: 'registrationNumber', label: 'Reg. Number' },
          ]}
        />

        <SubTable
          title="📄 Documents"
          rows={member.documents || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'type', label: 'Type' },
            { key: 'expiryDate', label: 'Expiry Date' },
          ]}
        />

        <SubTable
          title="💰 Investments"
          rows={member.investments || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'type', label: 'Type' },
            { key: 'name', label: 'Name' },
            { key: 'institution', label: 'Institution' },
            { key: 'investedAmount', label: 'Invested' },
            { key: 'currentValue', label: 'Current Value' },
            { key: 'maturityDate', label: 'Maturity' },
          ]}
        />

        <SubTable
          title="🛡️ Insurance"
          rows={member.insurances || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'type', label: 'Type' },
            { key: 'policyNumber', label: 'Policy No.' },
            { key: 'provider', label: 'Provider' },
            { key: 'premiumAmount', label: 'Premium' },
            { key: 'sumAssured', label: 'Sum Assured' },
            { key: 'expiryDate', label: 'Expiry' },
          ]}
        />

        <SubTable
          title="🏥 Medical Records"
          rows={member.medicalRecords || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'type', label: 'Type' },
            { key: 'title', label: 'Title' },
            { key: 'doctorName', label: 'Doctor' },
            { key: 'hospitalName', label: 'Hospital' },
            { key: 'recordDate', label: 'Date' },
          ]}
        />

        <SubTable
          title="🏠 Properties"
          rows={member.properties || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'type', label: 'Type' },
            { key: 'address', label: 'Address' },
            { key: 'city', label: 'City' },
            { key: 'purchaseValue', label: 'Purchase Value' },
            { key: 'currentValue', label: 'Current Value' },
          ]}
        />

        <SubTable
          title="🏦 Bank Accounts"
          rows={member.bankAccounts || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'accountType', label: 'Type' },
            { key: 'bankName', label: 'Bank' },
            { key: 'accountNumber', label: 'Account No.' },
            { key: 'ifscCode', label: 'IFSC' },
            { key: 'balance', label: 'Balance' },
          ]}
        />

        <SubTable
          title="📞 Contacts"
          rows={member.contacts || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category' },
            { key: 'phone', label: 'Phone' },
            { key: 'organization', label: 'Organization' },
          ]}
        />

        <SubTable
          title="📺 Subscriptions"
          rows={member.subscriptions || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category' },
            { key: 'amount', label: 'Amount' },
            { key: 'billingCycle', label: 'Billing' },
            { key: 'renewalDate', label: 'Renewal' },
            { key: 'isActive', label: 'Active' },
          ]}
        />

        <SubTable
          title="🏧 Loans"
          rows={member.loans || []}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'loanType', label: 'Type' },
            { key: 'bankName', label: 'Bank' },
            { key: 'principalAmount', label: 'Principal' },
            { key: 'outstandingAmount', label: 'Outstanding' },
            { key: 'emiAmount', label: 'EMI' },
            { key: 'status', label: 'Status' },
            { key: 'endDate', label: 'End Date' },
          ]}
        />

      </div>
    </div>
  )
}

export default FamilyMemberDetail

