export function formatCurrency(value, currency = "EUR") {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency }).format(Number(value || 0));
}

export function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export function calculateProductMetrics(product = {}, desiredMargin = 35) {
  const totalCost = [
    "acquisitionCost",
    "internationalShippingCost",
    "customsDuties",
    "vatTaxes",
    "marketplaceFees",
    "packagingCost",
    "otherCosts"
  ].reduce((sum, key) => sum + Number(product[key] || 0), 0);
  const estimatedProfit = Number(product.listingPrice || 0) - totalCost;
  const realProfit = Number(product.finalSellingPrice || 0) ? Number(product.finalSellingPrice || 0) - totalCost : 0;
  const profit = realProfit || estimatedProfit;

  return {
    totalCost,
    estimatedProfit,
    realProfit,
    profitMarginPercentage: totalCost > 0 ? (profit / totalCost) * 100 : 0,
    breakEvenPrice: totalCost,
    suggestedResalePrice: totalCost * (1 + Number(desiredMargin || 0) / 100),
    roi: totalCost > 0 ? (profit / totalCost) * 100 : 0
  };
}
