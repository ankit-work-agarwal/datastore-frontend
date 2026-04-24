import { useEffect, useRef, useState } from 'react'
import { getFamilyMembers } from '../services/familyService'
import { create, getAll, remove, update } from '../services/genericService'
import PaginationControls from './PaginationControls'
import ToastNotifications from './ToastNotifications'

// ─── helpers ────────────────────────────────────────────────────────────────

const buildEmptyForm = (formFields) =>
  Object.fromEntries(formFields.map((f) => [f.key, f.type === 'boolean' ? false : '']))

const buildPayload = (formData, formFields, familyMemberField) => {
  const payload = {}
  formFields.forEach((f) => {
    if (f.key === 'familyMemberId') return
    if (f.type === 'number') {
      payload[f.key] = formData[f.key] !== '' ? Number(formData[f.key]) : null
    } else if (f.type === 'boolean') {
      payload[f.key] = Boolean(formData[f.key])
    } else {
      payload[f.key] = formData[f.key] || null
    }
  })
  if (familyMemberField && formData.familyMemberId) {
    payload[familyMemberField] = { id: Number(formData.familyMemberId) }
  }
  return payload
}

const validate = (formData, formFields) => {
  for (const f of formFields) {
    if (f.required && (formData[f.key] === '' || formData[f.key] === null || formData[f.key] === undefined)) {
      return `${f.label} is required.`
    }
  }
  return ''
}

// ─── form field renderer ─────────────────────────────────────────────────────

function FormField({ field, value, onChange, familyMembers }) {
  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '6px 8px' }

  if (field.type === 'familySelect') {
    return (
      <select name={field.key} value={value} onChange={onChange} style={inputStyle}>
        <option value="">— Select Family Member —</option>
        {familyMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name} ({m.relation})
          </option>
        ))}
      </select>
    )
  }

  if (field.type === 'select') {
    return (
      <select name={field.key} value={value} onChange={onChange} style={inputStyle}>
        <option value="">— Select —</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  if (field.type === 'boolean') {
    return (
      <input
        type="checkbox"
        name={field.key}
        checked={!!value}
        onChange={(e) => onChange({ target: { name: field.key, value: e.target.checked } })}
      />
    )
  }

  return (
    <input
      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
      name={field.key}
      value={value ?? ''}
      onChange={onChange}
      placeholder={field.placeholder || ''}
      style={inputStyle}
    />
  )
}

// ─── main component ──────────────────────────────────────────────────────────

function GenericCrudPage({ title, apiPath, tableColumns, formFields, familyMemberField, searchKeys, uploadOnly }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [familyMembers, setFamilyMembers] = useState([])
  const [formData, setFormData] = useState(() => buildEmptyForm(formFields))
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [toasts, setToasts] = useState([])
  const timersRef = useRef([])

  // ── toasts ──────────────────────────────────────────────────────────────────
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const addToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((prev) => [...prev, { id, message, type }])
    const t = setTimeout(() => removeToast(id), 3500)
    timersRef.current.push(t)
  }

  // ── data loading ─────────────────────────────────────────────────────────────
  const fetchRecords = async () => {
    try {
      const data = await getAll(apiPath)
      setRecords(Array.isArray(data) ? data : [data])
    } catch (err) {
      addToast(err?.message || `Failed to load ${title} records`, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
    getFamilyMembers().then(setFamilyMembers).catch(() => {})
    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [])

  useEffect(() => { setCurrentPage(1) }, [searchText, pageSize])

  // ── form handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate(formData, formFields)
    if (err) { addToast(err, 'error'); return }

    setSubmitting(true)
    try {
      await create(apiPath, buildPayload(formData, formFields, familyMemberField))
      addToast(`${title} created successfully.`)
      setFormData(buildEmptyForm(formFields))
      await fetchRecords()
    } catch (err) {
      addToast(err?.response?.data?.message || err?.message || `Failed to create ${title}.`, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── edit handlers ─────────────────────────────────────────────────────────────
  const handleStartEdit = (record) => {
    setEditingId(record.id)
    const data = buildEmptyForm(formFields)
    formFields.forEach((f) => {
      if (f.key === 'familyMemberId') return
      data[f.key] = record[f.key] ?? (f.type === 'boolean' ? false : '')
    })
    // pre-fill familyMemberId from the record's ownerName lookup isn't possible from DTO alone,
    // so we leave it blank to force re-selection
    setEditData(data)
  }

  const handleCancelEdit = () => { setEditingId(null); setEditData({}) }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (id) => {
    const err = validate(editData, formFields.filter((f) => f.key !== 'familyMemberId'))
    if (err) { addToast(err, 'error'); return }

    setUpdatingId(id)
    try {
      // For update, only send the non-family-member fields (family member isn't changed on edit)
      const payload = buildPayload(editData, formFields.filter((f) => f.key !== 'familyMemberId'), null)
      await update(apiPath, id, payload)
      addToast(`${title} updated successfully.`)
      handleCancelEdit()
      await fetchRecords()
    } catch (err) {
      addToast(err?.response?.data?.message || err?.message || `Failed to update ${title}.`, 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  // ── delete handler ────────────────────────────────────────────────────────────
  const handleDelete = async (record) => {
    if (!window.confirm(`Delete this ${title} record?`)) return
    setDeletingId(record.id)
    try {
      await remove(apiPath, record.id)
      addToast(`${title} deleted successfully.`)
      await fetchRecords()
    } catch (err) {
      addToast(err?.response?.data?.message || err?.message || `Failed to delete ${title}.`, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  // ── filtering + pagination ────────────────────────────────────────────────────
  const normalized = searchText.trim().toLowerCase()
  const filtered = records.filter((r) => {
    if (!normalized) return true
    return (searchKeys || []).some((k) => String(r[k] ?? '').toLowerCase().includes(normalized))
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  // ── render ────────────────────────────────────────────────────────────────────
  const thStyle = { textAlign: 'left', padding: '6px 10px', backgroundColor: '#f1f5f9', whiteSpace: 'nowrap' }
  const tdStyle = { padding: '6px 10px', fontSize: 14, verticalAlign: 'middle' }

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <ToastNotifications toasts={toasts} onClose={removeToast} />
      <h2>{title} Details</h2>

      {/* ── SEARCH ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
        <input
          placeholder={`Search ${title.toLowerCase()} records…`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ minWidth: 280, padding: '6px 8px' }}
        />
        {searchText && (
          <button type="button" onClick={() => setSearchText('')}>Clear</button>
        )}
      </div>
      <p style={{ marginTop: 0, marginBottom: 8, fontSize: 13, color: '#6b7280' }}>
        Showing {filtered.length} of {records.length} record(s)
      </p>

      {/* ── TABLE ── */}
      {loading ? (
        <p>Loading…</p>
      ) : paginated.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr>
                {tableColumns.map((col) => (
                  <th key={col.key} style={thStyle}>{col.label}</th>
                ))}
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((record) => (
                <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {tableColumns.map((col) => (
                    <td key={col.key} style={tdStyle}>
                      {editingId === record.id && formFields.some((f) => f.key === col.key) ? (
                        <FormField
                          field={formFields.find((f) => f.key === col.key)}
                          value={editData[col.key] ?? ''}
                          onChange={handleEditChange}
                          familyMembers={familyMembers}
                        />
                      ) : (
                        col.key === 'isActive' || col.key === 'isRented'
                          ? String(record[col.key] ?? '—')
                          : (record[col.key] ?? '—')
                      )}
                    </td>
                  ))}
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    {editingId === record.id ? (
                      <>
                        <button type="button" onClick={() => handleUpdate(record.id)} disabled={updatingId === record.id}>
                          {updatingId === record.id ? 'Saving…' : 'Save'}
                        </button>{' '}
                        <button type="button" onClick={handleCancelEdit} disabled={updatingId === record.id}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => handleStartEdit(record)}>Edit</button>{' '}
                        <button type="button" onClick={() => handleDelete(record)} disabled={deletingId === record.id}>
                          {deletingId === record.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationControls
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── CREATE FORM ── */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        {uploadOnly ? (
          <p style={{ color: '#6b7280', marginBottom: 0 }}>
            Document upload uses <code>multipart/form-data</code>. Use the API at <code>POST /document/upload</code>.
          </p>
        ) : (
          <>
            <h3>Add {title}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 480, marginBottom: 0 }}>
              {formFields.map((field) => (
                <div key={field.key}>
                  <label style={{ display: 'block', marginBottom: 2, fontSize: 13, color: '#374151' }}>
                    {field.label}{field.required ? ' *' : ''}
                  </label>
                  <FormField
                    field={field}
                    value={formData[field.key]}
                    onChange={handleChange}
                    familyMembers={familyMembers}
                  />
                </div>
              ))}
              <button type="submit" disabled={submitting} style={{ marginTop: 4 }}>
                {submitting ? 'Saving...' : `Add ${title}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default GenericCrudPage

