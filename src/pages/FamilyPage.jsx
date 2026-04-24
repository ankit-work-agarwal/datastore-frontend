import { useEffect, useRef, useState } from 'react'
import FamilyFilters from '../components/FamilyFilters'
import FamilyForm from '../components/FamilyForm'
import FamilyTable from '../components/FamilyTable'
import PaginationControls from '../components/PaginationControls'
import ToastNotifications from '../components/ToastNotifications'
import {
  createFamilyMember,
  deleteFamilyMember,
  getFamilyMembers,
  updateFamilyMember,
} from '../services/familyService'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\d{10}$/

const validateMemberPayload = (payload) => {
  if (!payload.name?.trim() || !payload.relation?.trim() || !payload.phone?.trim() || !payload.email?.trim()) {
    return 'All fields are required.'
  }
  if (!phoneRegex.test(payload.phone.trim())) {
    return 'Phone must be exactly 10 digits.'
  }
  if (!emailRegex.test(payload.email.trim())) {
    return 'Please enter a valid email address.'
  }
  return ''
}

const getPositiveIntegerParam = (value, fallback) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function FamilyPage() {
  const initialParams = new URLSearchParams(window.location.search)
  const [family, setFamily] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [searchText, setSearchText] = useState(initialParams.get('search') || '')
  const [relationFilter, setRelationFilter] = useState(initialParams.get('relation') || 'all')
  const [currentPage, setCurrentPage] = useState(getPositiveIntegerParam(initialParams.get('page'), 1))
  const [pageSize, setPageSize] = useState(getPositiveIntegerParam(initialParams.get('size'), 5))
  const [toasts, setToasts] = useState([])
  const toastTimersRef = useRef([])
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

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const addToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((prev) => [...prev, { id, message, type }])

    const timer = setTimeout(() => {
      removeToast(id)
    }, 3500)

    toastTimersRef.current.push(timer)
  }

  const fetchFamily = async () => {
    try {
      const members = await getFamilyMembers()
      setFamily(members)
    } catch (err) {
      addToast(err?.message || 'Failed to load family data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFamily()

    return () => {
      toastTimersRef.current.forEach((timer) => clearTimeout(timer))
      toastTimersRef.current = []
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchText, relationFilter, pageSize])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationMessage = validateMemberPayload(formData)
    if (validationMessage) {
      addToast(validationMessage, 'error')
      return
    }

    setSubmitting(true)
    try {
      await createFamilyMember({
        name: formData.name.trim(),
        relation: formData.relation.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      })
      addToast('Family member created successfully.')
      setFormData({ name: '', relation: '', phone: '', email: '' })
      await fetchFamily()
    } catch (err) {
      addToast(err?.response?.data?.message || err?.message || 'Failed to create family member.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete family member "${member.name}"?`)) {
      return
    }

    setDeletingId(member.id)

    try {
      await deleteFamilyMember(member.id)
      addToast('Family member deleted successfully.')
      await fetchFamily()
    } catch (err) {
      addToast(err?.response?.data?.message || err?.message || 'Failed to delete family member.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleStartEdit = (member) => {
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
    const validationMessage = validateMemberPayload(editData)
    if (validationMessage) {
      addToast(validationMessage, 'error')
      return
    }

    setUpdatingId(id)
    try {
      await updateFamilyMember(id, {
        name: editData.name.trim(),
        relation: editData.relation.trim(),
        phone: editData.phone.trim(),
        email: editData.email.trim(),
      })
      addToast('Family member updated successfully.')
      handleCancelEdit()
      await fetchFamily()
    } catch (err) {
      addToast(err?.response?.data?.message || err?.message || 'Failed to update family member.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const normalizedSearch = searchText.trim().toLowerCase()
  const relationOptions = ['all', ...new Set(family.map((member) => member.relation).filter(Boolean))]
  const filteredFamily = family.filter((member) => {
    const matchesRelation = relationFilter === 'all' || member.relation === relationFilter
    const matchesSearch =
      !normalizedSearch ||
      member.name?.toLowerCase().includes(normalizedSearch) ||
      member.relation?.toLowerCase().includes(normalizedSearch) ||
      member.email?.toLowerCase().includes(normalizedSearch) ||
      member.phone?.toLowerCase().includes(normalizedSearch)

    return matchesRelation && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filteredFamily.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const paginatedFamily = filteredFamily.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchText.trim()) {
      params.set('search', searchText.trim())
    }
    if (relationFilter !== 'all') {
      params.set('relation', relationFilter)
    }
    if (safeCurrentPage !== 1) {
      params.set('page', String(safeCurrentPage))
    }
    if (pageSize !== 5) {
      params.set('size', String(pageSize))
    }

    const query = params.toString()
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState({}, '', nextUrl)
  }, [searchText, relationFilter, safeCurrentPage, pageSize])

  if (loading) return <h2>Loading family data...</h2>

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <ToastNotifications toasts={toasts} onClose={removeToast} />
      <h2>Family Members Details</h2>
      <FamilyFilters
        searchText={searchText}
        relationFilter={relationFilter}
        relationOptions={relationOptions}
        filteredCount={filteredFamily.length}
        totalCount={family.length}
        onSearchChange={setSearchText}
        onRelationChange={setRelationFilter}
        onClear={() => {
          setSearchText('')
          setRelationFilter('all')
        }}
      />
      <FamilyTable
        members={paginatedFamily}
        editingId={editingId}
        editData={editData}
        deletingId={deletingId}
        updatingId={updatingId}
        onEditChange={handleEditChange}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <PaginationControls
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        <FamilyForm formData={formData} submitting={submitting} onChange={handleChange} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default FamilyPage

