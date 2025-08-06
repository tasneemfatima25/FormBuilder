import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { ClipboardCopy, Eye, LineChart, Pen, PlusCircle, Trash2, CopyPlus } from 'lucide-react'

interface Form {
  _id: string
  title: string
  status: 'draft' | 'published'
  submissions: number
  createdAt: string
  fields?: any[]
}

function Dashboard() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchForms = async () => {
    try {
      setLoading(true)
      const res = await axios.get('https://formbuilderbackend-production.up.railway.app/api/forms')
      setForms(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load forms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return
    try {
      await axios.delete(`https://formbuilderbackend-production.up.railway.app/api/forms/${confirmDeleteId}`)
      toast.success('Form deleted')
      setForms(prev => prev.filter(f => f._id !== confirmDeleteId))
      setConfirmDeleteId(null)
    } catch (err) {
      console.error(err)
      toast.error('❌ Failed to delete form')
    }
  }

  const handleDuplicate = async (form: Form) => {
    const newForm = {
      title: `${form.title} (Copy)`,
      status: 'draft',
      fields: form.fields || [],
    }

    try {
      const res = await axios.post('https://formbuilderbackend-production.up.railway.app/api/forms', newForm)
      toast.success('📄 Form duplicated')
      setForms(prev => [res.data, ...prev])
    } catch (err) {
      console.error(err)
      toast.error('❌ Failed to duplicate form')
    }
  }

  return (
    <div className="min-h-screen  bg-white/60 rounded-3xl backdrop-blur-2xl shadow-2xl py-10 px-6 sm:px-10 border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-700">Forms List</h1>
            <p className="text-gray-600 mt-2">Create, manage, and analyze your custom forms</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white px-5 py-3 rounded-full shadow-md">
            <Link to="/builder/new" className="flex items-center gap-2">
              <PlusCircle size={20} />
              Create New Form
            </Link>
          </Button>
        </div>
        {/* Forms */}
        {loading ? (
          <p className="text-gray-500 text-center">⏳ Loading forms...</p>
        ) : forms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map(form => (
              <div
                key={form._id}
                className="h-full bg-white/30 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Top Section */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-[#189ab4] truncate mb-2">{form.title}</h2>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="capitalize">{form.status}</span>
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Submissions:</span> {form.submissions}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Buttons Section */}
                <div className="mt-auto flex flex-wrap gap-2">
                  <Button asChild variant="outline" className="text-sm px-3 rounded-xl shadow-md">
                    <Link to={`/builder/${form._id}`}>
                      <Pen size={16} className="mr-1" /> Edit
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="text-sm px-3 rounded-xl shadow-md">
                    <Link to={`/preview/${form._id}`}>
                      <Eye size={16} className="mr-1" /> Preview
                    </Link>
                  </Button>

                  <button
                    className="flex items-center gap-1 text-sm px-3 rounded-xl text-red-500 border border-red-500 hover:bg-red-100 shadow-md"
                    onClick={() => {
                      console.log("Delete clicked:", form._id)
                      setConfirmDeleteId(form._id)
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>


                  <Button
                    variant="outline"
                    className="text-sm px-3 rounded-xl shadow-md"
                    onClick={() => handleDuplicate(form)}
                  >
                    <CopyPlus size={16} className="mr-1" /> Duplicate
                  </Button>

                  <Button
                    variant="outline"
                    className="text-sm px-3 rounded-xl shadow-md"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/share/${form._id}`)
                      toast.success("🔗 Link copied to clipboard")
                    }}
                  >
                    <ClipboardCopy size={16} className="mr-1" /> Copy Link
                  </Button>
                  <button
                    className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl text-white  bg-[#189ab4] shadow-md"
                    onClick={() => navigate(`/analytics/${form._id}`)}>
                    <LineChart size={16} className="mr-1" /> Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-2">🚫 You don’t have any forms yet.</p>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-3 rounded-full">
              <Link to="/builder/new">➕ Create Your First Form</Link>
            </Button>
          </div>
        )}

        {/* Delete Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[9999] bg-white/50 flex items-center justify-center h-screen">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md z-[10000]">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h2>
              <p className="text-gray-600 mb-5">This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteConfirm}>Yes, Delete</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
