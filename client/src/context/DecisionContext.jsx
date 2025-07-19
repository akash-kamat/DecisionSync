import React, { createContext, useContext, useReducer } from 'react'

const DecisionContext = createContext()

const initialState = {
  currentDecision: null,
  decisions: [],
  loading: false,
  error: null
}

function decisionReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CURRENT_DECISION':
      return { ...state, currentDecision: action.payload, loading: false }
    case 'ADD_DECISION':
      return { 
        ...state, 
        decisions: [action.payload, ...state.decisions],
        currentDecision: null
      }
    case 'CLEAR_CURRENT_DECISION':
      return { ...state, currentDecision: null }
    default:
      return state
  }
}

export function DecisionProvider({ children }) {
  const [state, dispatch] = useReducer(decisionReducer, initialState)

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const setCurrentDecision = (decision) => {
    dispatch({ type: 'SET_CURRENT_DECISION', payload: decision })
  }

  const addDecision = (decision) => {
    dispatch({ type: 'ADD_DECISION', payload: { ...decision, id: Date.now(), timestamp: new Date().toISOString() } })
  }

  const clearCurrentDecision = () => {
    dispatch({ type: 'CLEAR_CURRENT_DECISION' })
  }

  return (
    <DecisionContext.Provider value={{
      ...state,
      setLoading,
      setError,
      setCurrentDecision,
      addDecision,
      clearCurrentDecision
    }}>
      {children}
    </DecisionContext.Provider>
  )
}

export function useDecision() {
  const context = useContext(DecisionContext)
  if (!context) {
    throw new Error('useDecision must be used within a DecisionProvider')
  }
  return context
}