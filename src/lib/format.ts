export function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatWeight(value: number) {
  return `${value.toFixed(1)} lb`;
}

export function formatSignedWeight(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} lb`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
