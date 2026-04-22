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
  if (members.length === 0) {
    return <p>No family records found.</p>
  }

  return (
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
        {members.map((member) => (
          <tr key={member.id}>
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
        ))}
      </tbody>
    </table>
  )
}

export default FamilyTable

