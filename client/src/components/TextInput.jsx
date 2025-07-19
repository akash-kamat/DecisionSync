import React, { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useDecision } from '../context/DecisionContext'
import { parseDecision } from '../services/api'

function TextInput({ onNavigate }) {
  const [text, setText] = useState('')
  const { setCurrentDecision, setLoading, setError, loading } = useDecision()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError(null)

    try {
      const parsedDecision = await parseDecision(text)
      setCurrentDecision(parsedDecision)
      onNavigate('confirmation')
    } catch (error) {
      setError(error.message || 'Failed to parse decision')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="decision-text" className="block text-sm font-medium text-gray-700 mb-2">
          Decision Details
        </label>
        <textarea
          id="decision-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your decision here... Include details like what was decided, who's responsible, deadlines, and any related Jira tickets."
          className="input-field h-40 resize-none"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
    </form>
  )
}

export default TextInput