import Product from "../models/Product.js";
import Setting from "../models/Setting.js";
import { calculateProductMetrics } from "../utils/calculations.js";

function buildProductQuery(userId, query) {
  const filter = { user: userId };
  const { search, supplier, marketplace, category, status, country, minMargin, maxMargin, startDate, endDate, brand, size } = query;

  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { sku: new RegExp(search, "i") },
      { supplier: new RegExp(search, "i") }
    ];
  }
  if (supplier) filter.supplier = new RegExp(supplier, "i");
  if (marketplace) filter.listedMarketplace = marketplace;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (country) filter.supplierCountry = new RegExp(country, "i");
  if (brand) filter.brand = new RegExp(brand, "i");
  if (size) filter.size = size;
  if (minMargin || maxMargin) {
    filter.profitMarginPercentage = {};
    if (minMargin) filter.profitMarginPercentage.$gte = Number(minMargin);
    if (maxMargin) filter.profitMarginPercentage.$lte = Number(maxMargin);
  }
  if (startDate || endDate) {
    filter.purchaseDate = {};
    if (startDate) filter.purchaseDate.$gte = new Date(startDate);
    if (endDate) filter.purchaseDate.$lte = new Date(endDate);
  }

  return filter;
}

export async function listProducts(req, res, next) {
  try {
    const products = await Product.find(buildProductQuery(req.user._id, req.query)).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const settings = await Setting.findOne({ user: req.user._id });
    const product = new Product({ ...req.body, user: req.user._id });
    product.$locals.desiredProfitMargin = settings?.desiredProfitMargin;
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const previousListingPrice = product.listingPrice;
    Object.assign(product, req.body);
    if (req.body.listingPrice && Number(req.body.listingPrice) !== previousListingPrice) {
      product.priceHistory.push({ price: req.body.listingPrice, marketplace: req.body.listedMarketplace, note: "Preço atualizado" });
    }
    const settings = await Setting.findOne({ user: req.user._id });
    product.$locals.desiredProfitMargin = settings?.desiredProfitMargin;
    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
}

export async function calculateProduct(req, res, next) {
  try {
    const settings = await Setting.findOne({ user: req.user._id });
    res.json(calculateProductMetrics(req.body, settings?.desiredProfitMargin));
  } catch (error) {
    next(error);
  }
}
