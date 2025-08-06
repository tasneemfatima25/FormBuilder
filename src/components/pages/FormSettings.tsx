import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { toast } from 'react-hot-toast'

function FormSettings() {
  const { formId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fields, setFields] = useState([]); // ✅ This was missing


  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thankYouMessage, setThankYouMessage] = useState('')
  const [submissionLimit, setSubmissionLimit] = useState<number | ''>('')

  // 👇 Fetch form details if editing
  useEffect(() => {
    if (!formId) {
      setLoading(false)
      return
    }

    axios.get(`https://formbuilderbackend-production.up.railway.app/api/setting/${formId}`)
    .then(res => {
      const { title, description, thankYouMessage, submissionLimit, fields } = res.data; // ✅ get fields too
      setTitle(title || '');
      setDescription(description || '');
      setThankYouMessage(thankYouMessage || '');
      setSubmissionLimit(submissionLimit || '');
      setFields(fields || []); // ✅ set fields
    })
      .catch(err => {
        console.error('Failed to fetch form:', err)
        toast.error('❌ Failed to load form settings')
      })
      .finally(() => setLoading(false))
  }, [formId])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Form title is required')
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      thankYouMessage: thankYouMessage.trim(), 
      submissionLimit: submissionLimit === '' ? undefined : Number(submissionLimit),
      fields: fields, 
      status: 'draft' // or 'published' as needed
    }

    setSaving(true)
    try {
      const response = await axios.post('https://formbuilderbackend-production.up.railway.app/api/setting', payload)
      toast.success('✅ Form created successfully')

      console.log('Form Response:', response.data)
      navigate(`/formlist`) 
    } catch (err) {
      console.error('Failed to save form:', err)
      toast.error('❌ Failed to save form')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Form Settings</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Form Title <span className="text-red-500">*</span></label>
            <Input
              placeholder="Enter form title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <Textarea
              placeholder="Enter form description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Thank You Message</label>
            <Textarea
              placeholder="Message shown after submission"
              value={thankYouMessage}
              onChange={e => setThankYouMessage(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Submission Limit</label>
            <Input
              type="number"
              placeholder="e.g., 100"
              value={submissionLimit}
              onChange={e => {
                const val = e.target.value
                if (val === '') setSubmissionLimit('')
                else if (!isNaN(Number(val))) setSubmissionLimit(Number(val))
              }}
            />
          </div>

          <div className="text-right">
            <button
              className="bg-[#189ab4] text-white px-5 py-2 rounded-md shadow"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Form'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormSettings
