function FamilyForm({
  formData,
  submitting,
  onChange,
  onSubmit,
}) {
  return (
    <>
      <h3>Add Family Member</h3>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 420, marginBottom: 24 }}>
        <input name="name" value={formData.name} onChange={onChange} placeholder="Name" />
        <input name="relation" value={formData.relation} onChange={onChange} placeholder="Relation" />
        <input name="phone" value={formData.phone} onChange={onChange} placeholder="Phone" maxLength="10" />
        <input name="email" type="email" value={formData.email} onChange={onChange} placeholder="Email" />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Create Member'}
        </button>
      </form>
    </>
  )
}

export default FamilyForm

