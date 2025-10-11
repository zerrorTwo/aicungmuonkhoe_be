export const customRoundHeight = (height: number) => {
  const fractionalPart = Number((height % 0.5).toFixed(1));

  if (fractionalPart < 0.3) {
    return Math.floor(height / 0.5) * 0.5;
  }
  return Math.ceil(height / 0.5) * 0.5;
};
