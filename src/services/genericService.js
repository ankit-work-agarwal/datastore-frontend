import { api } from '../api'

export const getAll = (apiPath) => api.get(apiPath).then((r) => r.data)
export const create = (apiPath, payload) => api.post(apiPath, payload).then((r) => r.data)
export const update = (apiPath, id, payload) => api.put(`${apiPath}/${id}`, payload).then((r) => r.data)
export const remove = (apiPath, id) => api.delete(`${apiPath}/${id}`)

