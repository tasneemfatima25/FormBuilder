import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'

import FieldEditor from './FieldEditor'

interface Field {
  id: string
  type: string
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
}

function FormBuilder() {
  const [title, setTitle] = useState('')
  const [fields, setFields] = useState<Field[]>([])
  const navigate = useNavigate()
  const { id } = useParams()

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    if (id && id !== 'new') {
      axios.get(`https://formbuilderbackend-production.up.railway.app/api/forms/${id}`)
        .then(res => {
          setTitle(res.data.title)
            const fieldsWithIds = res.data.fields.map((field: any) => ({
            ...field,
            id: field.id || `${field.type}-${Date.now()}-${Math.random()}`
          }))
          setFields(fieldsWithIds)
        })
        .catch(err => {
          console.error('❌ Failed to load form', err)
          toast.error('Failed to load form')
        })
    }
  }, [id])
  

  const addField = (type: string) => {
    const newField: Field = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      label: `${type} field`,
      required: false,
      placeholder: '',
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : []
    }
    setFields([...fields, newField])
  }

  const handleDragEnd = (event: DragEndEvent) => {

    const { active, over } = event
  
    if (!over || active.id === over.id) return
  
    const oldIndex = fields.findIndex(f => f.id === active.id)
    const newIndex = fields.findIndex(f => f.id === over.id)
  
    if (oldIndex === -1 || newIndex === -1) return
  
    setFields(arrayMove(fields, oldIndex, newIndex))
  }
  

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a form title");
      return;
    }
  
    if (fields.length === 0) {
      toast.error("Please add at least one field to the form");
      return;
    }
  
    const cleanedFields = fields.map(field => {
      const baseField = {
        id: field.id,
        type: field.type,
        label: field.label,
        required: field.required,
        placeholder: field.placeholder
      };
    
      if (['checkbox', 'radio', 'select'].includes(field.type)) {
        return { ...baseField, options: field.options || [] };
      }
    
      return baseField;
    });
    
    
    const payload = {
      title,
      fields: cleanedFields,
      status: 'draft'
    };

    
  
    try {
      if (id && id !== 'new') {
        await axios.put(`https://formbuilderbackend-production.up.railway.app/api/forms/${id}`, payload);
        toast.success("Form updated");
    
        // Optional re-fetch before navigation
        const { data } = await axios.get(`https://formbuilderbackend-production.up.railway.app/api/forms/${id}`);
        if (data.fields.length > 0) {
          navigate(`/shared/${id}`);
        } else {
          toast.error("Fields missing after update. Try again.");
        }
    
      } else {
        const res = await axios.post('https://formbuilderbackend-production.up.railway.app/api/forms', payload);
        toast.success('Form Created Successfully');
        navigate(`/setting/${res.data._id}`);
      }
    } catch (err) {
      console.error('Save failed', err);
      toast.error('Failed to save form');
    }
    
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-3xl shadow-xl my-10">
    {/* Header */}
    <div className="mb-8">
      <h2 className="text-4xl font-bold text-gray-700 mb-1">
        {id !== 'new' ? 'Edit Form' : 'Create New Form'}
      </h2>
      <p className="text-gray-600">Design your custom form by adding and arranging fields below.</p>
    </div>
  
    {/* Title Input */}
    <input
      type="text"
      placeholder="Enter form title..."
      value={title}
      onChange={e => setTitle(e.target.value)}
      className="border-2 border-[#189ab4]/50 bg-white/40 backdrop-blur-md text-gray-800 placeholder-gray-500 rounded-xl px-5 py-3 w-full text-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#189ab4] shadow-inner"
    />
  
    {/* Field Buttons */}
    <div className="flex flex-wrap gap-3 mb-8">
      {['text', 'email', 'checkbox', 'radio', 'select', 'file upload', 'phone number'].map(type => (
        <button
          key={type}
          onClick={() => addField(type)}
          className="capitalize text-sm rounded-xl px-4 py-2 bg-white/40 backdrop-blur-md hover:bg-[#189ab4]/60 transition shadow-sm focus:outline-none"
        >
          ➕ {type}
        </button>
      ))}
    </div>
  
    {/* Field List with Drag-and-Drop */}
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4 mb-10">
          {fields.map((field, index) => (
            <FieldEditor
              key={field.id}
              field={field}
              index={index}
              onUpdate={(updatedField, i) => {
                const updated = [...fields]
                updated[i] = updatedField
                setFields(updated)
              }}
              onRemove={i => {
                const updated = [...fields]
                updated.splice(i, 1)
                setFields(updated)
              }}
            />
          ))}
          {fields.length === 0 && (
            <p className="text-gray-500 italic text-center">No fields added yet. Click above to add one.</p>
          )}
        </div>
      </SortableContext>
    </DndContext>
  
    {/* Save Button */}
    <div className="text-right">
      <button
        onClick={handleSave}
        className="bg-[#189ab4] hover:bg-[#127f95] text-white text-sm font-medium px-6 py-3 rounded-xl shadow-md transition">
        {id !== 'new' ? 'Update Form' : 'Save Form'}
      </button>
    </div>
  </div>
  
  )
}

export default FormBuilder
