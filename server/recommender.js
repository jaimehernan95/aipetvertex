function recommend(petInputRaw) {
  const petInput = petInputRaw.toLowerCase();

  const isPug = petInput.includes('pug') || petInput.includes('snore') || petInput.includes('heat') || petInput.includes('flat face');

  if (isPug) {
    return {
      plan: 'S3',
      questions: [
        {
          question: "Is your pet primarily indoor or outdoor?",
          answer: "Outdoor, travels frequently."
        },
        {
          question: "Does your pet have any health issues?",
          answer: "Yes, snores and has heat sensitivity."
        },
        {
          question: "Do you visit the vet at least once per year for routine care?",
          answer: "Yes"
        }
      ],
      reasons: [
       
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
  }

  return {
    plan: 'S1',
    reasons: [
      "Basic coverage selected by default due to limited input.",
      "Please provide breed, age, and health conditions for a better recommendation."
    ]
  };
}

module.exports = recommend;
