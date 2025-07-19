import React from 'react'
import { DecisionProvider } from './context/DecisionContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ConfirmationPage from './pages/ConfirmationPage'
import HistoryPage from './pages/HistoryPage'

function App() {
  const [currentPage, setCurrentPage] = React.useState('home')
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'confirmation':
        return <ConfirmationPage onNavigate={setCurrentPage} />
      case 'history':
        return <HistoryPage onNavigate={setCurrentPage} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <DecisionProvider>
      <div className="min-h-screen">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="container mx-auto px-4 py-8">
          {renderPage()}
        </main>
      </div>
    </DecisionProvider>
  )
}

export default App