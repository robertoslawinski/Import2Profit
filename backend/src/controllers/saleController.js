import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

export async function listSales(req, res, next) {
  try {
    const sales = await Sale.find({ user: req.user._id }).populate("product").sort({ saleDate: -1 });
    res.json(sales);
  } catch (error) {
    next(error);
  }
}

export async function createSale(req, res, next) {
  try {
    const product = await Product.findOne({ _id: req.body.product, user: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const sale = await Sale.create({ ...req.body, user: req.user._id });
    product.status = req.body.orderStatus === "returned" ? "returned" : "sold";
    product.finalSellingPrice = req.body.salePrice;
    product.marketplaceFees = req.body.marketplaceFee;
    product.listedMarketplace = req.body.marketplace;
    product.$locals.desiredProfitMargin = req.user.desiredProfitMargin;
    await product.save();

    res.status(201).json(await sale.populate("product"));
  } catch (error) {
    next(error);
  }
}

export async function updateSale(req, res, next) {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, user: req.user._id });
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    Object.assign(sale, req.body);
    await sale.save();
    res.json(await sale.populate("product"));
  } catch (error) {
    next(error);
  }
}
