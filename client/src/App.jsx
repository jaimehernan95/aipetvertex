import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { dogPlans } from './data/plans';
import { Loader2 } from 'lucide-react';
import RecommendationBox from './components/RecommendationBox';

const QUESTIONS = [
  'Is your pet primarily indoor or outdoor?',
  'Does your pet have any health issues? (e.g., snores, heat sensitivity)',
  'Do you visit the vet at least once per year for routine care?'
];

const CLIENT_FALLBACK = {
  plan: 'S2',
  reasons: ["Technical difficulties - using safe recommendation"],
  objections: {
    lowerTier: ["Consider upgrading for better coverage"],
    higherTier: ["You're already at the top tier"]
  }
};

function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatRef = useRef(null);
  const speechRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Scroll handling
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatRef.current) {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    if (isFetching || answers.length > 0 || recommendation) {
      scrollToBottom();
    }
  }, [answers, recommendation, isFetching]);

  const speakText = (text) => {
    if (!speechRef.current) return;
    speechRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  const handleNext = async () => {
    if (!input.trim()) return;
    const updatedAnswers = [...answers, input.trim()];
    setAnswers(updatedAnswers);
    setInput('');

    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      setIsFetching(true);
      setErrorMessage('');

      // Artificial delay to show animation
    const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const [mockResponse] = await Promise.all([
          import('./mocks/mockData'),
          minDelay
        ]);
  
        const normalized = updatedAnswers.join(' | ').toLowerCase();
        
        const override = Object.values(mockResponse.mockResponses).find(override => 
          override.conditions.some(term => normalized.includes(term))
        );

        if (override) {
          setRecommendation(override.response);
          setSelectedPlan(override.response.plan);
        } else {
          setRecommendation(mockResponse.fallbackRecommendation);
          setSelectedPlan(mockResponse.fallbackRecommendation.plan);
        }
      } catch (error) {
        setErrorMessage("Service temporarily unavailable");
        setRecommendation(CLIENT_FALLBACK);
        setSelectedPlan(CLIENT_FALLBACK.plan);
      } finally {
        setIsFetching(false);
      }
    }
  };

  return (
    <main className="app-container">
      <header className="app-header">
        <h1 className="app-title">PetSecure AI Assistant</h1>
        <p className="app-subtitle">
          Get personalized pet insurance recommendations through our AI analysis
        </p>
      </header>

      <div ref={chatRef} className="chat-box">
  {answers.map((answer, index) => (
    <div key={`user-${index}`} className="chat-message user">
      <div className="message-content">
        <p className="question-text">{QUESTIONS[index]}</p>
        <p className="answer-text">{answer}</p>
      </div>
    </div>
  ))}

    {/* Show thinking animation immediately after last user message */}
    {isFetching && (
  <div className="chat-message ai typing">
    <div className="thinking-container">
      <div className="neural-pulse">
        <div className="node"></div>
        <div className="node"></div>
        <div className="node"></div>
      </div>
      <div className="thinking-status">
        <span className="processing-text">Analyzing responses</span>
        <div className="activity-track">
          <div className="wave"></div>
        </div>
      </div>
    </div>
  </div>
)}

  {/* Current question (only if not fetching) */}
  {!recommendation && !isFetching && (
    <div className="chat-message ai">
      <div className="message-content">
        <p>{QUESTIONS[step]}</p>
      </div>
    </div>
  )}

      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          disabled={isFetching || !!recommendation}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          placeholder={recommendation ? 'Session completed' : 'Type your answer...'}
          aria-label="Pet information input"
        />
        <button
          onClick={handleNext}
          disabled={isFetching || !!recommendation}
          className="submit-button"
        >
          {isFetching ? (
            <>
              <Loader2 className="spin-icon" />
              <span className="sr-only">Processing...</span>
            </>
          ) : 'Send'}
        </button>
      </div>

      {recommendation && (
        <RecommendationBox
          recommendation={recommendation}
          selectedPlan={selectedPlan}
          dogPlans={dogPlans}
          onPlanChange={setSelectedPlan}
          speakText={speakText}
          isSpeaking={isSpeaking}
          setIsSpeaking={setIsSpeaking}
          errorMessage={errorMessage}
        />
      )}
    </main>
  );
}

export default App;