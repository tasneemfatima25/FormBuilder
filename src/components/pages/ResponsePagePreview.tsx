import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function ResponsePage() {
  const { formId } = useParams()
  const [thankYou, setThankYou] = useState<string>('Thank you for your submission!')
const [description, setDescription] = useState<string>('')

const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  if (!formId) return

  axios.get(`http://localhost:5000/api/setting/${formId}`)
    .then(res => {
      setThankYou(res.data?.thankYouMessage || 'Thank you for your response!')
      setDescription(res.data?.description || '')
    })
    .catch(err => {
      console.error('Error loading form data:', err)
    })
}, [formId])

  

  return (
    <div className="h-screen bg-gradient-to-br from-[#d8f3f7] to-[#c7eafc] backdrop-blur-xl flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full text-center border">
        <h2 className="text-3xl font-bold text-[#189ab4] mb-4">🎉 Submitted!</h2>
        <h1 className="text-[#189ab4] text-2xl">{thankYou}</h1>
        <p className="text-gray-700 text-lg mb-6">{description}</p>
        <Link
          to={`/share/${formId}`}
          className="inline-block mt-4 px-6 py-2 bg-[#189ab4] text-white rounded-xl hover:bg-[#168aad] transition">
          Back to Form
        </Link>
      </div>
    </div>
  )
}

export default ResponsePage
