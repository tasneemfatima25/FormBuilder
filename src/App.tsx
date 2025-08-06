import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/pages/Dashboard'
import FormBuilder from './components/pages/FormBuilder'
import FormSettings from './components/pages/FormSettings'
import Analytics from './components/pages/Analytics'
import SubmitForm from './components/pages/SubmitForm'
import PreviewForm from './components/pages/PreviewForm'
import SharedForm from './components/pages/SharedForm' 
import { Toaster } from 'react-hot-toast'
import Layout from './components/pages/Layout'
import AnalyticsDashboard from './components/pages/AnalyticsDashboard'
import ResponsePage from './components/pages/ResponsePage'
import ResponsePagePreview from './components/pages/ResponsePagePreview'

function App() {
  return (
    <BrowserRouter>
        <Toaster position="top-right" />
      <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
        <Route path="/builder/:id" element={<FormBuilder />} />
        <Route path="/formlist" element={<Dashboard />} />
        <Route path="/setting/:formId" element={<FormSettings />} />
        <Route path="/analytics/:formId" element={<Analytics />} />
        <Route path="/submit/:id" element={<SubmitForm />} />
        <Route path="/preview/:id" element={<PreviewForm />} />
        <Route path="/shared/:id" element={<SharedForm />} />
        <Route path="/AnalyticsDashboard" element={<AnalyticsDashboard />} />
        <Route path="/response/:formId" element={<ResponsePage />} />
        </Route>
        <Route path="/share/:id" element={<SharedForm />} />
        <Route path="/responsed/:formId" element={<ResponsePagePreview />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
