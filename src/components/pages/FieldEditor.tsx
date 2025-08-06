import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Field {
  id: string
  type: string
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
}

interface Props {
  field: Field
  index: number
  onUpdate: (updatedField: Field, index: number) => void
  onRemove: (index: number) => void
}

function FieldEditor({ field, index, onUpdate, onRemove }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      // {...attributes}
      className="border p-4 rounded-md shadow-sm bg-white hover:shadow-md transition space-y-3 cursor-default"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            {...attributes}
            {...listeners}
            className="cursor-move text-gray-400 select-none"
            title="Drag to reorder">
            ⠿
          </span>
          <p className="text-gray-700 font-medium capitalize">{field.type} Field</p>
        </div>
        <button onClick={() => onRemove(index)}
          className="text-sm px-3 py-2 rounded-xl text-[#B00020] border border-[#B00020]/30 hover:bg-[#B00020]/10 transition">
          Remove
        </button>
      </div>

      {/* Label */}
      <input
        type="text"
        placeholder="Label"
        value={field.label || ''}
        onChange={e => onUpdate({ ...field, label: e.target.value }, index)}
        className="border px-3 py-2 w-full rounded"
      />

      {/* Placeholder for phone number */}
      {field.type === 'phone number' && (
        <input
          type="tel"
          placeholder="Enter phone number"
          value={field.placeholder || ''}
          onChange={e => {
            const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 10)
            onUpdate({ ...field, placeholder: onlyDigits }, index)
          }}
          className="border px-3 py-2 w-full rounded"
        />
      )}

      {/* Placeholder for email */}
      {field.type === 'email' && (
        <input
          type="email"
          placeholder="Enter email"
          value={field.placeholder || ''}
          onChange={e => {
            onUpdate({ ...field, placeholder: e.target.value }, index)
          }}
          className="border px-3 py-2 w-full rounded"
        />
      )}

      {/* Placeholder for other input types */}
      {field.type !== 'checkbox' &&
        field.type !== 'radio' &&
        field.type !== 'select' &&
        field.type !== 'file upload' &&
        field.type !== 'email' &&
        field.type !== 'phone number' && (
          <input
            type="text"
            placeholder="Placeholder"
            value={field.placeholder || ''}
            onChange={e => onUpdate({ ...field, placeholder: e.target.value }, index)}
            className="border px-3 py-2 w-full rounded"
          />
        )}

      {/* Required */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={field.required}
          onChange={e => onUpdate({ ...field, required: e.target.checked }, index)}
        />
        Required
      </label>

      {/* Options */}
      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
        <>
          {(field.options || []).map((opt, optIndex) => (
            <div key={`${field.id}-opt-${optIndex}`}
              className="flex items-center gap-2 my-1">
              <input
                type="text"
                value={opt}
                onChange={e => {
                  const updatedOptions = [...field.options!]
                  updatedOptions[optIndex] = e.target.value
                  onUpdate({ ...field, options: updatedOptions }, index)
                }}
                className="border px-2 py-1 w-full rounded"/>
              <button
                className="text-sm px-3 py-2 rounded-xl text-[#B00020] border border-[#B00020]/30 hover:bg-[#B00020]/10 transition"
                onClick={() => {
                  const updatedOptions = [...field.options!]
                  updatedOptions.splice(optIndex, 1)
                  onUpdate({ ...field, options: updatedOptions }, index)
                }}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            className="mt-2"
            onClick={() =>
              onUpdate({
                ...field,
                options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`]
              }, index)
            }>
            ➕ Add Option
          </button>
        </>
      )}
    </div>
  )
}

export default FieldEditor
