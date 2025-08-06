import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useForm, useController, Controller } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import Loader from './Loader'

function SharedForm() {
  const { id } = useParams()
  const [form, setForm] = useState<any>(null)
  const navigate = useNavigate()

  const { handleSubmit, control, setValue, getValues, register, formState: { errors } } = useForm({
    mode: 'onSubmit'
  })

  useEffect(() => {
    axios.get(`https://formbuilderbackend-production.up.railway.app/api/forms/${id}`)
      .then(res => {
        setForm(res.data)

        res.data.fields.forEach((field: any) => {
          if (!field.id) {
            field.id = field.label?.toLowerCase().replace(/\s+/g, '_') || `field_${Math.random()}`
          }

          if (field.type === 'checkbox') {
            setValue(field.id, [])
          } else {
            setValue(field.id, '')
          }
        })
      })
      .catch(() => alert('Form not found'))
  }, [id, setValue])

  const onSubmit = async (formValues: any) => {
    const data = new FormData()

    form.fields.forEach((field: any) => {
      const value = formValues[field.id]
      if (field.type === 'file upload') {
        if (value?.[0]) data.append(field.id, value[0])
      } else {
        data.append(field.id, value ?? '')
      }
    })

    try {
      await axios.post(
        `https://formbuilderbackend-production.up.railway.app/api/subforms/${form._id}/submissions`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      toast.success('Form submitted successfully')
      navigate(`/responsed/${form._id}`)
    } catch (err: any) {
      console.error('❌ Submission error:', err)
      toast.error('❌ Failed to submit form')
    }
  }

  if (!form) return <div className="fixed inset-0 z-[9999] bg-white/50 flex items-center justify-center h-screen">
    <Loader />
  </div>

  return (
    <div className="p-10 max-w-2xl mx-auto bg-gradient-to-br from-[#d8f3f7] to-[#c7eafc] backdrop-blur-2xl backdrop-blur-xl border-2 border-white rounded-3xl shadow-3xl border my-10">
      <h2 className="text-3xl font-bold text-[#189ab4] mb-8 text-center">{form.title}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {form.fields.map((field: any, index: number) => {
          const fieldName = field.id

          return (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* TEXT / EMAIL / PHONE */}
              {['text', 'email', 'phone number'].includes(field.type) && (
                <input
                  {...register(fieldName, {
                    required: field.required ? 'This field is required' : false,
                    ...(field.type === 'phone number' && {
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Phone number must be exactly 10 digits'
                      }
                    })
                  })}
                  type={field.type === 'phone number' ? 'tel' : field.type}
                  placeholder={field.placeholder}
                  className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${errors[fieldName]
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-300'
                    }`}
                />
              )}


              {/* SELECT */}
              {field.type === 'select' && (
                <select
                  {...register(fieldName, {
                    required: field.required ? 'Please select an option' : false
                  })}
                  className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${errors[fieldName]
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-300'
                    }`}
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt: string, i: number) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {/* RADIO */}
              {field.type === 'radio' && (
                <div className="space-y-2 mt-1">
                  {field.options?.map((opt: string, i: number) => (
                    <label key={i} className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={opt}
                        {...register(fieldName, {
                          required: field.required ? 'Please select one option' : false
                        })}
                        className="text-blue-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* CHECKBOX */}
              {field.type === 'checkbox' && (
                <Controller
                  control={control}
                  name={fieldName}
                  rules={{ required: field.required ? 'Please select at least one' : false }}
                  render={({ field: controllerField }) => (
                    <div className="space-y-2 mt-1">
                      {field.options?.map((opt: string, i: number) => (
                        <label key={i} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            value={opt}
                            checked={controllerField.value?.includes(opt)}
                            onChange={(e) => {
                              const isChecked = e.target.checked
                              const prev = controllerField.value || []
                              const newValue = isChecked
                                ? [...prev, opt]
                                : prev.filter((v: string) => v !== opt)
                              controllerField.onChange(newValue)
                            }}
                            className="text-blue-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
              )}

              {/* FILE UPLOAD */}
              {field.type === 'file upload' && (
                <input
                  type="file"
                  {...register(fieldName, {
                    required: field.required ? 'Please upload a file' : false
                  })}
                  className={`w-full border px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 ${errors[fieldName]
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-300'
                    }`}
                />
              )}

              {/* Error Message */}
              {errors[fieldName] && (
                <p className="text-red-500 text-sm mt-1">{(errors as any)[fieldName]?.message}</p>
              )}
            </div>
          )
        })}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#189ab4] hover:bg-[#168aad] text-white text-base rounded-xl shadow-md py-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default SharedForm
