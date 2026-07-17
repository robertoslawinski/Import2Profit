import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import { roundMoney } from "../utils/calculations.js";

const stockStatuses = ["ordered", "in_transit", "received", "listed"];

export async function getDashboard(req, res, next) {
  try {
    const [products, sales] = await Promise.all([
      Product.find({ user: req.user._id }),
      Sale.find({ user: req.user._id }).populate("product")
    ]);

    const totalInvested = roundMoney(products.reduce((sum, product) => sum + product.totalCost, 0));
    const totalStockValue = roundMoney(products.filter((product) => stockStatuses.includes(product.status)).reduce((sum, product) => sum + product.totalCost, 0));
    const totalSales = roundMoney(sales.reduce((sum, sale) => sum + sale.salePrice, 0));
    const grossProfit = roundMoney(products.reduce((sum, product) => sum + product.realProfit, 0));
    const netProfit = roundMoney(sales.reduce((sum, sale) => sum + sale.netProfit, 0));
    const averageProfitMargin = products.length
      ? roundMoney(products.reduce((sum, product) => sum + product.profitMarginPercentage, 0) / products.length)
      : 0;

    const statusCounts = products.reduce((acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {});

    const marketplaceTotals = sales.reduce((acc, sale) => {
      acc[sale.marketplace] = (acc[sale.marketplace] || 0) + sale.netProfit;
      return acc;
    }, {});

    const bestPerformingMarketplace = Object.entries(marketplaceTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "Sem vendas";

    const monthlyProfitSummary = sales.reduce((acc, sale) => {
      const key = sale.saleDate.toISOString().slice(0, 7);
      acc[key] = roundMoney((acc[key] || 0) + sale.netProfit);
      return acc;
    }, {});

    res.json({
      totalInvested,
      totalStockValue,
      totalSales,
      grossProfit,
      netProfit,
      averageProfitMargin,
      statusCounts,
      bestPerformingMarketplace,
      monthlyProfitSummary: Object.entries(monthlyProfitSummary).map(([month, profit]) => ({ month, profit }))
    });
  } catch (error) {
    next(error);
  }
}
