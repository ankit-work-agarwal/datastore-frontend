import { useEffect, useState } from 'react'
import { api } from './api'

function App() {
  const [family, setFamily] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
  })
  const [editData, setEditData] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
  })

  const fetchFamily = async () => {
    try {
      const response = await api.get('/family')
      setFamily(Array.isArray(response.data) ? response.data : [response.data])
      setError('')
    } catch (err) {
      setError(err?.message || 'Failed to load family data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFamily()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (!formData.name || !formData.relation || !formData.phone || !formData.email) {
      setFormError('All fields are required.')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/family', formData)
      setFormSuccess('Family member created successfully.')
      setFormData({ name: '', relation: '', phone: '', email: '' })
      await fetchFamily()
    } catch (err) {
      setFormError(err?.response?.data?.message || err?.message || 'Failed to create family member.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setFormError('')
    setFormSuccess('')
    setDeletingId(id)

    try {
      await api.delete(`/family/${id}`)
      setFormSuccess('Family member deleted successfully.')
      await fetchFamily()
    } catch (err) {
      setFormError(err?.response?.data?.message || err?.message || 'Failed to delete family member.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleStartEdit = (member) => {
    setFormError('')
    setFormSuccess('')
    setEditingId(member.id)
    setEditData({
      name: member.name || '',
      relation: member.relation || '',
      phone: member.phone || '',
      email: member.email || '',
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({ name: '', relation: '', phone: '', email: '' })
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (id) => {
    setFormError('')
    setFormSuccess('')

    if (!editData.name || !editData.relation || !editData.phone || !editData.email) {
      setFormError('All edit fields are required.')
      return
    }

    setUpdatingId(id)
    try {
      await api.put(`/family/${id}`, editData)
      setFormSuccess('Family member updated successfully.')
      handleCancelEdit()
      await fetchFamily()
    } catch (err) {
      setFormError(err?.response?.data?.message || err?.message || 'Failed to update family member.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <h2>Loading family data...</h2>
  if (error) return <h2 style={{ color: 'red' }}>Error: {error}</h2>

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Datastore Frontend</h1>

      <h3>Add Family Member</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 420, marginBottom: 24 }}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input name="relation" value={formData.relation} onChange={handleChange} placeholder="Relation" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Create Member'}
        </button>
      </form>

      {formError ? <p style={{ color: 'red' }}>{formError}</p> : null}
      {formSuccess ? <p style={{ color: 'green' }}>{formSuccess}</p> : null}

      <h3>Family Members</h3>
      {family.length === 0 ? (
        <p>No family records found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Relation</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Vehicles</th>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {family.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>
                  {editingId === member.id ? (
                    <input name="name" value={editData.name} onChange={handleEditChange} />
                  ) : (
                    member.name
                  )}
                </td>
                <td>
                  {editingId === member.id ? (
                    <input name="relation" value={editData.relation} onChange={handleEditChange} />
                  ) : (
                    member.relation
                  )}
                </td>
                <td>
                  {editingId === member.id ? (
                    <input name="phone" value={editData.phone} onChange={handleEditChange} />
                  ) : (
                    member.phone
                  )}
                </td>
                <td>
                  {editingId === member.id ? (
                    <input name="email" value={editData.email} onChange={handleEditChange} />
                  ) : (
                    member.email
                  )}
                </td>
                <td>{member.vehicles?.length || 0}</td>
                <td>{member.documents?.length || 0}</td>
                <td>
                  {editingId === member.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdate(member.id)}
                        disabled={updatingId === member.id}
                      >
                        {updatingId === member.id ? 'Saving...' : 'Save'}
                      </button>{' '}
                      <button type="button" onClick={handleCancelEdit} disabled={updatingId === member.id}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => handleStartEdit(member)}>
                        Edit
                      </button>{' '}
                      <button
                        type="button"
                        onClick={() => handleDelete(member.id)}
                        disabled={deletingId === member.id}
                      >
                        {deletingId === member.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App