import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import { roundMoney } from "../utils/calculations.js";

function groupSum(items, keyGetter, valueGetter) {
  return Object.entries(
    items.reduce((acc, item) => {
      const key = keyGetter(item) || "Sem dados";
      acc[key] = roundMoney((acc[key] || 0) + valueGetter(item));
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
}

export async function getReports(req, res, next) {
  try {
    const [products, sales] = await Promise.all([
      Product.find({ user: req.user._id }),
      Sale.find({ user: req.user._id }).populate("product")
    ]);

    const monthlyProfit = groupSum(sales, (sale) => sale.saleDate.toISOString().slice(0, 7), (sale) => sale.netProfit);
    const salesByMarketplace = groupSum(sales, (sale) => sale.marketplace, (sale) => sale.salePrice);
    const mostProfitableProducts = [...products].sort((a, b) => b.realProfit - a.realProfit).slice(0, 10);
    const mostProfitableCategories = groupSum(products, (product) => product.category, (product) => product.realProfit || product.estimatedProfit);
    const bestSuppliers = groupSum(products, (product) => product.supplier, (product) => product.realProfit || product.estimatedProfit);
    const totalImportCosts = roundMoney(products.reduce((sum, product) => sum + product.acquisitionCost + product.customsDuties + product.vatTaxes, 0));
    const totalShippingCosts = roundMoney(products.reduce((sum, product) => sum + product.internationalShippingCost, 0));
    const roiByMonth = groupSum(sales, (sale) => sale.saleDate.toISOString().slice(0, 7), (sale) => sale.netProfit);
    const productsWithNegativeMargin = products.filter((product) => product.profitMarginPercentage < 0);
    const stockAging = products
      .filter((product) => product.status !== "sold")
      .map((product) => ({
        id: product._id,
        name: product.name,
        sku: product.sku,
        status: product.status,
        daysInStock: Math.floor((Date.now() - product.createdAt.getTime()) / 86400000),
        margin: product.profitMarginPercentage
      }))
      .sort((a, b) => b.daysInStock - a.daysInStock);

    res.json({
      monthlyProfit,
      salesByMarketplace,
      mostProfitableProducts,
      mostProfitableCategories,
      bestSuppliers,
      totalImportCosts,
      totalShippingCosts,
      stockAging,
      roiByMonth,
      productsWithNegativeMargin
    });
  } catch (error) {
    next(error);
  }
}
