import React, { useState } from 'react'
import { MessageSquare, Mic, Image } from 'lucide-react'
import TextInput from '../components/TextInput'
import VoiceInput from '../components/VoiceInput'
import ImageInput from '../components/ImageInput'

function HomePage({ onNavigate }) {
  const [inputMethod, setInputMethod] = useState('text')

  const inputMethods = [
    { id: 'text', label: 'Text Input', icon: MessageSquare, description: 'Type or paste your decision' },
    { id: 'voice', label: 'Voice Input', icon: Mic, description: 'Speak your decision aloud' },
    { id: 'image', label: 'Image Input', icon: Image, description: 'Upload an image with text' }
  ]

  const renderInputComponent = () => {
    switch (inputMethod) {
      case 'text':
        return <TextInput onNavigate={onNavigate} />
      case 'voice':
        return <VoiceInput onNavigate={onNavigate} />
      case 'image':
        return <ImageInput onNavigate={onNavigate} />
      default:
        return <TextInput onNavigate={onNavigate} />
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
          Log Your Decisions
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Quickly capture and synchronize important work decisions across your tools with AI-powered extraction
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Choose Your Input Method
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {inputMethods.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setInputMethod(id)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group ${
                inputMethod === id
                  ? 'border-primary-500 bg-primary-50 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
              }`}
            >
              <div className={`p-3 rounded-lg inline-block mb-3 ${
                inputMethod === id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{label}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </button>
          ))}
        </div>

        <div className="animate-slide-up">
          {renderInputComponent()}
        </div>
      </div>
    </div>
  )
}

export default HomePage