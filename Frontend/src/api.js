// Centralized API helper
// Base URL can be configured at build time via VITE_API_BASE or at runtime via setBaseUrl()

let base = import.meta.env.VITE_API_BASE || '/api'

export function setBaseUrl(url) {
  if (!url) return
  // allow values like 'http://localhost:8080' or '/api'
  base = url.endsWith('/') ? url.slice(0, -1) : url
}

function build(path) {
  // path may start with /
  if (!path) return base
  return path.startsWith('/') ? base + path : base + '/' + path
}

export async function listCourses() {
  const res = await fetch(build('/courses'))
  if (!res.ok) throw new Error('Failed to fetch courses')
  return res.json()
}

export async function saveCourse(course) {
  const res = await fetch(build('/courses/save'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  })
  if (!res.ok) throw new Error('Failed to save course')
  return res.json()
}

export async function deleteCourse(id) {
  const res = await fetch(build(`/courses/delete/${id}`), { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete course')
  return res
}

export async function exportExcel() {
  const res = await fetch(build('/courses/excel'))
  if (!res.ok) throw new Error('Export failed')
  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'courses.xls'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export default {
  setBaseUrl,
  listCourses,
  saveCourse,
  deleteCourse,
  exportExcel,
}
