import { Volume2, ThumbsUp } from 'lucide-react';
import React from 'react';
import './RecommendationBox.css'; // if you're using CSS for styling

function RecommendationBox({
  recommendation,
  selectedPlan,
  dogPlans,
  onPlanChange,
  speakText,
  isSpeaking,
  errorMessage
}) {
  if (!recommendation) return null;

  const fullText = recommendation.reasons.join(' ');
  const objections = selectedPlan < recommendation.plan
    ? recommendation.objections?.lowerTier
    : recommendation.objections?.higherTier;
  const objectionText = objections?.join(' ');

  return (
    <div className="recommendation-box">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <h2>Based on your pet's profile, here's what we found:</h2>
      <ul className="typing-effect">
        {recommendation.reasons.map((r, i) => <li key={i}>{r}</li>)}
      </ul>

      <div className="icon-row">
        <Volume2 size={20} className="icon-button" onClick={() => speakText(fullText)} title={isSpeaking ? 'Stop reading' : 'Hear recommendation'} />
        <ThumbsUp size={20} className="icon-button" />
      </div>

      <h3>Recommended Plan: {recommendation.plan}</h3>

      <label style={{ display: 'block', marginBottom: '12px' }}>
        Want to try another tier?
        <select value={selectedPlan} onChange={e => onPlanChange(e.target.value)} style={{ marginLeft: '10px' }}>
          {dogPlans.map(p => (
            <option key={p.id} value={p.id}>{p.id}</option>
          ))}
        </select>
      </label>

      <div style={{ overflowX: 'auto', padding: '0 10px' }}>
        <table className="plans-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', border: '1px solid #ccc' }}>
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
              <tr key={plan.id} className={plan.id === selectedPlan ? 'highlight' : ''}>
                <td>{plan.id}</td>
                <td>{plan.price}</td>
                <td>{plan.accident}</td>
                <td>{plan.illness}</td>
                <td>{plan.dental}</td>
                <td>{plan.wellness || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPlan !== recommendation.plan && (
        <div className="objection-box">
          {selectedPlan < recommendation.plan ? (
            <>
              <strong>⚠️ You selected {selectedPlan}, which may not cover key issues. Consider upgrading to {recommendation.plan}.</strong>
              <ul className="typing-effect">
                {recommendation.objections?.lowerTier?.map((obj, idx) => <li key={idx}>{obj}</li>)}
              </ul>
              <Volume2 size={20} className="icon-button" onClick={() => speakText(recommendation.objections?.lowerTier?.join(' '))} title="Hear objections" />
            </>
          ) : (
            <>
              <strong>🎉 You selected {selectedPlan}, which exceeds our recommendation!</strong>
              <ul className="typing-effect">
                {recommendation.objections?.higherTier?.map((obj, idx) => <li key={idx}>{obj}</li>)}
              </ul>
              <Volume2 size={20} className="icon-button" onClick={() => speakText(recommendation.objections?.higherTier?.join(' '))} title="Hear objections" />
            </>
          )}
        </div>
      )}
      <button className="purchase-button">Continue to purchase {selectedPlan}</button>
    </div>
  );
}

export default RecommendationBox; // Correct export
