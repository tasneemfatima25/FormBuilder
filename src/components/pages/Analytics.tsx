import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { BarChart3 } from 'lucide-react'

function Analytics() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [formTitle, setFormTitle] = useState<string | null>(null)
  const { formId } = useParams()

  useEffect(() => {
    if (!formId) return

    axios.get(`http://localhost:5000/api/subforms/analytics/${formId}`, {
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(res => {
        const subs = res.data || []
        setSubmissions(subs)

        // If populated title exists, set it
        if (subs.length && subs[0].formId?.title) {
          setFormTitle(subs[0].formId.title)
        }
      })
      .catch(err => {
        console.error('❌ Analytics error:', err)
        setSubmissions([])
      })
  }, [formId])

  const downloadExcel = () => {
    if (!submissions.length) return

    const excelData = submissions.map((sub) => {
      const flat: Record<string, any> = {}

      for (const key in sub.values) {
        const value = sub.values[key]
        if (Array.isArray(value)) {
          flat[key] = value.join(', ')
        } else if (typeof value === 'object' && value !== null) {
          flat[key] = JSON.stringify(value)
        } else {
          flat[key] = value
        }
      }

      flat["Submitted At"] = new Date(sub.createdAt).toLocaleString()
      return flat
    })

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    const safeTitle = formTitle?.replace(/[^a-zA-Z0-9]/g, "_") || "form"

    XLSX.utils.book_append_sheet(workbook, worksheet, safeTitle)
    XLSX.writeFile(workbook, `${safeTitle}-submissions.xlsx`)
  }

  if (!formId) {
    return <p className="text-center text-gray-500 mt-10">Form ID missing from URL</p>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white/60 rounded-3xl backdrop-blur-2xl shadow-2xl m-10 px-6 sm:px-10 border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-[#189ab4] w-7 h-7" />
        <h2 className="text-3xl font-bold text-gray-800">
          Analytics <span className="text-[#189ab4]">{formTitle || '...'}</span>
        </h2>
      </div>

      {/* Stats */}
      <div className="bg-[#189ab4]/10 p-4 rounded-lg mb-6 text-center">
        <p className="text-gray-700 text-xl">
          Total Submissions: <span className="font-semibold text-black">{submissions.length}</span>
        </p>
      </div>

      {/* Download Button */}
      {submissions.length > 0 && (
        <div className="flex justify-end mb-6">
           <button
          className="bg-[#189ab4] text-white px-5 py-2 rounded-md shadow"
          onClick={downloadExcel}
        >
          Download CSV
        </button>
        </div>
      )}

      {/* Empty State */}
      {submissions.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No submissions found for this form yet.</p>
      )}
    </div>
  )
}

export default Analytics
