import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { dogPlans } from '../src/data/plans.js';
import { Loader2 } from 'lucide-react';
import { Volume2, ThumbsUp } from 'lucide-react';
import RecommendationBox from '../src/components/RecommendationBox.jsx'; // Ensure this path matches your project structure

const QUESTIONS = [
  'Is your pet primarily indoor or outdoor?',
  'Does your pet have any health issues? (e.g., snores, heat sensitivity)',
  'Do you visit the vet at least once per year for routine care?'
];

function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const chatRef = useRef(null);

  const speechRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [answers, recommendation]);

  const speakText = (text) => {
    if (!speechRef.current) return;
    speechRef.current.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    speechRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  const normalizeInput = (text) => text.toLowerCase().trim();

  const fallbackRecommendation = {
    plan: 'S2',
    reasons: [
      "We were unable to retrieve a tailored recommendation, so we've selected a balanced option for most pets.",
      "Plan S2 provides moderate coverage for accidents, illness, and dental needs.",
      "It's a great middle-tier plan for most indoor pets."
    ],
    objections: {
      lowerTier: ["S1 may have lower limits and may not include dental or chronic coverage."],
      higherTier: ["S3 and S4 offer more comprehensive benefits including travel and wellness."]
    }
  };

  const handleNext = async () => {
    if (!input.trim()) return;
    const updated = [...answers, input.trim()];
    setAnswers(updated);
    setInput('');
    setErrorMessage('');

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsFetching(true);
      await new Promise(resolve => setTimeout(resolve, 900)); // Simulate delay
      const prompt = updated.join(' | ');
      const normalizedPrompt = normalizeInput(prompt);

      // Local mock overrides
      if (normalizedPrompt.includes('pug') || normalizedPrompt.includes('snore') || normalizedPrompt.includes('heat') || normalizedPrompt.includes('flat face')) {
        const mockS3Response = {
          plan: 'S3',
          reasons: [
            "Pugs are prone to breathing issues, skin infections, and obesity-related complications.",
            "Heat sensitivity and snoring suggest brachycephalic syndrome — S3 covers respiratory medication.",
            "Travel increases risk — S3 includes coverage for pet illness while away.",
            "PetSecure supports cross-border coverage (Canada/US), unlike competitors.",
            "S3 covers up to $5,000/year with $400 dental and medication benefits.",
            "Annual deductible applies once per year — competitors charge per condition."
          ],
          objections: {
            lowerTier: [
              "Lower-tier plans may not cover travel-related or chronic breathing treatments.",
              "Dental and annual coverage limits are lower in S1 and S2.",
              "Routine checkups and specialty meds may be partially or not covered."
            ],
            higherTier: [
              "S4 adds wellness and unlimited coverage — great if you want maximum protection."
            ]
          }
        };
        setRecommendation(mockS3Response);
        setSelectedPlan(mockS3Response.plan);
        setIsFetching(false);
        return;
      }

      if (normalizedPrompt.includes('persian')) {
        const mockCatResponse = {
          plan: 'S4',
          reasons: [
            "Persian cats are prone to several chronic conditions like PKD and breathing issues.",
            "S4 offers comprehensive coverage including chronic and hereditary conditions, dental, and unlimited annual coverage.",
            "Supports wellness options like regular grooming and diagnostics.",
            "Includes specialist referrals often needed for Persians."
          ],
          objections: {
            lowerTier: [
              "Lower-tier plans may not fully cover hereditary conditions like PKD.",
              "Dental and chronic condition limits are restricted in S1–S3.",
              "Routine wellness or grooming-related issues may be out-of-pocket."
            ],
            higherTier: [
              "You're already at the top-tier — great choice for high-risk breeds like Persian cats!"
            ]
          }
        };
        setRecommendation(mockCatResponse);
        setSelectedPlan(mockCatResponse.plan);
        setIsFetching(false);
        return;
      }

      // Default AI backend fetch
      try {
        const res = await fetch('http://localhost:3001/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setRecommendation(data);
        setSelectedPlan(data.plan);
      } catch (error) {
        setRecommendation(fallbackRecommendation);
        setSelectedPlan(fallbackRecommendation.plan);
        setErrorMessage("⚠️ AI is currently unavailable. Here's a default recommendation.");
      } finally {
        setIsFetching(false);
      }
    }
  };

  const renderChat = () => (
    <div ref={chatRef} className="chat-box">
      {answers.map((ans, i) => (
        <div key={i} className="chat-message user">
          <div>{QUESTIONS[i]}</div>
          <strong>{ans}</strong>
        </div>
      ))}
      {!recommendation && !isFetching && (
        <div className="chat-message ai">
          {QUESTIONS[step]}
        </div>
      )}
      {isFetching && (
        <div className="chat-message ai thinking">
          <Loader2 className="spin" size={18} style={{ marginRight: 8 }} /> Thinking...
        </div>
      )}
    </div>
  );

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>PetSecure AI Assistant</h1>
      <p className="subheading">Answer a few quick questions, and we’ll recommend the best pet insurance plan for you.</p>

      {renderChat()}

      <div className="input-box">
        <input
          type="text"
          value={input}
          disabled={isFetching || !!recommendation}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleNext()}
          placeholder={recommendation ? 'Recommendation complete' : 'Type your answer...'}
        />
        <button onClick={handleNext} disabled={isFetching || !!recommendation}>Send</button>
      </div>

      <RecommendationBox
        recommendation={recommendation}
        selectedPlan={selectedPlan}
        dogPlans={dogPlans}
        onPlanChange={(planId) => setSelectedPlan(planId)}
        speakText={speakText}
        isSpeaking={isSpeaking}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default App;
