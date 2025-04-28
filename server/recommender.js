function recommend(petInput) {
    petInput = petInput.toLowerCase();
  
    if (petInput.includes('golden retriever')) {
      return {
        plan: 'S2',
        reasons: [
          "Golden Retrievers are prone to hip dysplasia, a common issue that requires stronger coverage.",
          "Plan S2 covers up to $2,500 per illness or accident per year, which may be necessary for active breeds.",
          "Dental coverage is higher and fits well with breed-specific needs."
        ]
      };
    }
  
    if (petInput.includes('persian cat')) {
      return {
        plan: 'S2',
        reasons: [
          "Persian cats often have respiratory and kidney problems.",
          "Plan S2 gives more coverage ($2,500) and better dental care than S1.",
          "It balances cost and protection, making it ideal for Persian cats."
        ]
      };
    }
  
    return {
      plan: 'S1',
      reasons: [
        "Basic coverage selected by default due to limited input.",
        "Please provide breed, age, and location for better recommendations."
      ]
    };
  }
  
  module.exports = recommend;
  