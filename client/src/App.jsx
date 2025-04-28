import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:3001/recommend", {
        prompt: input
      });

      setRecommendation(res.data);
      setSelectedPlan(res.data.plan); // Auto-select recommended plan
    } catch (err) {
      console.error(err);
      setRecommendation({
        plan: null,
        reasons: [],
        error: "Could not fetch recommendation. Try again later.",
      });
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const renderObjection = () => {
    if (!recommendation || !selectedPlan) return null;

    const planOrder = { S1: 1, S2: 2, S3: 3, S4: 4 };
    if (planOrder[selectedPlan] < planOrder[recommendation.plan]) {
      return (
        <div className="objection-box">
          ⚠️ You’ve selected a lower-tier plan than recommended.
          <br />
          This may leave gaps in coverage, especially for common health
          issues. For example:
          <ul>
            {recommendation.reasons?.slice(0, 2).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app">
      <h1>Pet Insurance Plan Recommender</h1>
      <h3>Powered by AI · Type your pet's details below</h3>

      <textarea
        rows="4"
        placeholder="e.g., Golden Retriever, 3 years, male, lives in Toronto"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <button onClick={handleSubmit}>Get Recommendation</button>

      {recommendation?.plan && (
        <div className="recommendation-box">
          <h2>AI Suggests: Plan {recommendation.plan}</h2>
          <ul>
            {recommendation.reasons?.map((r, i) => (
              <li key={i}>✅ {r}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendation?.plan && (
        <div className="plan-selection">
          <h3>Select a Plan</h3>
          {["S1", "S2", "S3", "S4"].map((plan) => (
            <div key={plan}>
              <input
                type="radio"
                name="plan"
                value={plan}
                checked={selectedPlan === plan}
                onChange={() => handlePlanSelect(plan)}
              />
              <label>
                Plan {plan} {plan === recommendation.plan && "⭐ Recommended"}
              </label>
            </div>
          ))}
          {selectedPlan && (
            <div style={{ marginTop: "1rem" }}>
              <button>Purchase Now</button>
            </div>
          )}
          {renderObjection()}
        </div>
      )}
    </div>
  );
}

export default App;
