import React, { useState } from 'react'
import { Upload, Image as ImageIcon, Send, Loader2, X } from 'lucide-react'
import { useDecision } from '../context/DecisionContext'
import { processOCR, parseDecision } from '../services/api'

function ImageInput({ onNavigate }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { setCurrentDecision, setLoading, setError, loading } = useDecision()

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const processImage = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      const text = await processOCR(selectedFile)
      setExtractedText(text)
    } catch (error) {
      setError(error.message || 'Failed to process image')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!extractedText.trim()) return

    setLoading(true)
    setError(null)

    try {
      const parsedDecision = await parseDecision(extractedText)
      setCurrentDecision(parsedDecision)
      onNavigate('confirmation')
    } catch (error) {
      setError(error.message || 'Failed to parse decision')
    }
  }

  const clearImage = () => {
    setSelectedFile(null)
    setPreview(null)
    setExtractedText('')
  }

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors duration-200 cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Upload an image or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!extractedText && (
            <button
              onClick={processImage}
              disabled={isProcessing}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Extracting Text...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Extract Text from Image
                </>
              )}
            </button>
          )}
        </div>
      )}

      {extractedText && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extracted Text
          </label>
          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="Extracted text will appear here..."
          />
        </div>
      )}

      {extractedText && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Parse Decision
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default ImageInput