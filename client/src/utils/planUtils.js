// src/utils/planUtils.js
export const planOrder = { S1: 1, S2: 2, S3: 3, S4: 4 };

export const isLowerTier = (selected, recommended) => {
  return planOrder[selected] < planOrder[recommended];
};