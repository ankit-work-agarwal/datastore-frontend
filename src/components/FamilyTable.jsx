import { useState } from 'react'
import FamilyMemberDetail from './FamilyMemberDetail'

function FamilyTable({
  members,
  editingId,
  editData,
  deletingId,
  updatingId,
  onEditChange,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}) {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  if (members.length === 0) {
    return <p>No family records found.</p>
  }

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', minWidth: 700, width: '100%' }}>
      <thead>
        <tr>
          <th style={{ width: 32 }}></th>
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
        {members.map((member) => (
          <>
            <tr key={member.id}>
              <td style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  title={expandedId === member.id ? 'Collapse' : 'Expand details'}
                  onClick={() => toggleExpand(member.id)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16 }}
                >
                  {expandedId === member.id ? '▲' : '▼'}
                </button>
              </td>
              <td>{member.id}</td>
              <td>
                {editingId === member.id ? (
                  <input name="name" value={editData.name} onChange={onEditChange} />
                ) : (
                  member.name
                )}
              </td>
              <td>
                {editingId === member.id ? (
                  <input name="relation" value={editData.relation} onChange={onEditChange} />
                ) : (
                  member.relation
                )}
              </td>
              <td>
                {editingId === member.id ? (
                  <input name="phone" value={editData.phone} onChange={onEditChange} maxLength="10" />
                ) : (
                  member.phone
                )}
              </td>
              <td>
                {editingId === member.id ? (
                  <input name="email" type="email" value={editData.email} onChange={onEditChange} />
                ) : (
                  member.email
                )}
              </td>
              <td>{member.vehicles?.length || 0}</td>
              <td>{member.documents?.length || 0}</td>
              <td>
                {editingId === member.id ? (
                  <>
                    <button type="button" onClick={() => onUpdate(member.id)} disabled={updatingId === member.id}>
                      {updatingId === member.id ? 'Saving...' : 'Save'}
                    </button>{' '}
                    <button type="button" onClick={onCancelEdit} disabled={updatingId === member.id}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => onStartEdit(member)}>
                      Edit
                    </button>{' '}
                    <button type="button" onClick={() => onDelete(member)} disabled={deletingId === member.id}>
                      {deletingId === member.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
              </td>
            </tr>
            {expandedId === member.id && (
              <tr key={`${member.id}-detail`}>
                <td colSpan={9} style={{ padding: 0, border: '1px solid #e2e8f0' }}>
                  <FamilyMemberDetail member={member} />
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  )
}

export default FamilyTable
