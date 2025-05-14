// client/src/mocks/mockData.js
export const mockResponses = {
  brachycephalic: {
    conditions: ['pug', 'snore', 'flat face', 'heat'],
    response: {
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
    }
  },
    persian: {
      conditions: ['persian'],
      response: {
        plan: 'S4',
        reasons: [
          "Persian cats are prone to several chronic conditions like PKD and breathing issues.",
          "S4 offers comprehensive coverage including chronic and hereditary conditions.",
          "Includes specialist referrals often needed for Persians."
        ],
        objections: {
          lowerTier: [
            "Lower-tier plans may not fully cover hereditary conditions like PKD.",
            "Dental and chronic condition limits are restricted in S1–S3."
          ],
          higherTier: [
            "You're already at the top-tier — great choice for high-risk breeds!"
          ]
        }
      }
    }
  };
  
  export const fallbackRecommendation = {
    plan: 'S2',
    reasons: [
      "We were unable to retrieve a tailored recommendation, so we've selected a balanced option.",
      "Plan S2 provides moderate coverage for accidents, illness, and dental needs."
    ],
    objections: {
      lowerTier: ["S1 may have lower limits and may not include dental coverage."],
      higherTier: ["S3 and S4 offer more comprehensive benefits."]
    }
  };