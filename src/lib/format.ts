export function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatWeightValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatWeight(value: number) {
  return `${formatWeightValue(value)} lb`;
}

export function formatSignedWeight(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatWeightValue(value)} lb`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
