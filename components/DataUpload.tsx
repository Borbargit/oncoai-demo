'use client'

import { useState } from 'react'
import { Upload, File, Check, AlertCircle } from 'lucide-react'

export default function DataUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      // Имитация загрузки файлов
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newFiles = Array.from(files).map(file => file.name)
      setUploadedFiles(prev => [...prev, ...newFiles])
      
      // Здесь можно добавить реальную загрузку в Supabase
      // const file = files[0]
      // const { data, error } = await supabase.storage
      //   .from('medical-data')
      //   .upload(`uploads/${file.name}`, file)
      
    } catch (err) {
      setError('Ошибка при загрузке файлов')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Загрузка данных</h2>
          <p className="text-gray-600">Загрузите медицинские данные для анализа</p>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          Перетащите файлы сюда или нажмите для выбора
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".csv,.xlsx,.json,.txt,.pdf,.dcm"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center px-6 py-3 rounded-lg font-medium cursor-pointer transition ${
            uploading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Загрузка...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Выбрать файлы
            </>
          )}
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Поддерживаемые форматы: CSV, Excel, JSON, TXT, PDF, DICOM
        </p>
      </div>

      {error && (
        <div className="flex items-center bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Загруженные файлы</h3>
          <div className="space-y-2">
            {uploadedFiles.map((fileName, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <File className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{fileName}</span>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">CSV/Excel</h4>
          <p className="text-sm text-blue-600">
            Табличные данные пациентов
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">DICOM</h4>
          <p className="text-sm text-green-600">
            Медицинские снимки
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">PDF/JSON</h4>
          <p className="text-sm text-purple-600">
            Отчеты и структурированные данные
          </p>
        </div>
      </div>
    </div>
  )
}
