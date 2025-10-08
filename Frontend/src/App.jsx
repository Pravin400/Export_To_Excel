import { useEffect, useState } from 'react'
import './index.css'
import api from './api'

function Form({onSave, editing, setEditing}){
  const [course, setCourse] = useState({courseName: '', courseDescription: '', price: ''})

  useEffect(()=>{
    if(editing) setCourse(editing)
  },[editing])

  function handleChange(e){
    const {name, value} = e.target
    setCourse(prev=>({ ...prev, [name]: name==='price' ? (value===''? '' : Number(value)) : value }))
  }

  async function submit(e){
    e.preventDefault()
    await onSave({...course})
    setCourse({courseName: '', courseDescription: '', price: ''})
    setEditing(null)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Course name</label>
        <input required name="courseName" value={course.courseName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea required name="courseDescription" value={course.courseDescription} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input required name="price" type="number" step="0.01" value={course.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editing ? 'Update' : 'Add Course'}</button>
        {editing && <button type="button" onClick={()=>{setEditing(null); setCourse({courseName: '', courseDescription: '', price: ''})}} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>}
      </div>
    </form>
  )
}

export default function App(){
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  async function load(){
    setLoading(true)
    try{
      const data = await api.listCourses()
      setCourses(data)
    }catch(err){
      console.error(err)
      alert('Failed to load courses')
    }finally{setLoading(false)}
  }

  useEffect(()=>{ load() }, [])

  async function handleSave(course){
    try{
      await api.saveCourse(course)
      await load()
    }catch(e){ console.error(e); alert('Save failed') }
  }

  async function handleDelete(id){
    if(!confirm('Delete this course?')) return
    try{ await api.deleteCourse(id); await load() }catch(e){ console.error(e); alert('Delete failed') }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Courses Manager</h2>
            <div className="flex gap-2">
            <button onClick={()=>api.exportExcel()} className="px-3 py-2 bg-green-600 text-white rounded">Export Excel</button>
            <button onClick={load} className="px-3 py-2 bg-gray-200 rounded">Refresh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Add / Edit</h3>
            <Form onSave={handleSave} editing={editing} setEditing={setEditing} />
          </div>

          <div>
            <h3 className="font-medium mb-2">Courses List</h3>
            {loading ? <div>Loading...</div> : (
              <ul className="space-y-3">
                {courses.length===0 && <li className="text-sm text-gray-500">No courses yet</li>}
                {courses.map(c=> (
                  <li key={c.id} className="p-3 border rounded flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{c.courseName} <span className="text-sm text-gray-500">(${c.price})</span></div>
                      <div className="text-sm text-gray-600">{c.courseDescription}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={()=>setEditing(c)} className="text-sm px-2 py-1 bg-yellow-400 rounded">Edit</button>
                      <button onClick={()=>handleDelete(c.id)} className="text-sm px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
