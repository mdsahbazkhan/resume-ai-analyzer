import { useRef, useState } from 'react'
import { UploadCloudIcon, FileTextIcon, XCircleIcon } from './icons'

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileDropzone({ file, onFileChange }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) onFileChange(dropped)
  }

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
          <FileTextIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-200">{file.name}</p>
          <p className="text-xs text-neutral-500">{formatBytes(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={() => onFileChange(null)}
          className="shrink-0 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
          aria-label="Remove file"
        >
          <XCircleIcon className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
        px-4 py-8 text-center transition-colors
        ${isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-neutral-700 hover:border-neutral-600 bg-neutral-950'}`}
    >
      <div className="grid h-11 w-11 place-items-center rounded-full bg-neutral-800 text-neutral-400">
        <UploadCloudIcon className="h-5 w-5" />
      </div>
      <p className="text-sm text-neutral-300">
        <span className="font-medium text-indigo-400">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-neutral-500">PDF only, up to 5MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => onFileChange(e.target.files[0] ?? null)}
        className="hidden"
      />
    </div>
  )
}

export default FileDropzone
