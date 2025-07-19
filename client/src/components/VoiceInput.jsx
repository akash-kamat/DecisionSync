import React, { useState, useRef } from 'react'
import { Mic, MicOff, Send, Loader2 } from 'lucide-react'
import { useDecision } from '../context/DecisionContext'
import { parseDecision } from '../services/api'

function VoiceInput({ onNavigate }) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const { setCurrentDecision, setLoading, setError, loading } = useDecision()
  const recognitionRef = useRef(null)

  React.useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false)
    }
  }, [])

  const startRecording = () => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onstart = () => {
      setIsRecording(true)
    }

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript + ' ')
      }
    }

    recognitionRef.current.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`)
      setIsRecording(false)
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!transcript.trim()) return

    setLoading(true)
    setError(null)

    try {
      const parsedDecision = await parseDecision(transcript)
      setCurrentDecision(parsedDecision)
      onNavigate('confirmation')
    } catch (error) {
      setError(error.message || 'Failed to parse decision')
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center py-8">
        <MicOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Speech recognition is not supported in your browser.</p>
        <p className="text-sm text-gray-500 mt-2">Please try using Chrome or Edge.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
          className={`p-6 rounded-full transition-all duration-200 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse-slow'
              : 'bg-primary-500 hover:bg-primary-600'
          } text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>
        <p className="mt-4 text-gray-600">
          {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
        </p>
      </div>

      {transcript && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="Your speech will appear here..."
          />
        </div>
      )}

      {transcript && (
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

export default VoiceInput