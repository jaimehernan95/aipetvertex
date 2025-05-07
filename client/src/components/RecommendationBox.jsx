import { Volume2, ThumbsUp } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { formatTextForSpeech } from '../utils/speechHelpers';

function RecommendationBox({
  recommendation,
  selectedPlan,
  dogPlans,
  onPlanChange,
  speakText,
  isSpeaking,
  errorMessage,
  setIsSpeaking
}) {
  const [displayedReasons, setDisplayedReasons] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const animationRef = useRef(null);
  const currentIndexRef = useRef(0);
  const currentCharIndexRef = useRef(0);

  // Typing animation effect
  useEffect(() => {
    if (!recommendation?.reasons) return;

    const startAnimation = () => {
      currentIndexRef.current = 0;
      currentCharIndexRef.current = 0;
      setDisplayedReasons([]);
      setCurrentText('');

      const typeNextCharacter = () => {
        if (currentIndexRef.current >= recommendation.reasons.length) return;

        const currentReason = recommendation.reasons[currentIndexRef.current];
        
        if (currentCharIndexRef.current < currentReason.length) {
          setCurrentText(prev => prev + currentReason[currentCharIndexRef.current]);
          currentCharIndexRef.current++;
          animationRef.current = setTimeout(typeNextCharacter, 30);
        } else {
          setDisplayedReasons(prev => [...prev, currentReason]);
          currentIndexRef.current++;
          currentCharIndexRef.current = 0;
          setCurrentText('');
          if (currentIndexRef.current < recommendation.reasons.length) {
            animationRef.current = setTimeout(typeNextCharacter, 50);
          }
        }
      };

      clearTimeout(animationRef.current);
      typeNextCharacter();
    };

    startAnimation();
    return () => clearTimeout(animationRef.current);
  }, [recommendation]);

  const handleAudioClick = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const speechText = formatTextForSpeech(recommendation.reasons.join(' '));
      speakText(speechText);
    }
  };
  

  if (!recommendation) return null;

  return (
    <div className="recommendation-container">
    {errorMessage && (
      <div className="error-message">
        ⚠️ {errorMessage}
      </div>
    )}
    
    <div className="recommendation-header">
      <h2>
        <span className="header-icon">🐾</span>
        Personalized Recommendation for Your Pet
      </h2>
      <p className="sub-header">
        Based on your pet's profile analysis:
      </p>
    </div>
      
      <div className="typing-results">
        {displayedReasons.map((reason, i) => (
          <div key={`reason-${i}`} className="completed-reason">
            <span className="reason-number">{i + 1}.</span>
            <div className="reason-content">{reason}</div>
          </div>
        ))}
        
        {currentIndexRef.current < recommendation.reasons.length && (
          <div className="typing-reason">
            <span className="reason-number">{displayedReasons.length + 1}.</span>
            <div className="reason-content">
              {currentText}
              <span className="typing-cursor"></span>
            </div>
          </div>
        )}
      </div>

      <div className="recommendation-actions">
        <div className="action-buttons">
          <button className="icon-button" onClick={handleAudioClick}>
            <Volume2 size={18} />
            {isSpeaking ? 'Stop Reading' : 'Hear Summary'}
          </button>
          <button className="icon-button">
            <ThumbsUp size={18} />
            Save Recommendation
          </button>
        </div>

        <div className="plan-selector">
          <label>Compare plans:
            <select 
              value={selectedPlan} 
              onChange={e => onPlanChange(e.target.value)}
              className="plan-dropdown"
            >
              {dogPlans.map(p => (
                <option key={p.id} value={p.id}>{p.id}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="plan-comparison">
        <table className="modern-plan-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
              <th>Accident</th>
              <th>Illness</th>
              <th>Dental</th>
              <th>Wellness</th>
            </tr>
          </thead>
          <tbody>
            {dogPlans.map(plan => (
              <tr 
                key={plan.id} 
                className={`plan-row ${plan.id === selectedPlan ? 'selected-plan' : ''}`}
              >
                <td>{plan.id}</td>
                <td>{plan.price}</td>
                <td>{plan.accident}</td>
                <td>{plan.illness}</td>
                <td>{plan.dental}</td>
                <td>{plan.wellness || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPlan !== recommendation.plan && (
        <div className="plan-alert">
          <div className="alert-content">
            {selectedPlan < recommendation.plan ? (
              <>
                <h3>⚠️ Consider Upgrading to {recommendation.plan}</h3>
                <div className="alert-reasons">
                  {recommendation.objections?.lowerTier?.map((obj, idx) => (
                    <p key={idx}>• {obj}</p>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3>🎉 Excellent Choice with {selectedPlan}!</h3>
                <div className="alert-reasons">
                  {recommendation.objections?.higherTier?.map((obj, idx) => (
                    <p key={idx}>• {obj}</p>
                  ))}
                </div>
              </>
            )}
          </div>
          <Volume2 
            size={18} 
            className="alert-speaker" 
            onClick={() => speakText(selectedPlan < recommendation.plan 
              ? recommendation.objections?.lowerTier?.join(' ') 
              : recommendation.objections?.higherTier?.join(' ')
            )} 
          />
        </div>
      )}

      <button className="cta-button">
        Continue to Purchase {selectedPlan}
      </button>
    </div>
  );
}

export default RecommendationBox;