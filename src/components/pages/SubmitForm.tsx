import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function SubmitForm() {
  const { id } = useParams()
  const [form, setForm] = useState<any>(null)
  const [fields, setFields] = useState<any[]>([])
  const [values, setValues] = useState<any>({})

  useEffect(() => {
    axios.get(`/api/forms/${id}`)
      .then(res => {
        setForm(res.data)
        setFields(res.data.fields || []) // assuming fields are stored inside form
      })
  }, [id])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post(`/api/forms/${id}/submit`, values)
      alert("Form submitted!")
    } catch (err) {
      console.error(err)
      alert("❌ Submission failed")
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📝 {form?.title}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {fields.map((field: any) => (
          <div key={field.id}>
            <label>{field.label}</label>
            <input
              name={field.id}
              type={field.type === 'file' ? 'file' : 'text'}
              required={field.required}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  )
}

export default SubmitForm
