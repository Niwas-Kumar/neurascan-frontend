import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { studentAPI } from '../../services/api'
import toast from 'react-hot-toast'

const COLORS = { sidebar: '#312E81', primary: '#14B8A6', primaryDark: '#0D9488' }

export default function BulkImportPage() {
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected && (selected.type === 'text/csv' || selected.name.endsWith('.csv'))) {
      setFile(selected)
      setResult(null)
    } else {
      toast.error('Please select a CSV file')
    }
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    try {
      const res = await studentAPI.importCsv(file)
      setResult(res.data.data)
      toast.success(`Imported ${res.data.data.imported} students`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Import failed'
      toast.error(msg)
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csv = 'name,rollNumber,className,section,age,gender,dateOfBirth\nJohn Doe,101,10A,A,15,Male,2009-03-15\nJane Smith,102,10A,A,15,Female,2009-07-22'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.sidebar, marginBottom: '1.5rem' }}>
        Bulk Import Students
      </h1>

      <div style={{
        background: 'white', borderRadius: '1rem', padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px',
      }}>
        <button onClick={downloadTemplate} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'none', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
          padding: '0.5rem 1rem', color: '#6366F1', cursor: 'pointer', marginBottom: '1.5rem',
          fontSize: '0.85rem',
        }}>
          <Download size={16} /> Download CSV Template
        </button>

        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const dropped = e.dataTransfer.files[0]
            if (dropped?.name.endsWith('.csv')) { setFile(dropped); setResult(null) }
          }}
          style={{
            border: '2px dashed #CBD5E1', borderRadius: '0.75rem', padding: '2rem',
            textAlign: 'center', cursor: 'pointer', marginBottom: '1.5rem',
            background: file ? '#F0FDF4' : '#F8FAFC',
          }}
        >
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
          {file ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="#10B981" />
              <span style={{ color: '#10B981', fontWeight: 600 }}>{file.name}</span>
              <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          ) : (
            <>
              <Upload size={32} color="#94A3B8" />
              <p style={{ color: '#64748B', marginTop: '0.5rem' }}>
                Drag & drop a CSV file here, or click to browse
              </p>
            </>
          )}
        </div>

        <button
          onClick={handleImport}
          disabled={!file || importing}
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none',
            background: !file || importing ? '#CBD5E1' : COLORS.primary,
            color: 'white', fontWeight: 600, cursor: !file || importing ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
          }}
        >
          {importing ? 'Importing...' : 'Import Students'}
        </button>

        {result && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem',
              color: '#10B981', fontWeight: 600,
            }}>
              <CheckCircle size={18} />
              {result.imported} students imported successfully
            </div>
            <div style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Total rows processed: {result.totalProcessed}
            </div>
            {result.errors?.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ color: '#EF4444', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertCircle size={14} /> {result.errors.length} errors:
                </div>
                <div style={{ maxHeight: '150px', overflow: 'auto', fontSize: '0.8rem', color: '#64748B' }}>
                  {result.errors.map((e, i) => (
                    <div key={i}>Row {e.row}: {e.error}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
