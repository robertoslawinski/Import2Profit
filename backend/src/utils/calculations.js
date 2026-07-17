export function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function roundMoney(value) {
  return Math.round(toNumber(value) * 100) / 100;
}

export function calculateProductMetrics(input = {}, desiredMargin = 35) {
  const acquisitionCost = toNumber(input.acquisitionCost);
  const internationalShippingCost = toNumber(input.internationalShippingCost);
  const customsDuties = toNumber(input.customsDuties);
  const vatTaxes = toNumber(input.vatTaxes);
  const marketplaceFees = toNumber(input.marketplaceFees);
  const packagingCost = toNumber(input.packagingCost);
  const otherCosts = toNumber(input.otherCosts);
  const listingPrice = toNumber(input.listingPrice);
  const finalSellingPrice = toNumber(input.finalSellingPrice);

  const totalCost = roundMoney(
    acquisitionCost +
      internationalShippingCost +
      customsDuties +
      vatTaxes +
      marketplaceFees +
      packagingCost +
      otherCosts
  );

  const estimatedProfit = roundMoney(listingPrice - totalCost);
  const realProfit = finalSellingPrice ? roundMoney(finalSellingPrice - totalCost) : 0;
  const profitBase = finalSellingPrice ? realProfit : estimatedProfit;
  const profitMarginPercentage = totalCost > 0 ? roundMoney((profitBase / totalCost) * 100) : 0;
  const breakEvenPrice = totalCost;
  const suggestedResalePrice = roundMoney(totalCost * (1 + toNumber(desiredMargin) / 100));
  const roi = totalCost > 0 ? roundMoney((profitBase / totalCost) * 100) : 0;

  return {
    totalCost,
    estimatedProfit,
    realProfit,
    profitMarginPercentage,
    breakEvenPrice,
    suggestedResalePrice,
    roi
  };
}

export function distributeOrderCosts(products, totalShippingCost = 0, customsTaxCost = 0) {
  const safeProducts = products || [];
  const totalAcquisition = safeProducts.reduce((sum, item) => sum + toNumber(item.acquisitionCost), 0);
  const equalShare = safeProducts.length ? 1 / safeProducts.length : 0;

  return safeProducts.map((item) => {
    const weight = totalAcquisition > 0 ? toNumber(item.acquisitionCost) / totalAcquisition : equalShare;
    return {
      product: item.product || item._id,
      allocatedShippingCost: roundMoney(toNumber(totalShippingCost) * weight),
      allocatedCustomsTaxCost: roundMoney(toNumber(customsTaxCost) * weight)
    };
  });
}
