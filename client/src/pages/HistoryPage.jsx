import React, { useState } from 'react'
import { Search, Calendar, User, ExternalLink, Filter } from 'lucide-react'
import { useDecision } from '../context/DecisionContext'

function HistoryPage() {
  const { decisions } = useDecision()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOwner, setFilterOwner] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filteredDecisions = decisions
    .filter(decision => {
      const matchesSearch = decision.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           decision.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesOwner = !filterOwner || decision.owners?.some(owner => 
        owner.toLowerCase().includes(filterOwner.toLowerCase())
      )
      return matchesSearch && matchesOwner
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp)
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp)
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        default:
          return 0
      }
    })

  const allOwners = [...new Set(decisions.flatMap(d => d.owners || []))]

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          Decision History
        </h1>
        <p className="text-xl text-gray-600">
          Track and review all your logged decisions
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search decisions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="input-field min-w-[150px]"
            >
              <option value="">All Owners</option>
              {allOwners.map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field min-w-[120px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
            </select>
          </div>
        </div>
      </div>

      {filteredDecisions.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {decisions.length === 0 ? 'No Decisions Yet' : 'No Matching Decisions'}
          </h3>
          <p className="text-gray-600">
            {decisions.length === 0 
              ? 'Start by logging your first decision!'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDecisions.map((decision) => (
            <div key={decision.id} className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {decision.title || 'Untitled Decision'}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(decision.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                {decision.summary || 'No summary available'}
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>
                    {decision.owners?.length > 0 
                      ? decision.owners.join(', ')
                      : 'No owner assigned'
                    }
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {decision.due_date 
                      ? new Date(decision.due_date).toLocaleDateString()
                      : 'No due date'
                    }
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>
                    {decision.related_jira_key || 'No Jira key'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage