import { api } from '../api'

export const getFamilyMembers = async () => {
  const response = await api.get('/family')
  return Array.isArray(response.data) ? response.data : [response.data]
}

export const createFamilyMember = async (payload) => {
  return api.post('/family', payload)
}

export const updateFamilyMember = async (id, payload) => {
  return api.put(`/family/${id}`, payload)
}

export const deleteFamilyMember = async (id) => {
  return api.delete(`/family/${id}`)
}

