import Setting from "../models/Setting.js";
import User from "../models/User.js";

export async function getSettings(req, res, next) {
  try {
    const settings = await Setting.findOneAndUpdate(
      { user: req.user._id },
      { $setOnInsert: { user: req.user._id } },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const settings = await Setting.findOneAndUpdate({ user: req.user._id }, req.body, {
      new: true,
      upsert: true,
      runValidators: true
    });
    await User.findByIdAndUpdate(req.user._id, {
      desiredProfitMargin: settings.desiredProfitMargin,
      preferredCurrency: settings.defaultCurrency,
      onboardingCompleted: req.body.onboardingCompleted ?? req.user.onboardingCompleted
    });
    res.json(settings);
  } catch (error) {
    next(error);
  }
}
