import React, { useState } from 'react'
import { Save, Edit3, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { useDecision } from '../context/DecisionContext'
import { logDecision } from '../services/api'

function ConfirmationPage({ onNavigate }) {
  const { currentDecision, addDecision, setLoading, setError, loading, clearCurrentDecision } = useDecision()
  const [editableDecision, setEditableDecision] = useState(currentDecision || {})
  const [isEditing, setIsEditing] = useState(false)

  React.useEffect(() => {
    if (!currentDecision) {
      onNavigate('home')
    }
  }, [currentDecision, onNavigate])

  if (!currentDecision) {
    return null
  }

  const handleFieldChange = (field, value) => {
    setEditableDecision(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleOwnersChange = (value) => {
    const owners = value.split(',').map(owner => owner.trim()).filter(Boolean)
    setEditableDecision(prev => ({
      ...prev,
      owners
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      await logDecision(editableDecision)
      addDecision(editableDecision)
      clearCurrentDecision()
      onNavigate('history')
    } catch (error) {
      setError(error.message || 'Failed to log decision')
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Input
        </button>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          {isEditing ? 'View Mode' : 'Edit Mode'}
        </button>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center mb-6">
          <CheckCircle className="w-8 h-8 text-accent-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Confirm Your Decision
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editableDecision.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="input-field"
                placeholder="Decision title"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {editableDecision.title || 'No title provided'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            {isEditing ? (
              <textarea
                value={editableDecision.summary || ''}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                className="input-field h-24 resize-none"
                placeholder="Brief summary of the decision"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {editableDecision.summary || 'No summary provided'}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner(s)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableDecision.owners?.join(', ') || ''}
                  onChange={(e) => handleOwnersChange(e.target.value)}
                  className="input-field"
                  placeholder="John Doe, Jane Smith"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {editableDecision.owners?.length > 0 
                    ? editableDecision.owners.join(', ')
                    : 'No owners specified'
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editableDecision.due_date ? editableDecision.due_date.split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('due_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="input-field"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {editableDecision.due_date 
                    ? new Date(editableDecision.due_date).toLocaleDateString()
                    : 'No due date specified'
                  }
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Jira Key
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editableDecision.related_jira_key || ''}
                onChange={(e) => handleFieldChange('related_jira_key', e.target.value)}
                className="input-field"
                placeholder="PROJ-123"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {editableDecision.related_jira_key || 'No Jira key specified'}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Logging Decision...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Log Decision
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage