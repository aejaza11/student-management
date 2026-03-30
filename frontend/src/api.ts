export type ApiResult = {
  success?: boolean
  error?: string
  [key: string]: unknown
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5000/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  })

  const payload = (await response.json()) as T

  if (!response.ok) {
    throw new Error((payload as ApiResult).error ?? 'Request failed')
  }

  return payload
}

export const api = {
  createAdmin: (data: Record<string, unknown>) =>
    request<ApiResult>('/admins', { method: 'POST', body: JSON.stringify(data) }),

  createUserLogin: (data: Record<string, unknown>) =>
    request<ApiResult>('/users', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: Record<string, unknown>) =>
    request<ApiResult>('/login', { method: 'POST', body: JSON.stringify(data) }),

  createStudent: (data: Record<string, unknown>) =>
    request<ApiResult>('/students', { method: 'POST', body: JSON.stringify(data) }),

  listStudents: () => request<ApiResult>('/students'),

  searchStudents: (keyword: string) =>
    request<ApiResult>(`/students/search?keyword=${encodeURIComponent(keyword)}`),

  updateStudent: (studentId: number, data: Record<string, unknown>) =>
    request<ApiResult>(`/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteStudent: (studentId: number) =>
    request<ApiResult>(`/students/${studentId}`, { method: 'DELETE' }),

  createSubject: (data: Record<string, unknown>) =>
    request<ApiResult>('/subjects', { method: 'POST', body: JSON.stringify(data) }),

  createClass: (data: Record<string, unknown>) =>
    request<ApiResult>('/classes', { method: 'POST', body: JSON.stringify(data) }),

  assignClass: (data: Record<string, unknown>) =>
    request<ApiResult>('/classes/assign', { method: 'POST', body: JSON.stringify(data) }),

  createMark: (data: Record<string, unknown>) =>
    request<ApiResult>('/marks', { method: 'POST', body: JSON.stringify(data) }),

  getStudentMarks: (studentId: number) => request<ApiResult>(`/students/${studentId}/marks`),
}
