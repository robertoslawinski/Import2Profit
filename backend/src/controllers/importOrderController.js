import ImportOrder from "../models/ImportOrder.js";
import Product from "../models/Product.js";

export async function listImportOrders(req, res, next) {
  try {
    const orders = await ImportOrder.find({ user: req.user._id }).populate("products.product").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function createImportOrder(req, res, next) {
  try {
    const order = await ImportOrder.create({ ...req.body, user: req.user._id });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function updateImportOrder(req, res, next) {
  try {
    const order = await ImportOrder.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
      new: true,
      runValidators: true
    }).populate("products.product");
    if (!order) return res.status(404).json({ message: "Import order not found" });
    res.json(order);
  } catch (error) {
    next(error);
  }
}

export async function distributeImportOrderCosts(req, res, next) {
  try {
    const order = await ImportOrder.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Import order not found" });

    const productIds = order.products.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds }, user: req.user._id });
    await order.distributeCosts(products);
    await order.save();

    for (const item of order.products) {
      const product = products.find((candidate) => candidate._id.equals(item.product));
      if (product) {
        product.internationalShippingCost = item.allocatedShippingCost;
        product.customsDuties = item.allocatedCustomsTaxCost;
        product.$locals.desiredProfitMargin = req.user.desiredProfitMargin;
        await product.save();
      }
    }

    res.json(await order.populate("products.product"));
  } catch (error) {
    next(error);
  }
}
