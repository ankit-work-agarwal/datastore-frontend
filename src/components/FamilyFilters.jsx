function FamilyFilters({
  searchText,
  relationFilter,
  relationOptions,
  filteredCount,
  totalCount,
  onSearchChange,
  onRelationChange,
  onClear,
}) {
  return (
    <>
      <h3>Family Members</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search by name, relation, phone, or email"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          style={{ minWidth: 320 }}
        />
        <select value={relationFilter} onChange={(event) => onRelationChange(event.target.value)}>
          {relationOptions.map((relation) => (
            <option key={relation} value={relation}>
              {relation === 'all' ? 'All Relations' : relation}
            </option>
          ))}
        </select>
        <button type="button" onClick={onClear}>
          Clear
        </button>
      </div>
      <p style={{ marginTop: 0 }}>
        Showing {filteredCount} of {totalCount} member(s)
      </p>
    </>
  )
}

export default FamilyFilters

