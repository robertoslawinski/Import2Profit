import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Setting from "../models/Setting.js";

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    preferredCurrency: user.preferredCurrency,
    desiredProfitMargin: user.desiredProfitMargin,
    onboardingCompleted: user.onboardingCompleted
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password });
    await Setting.create({ user: user._id });

    res.status(201).json({ token: createToken(user._id), user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: createToken(user._id), user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res) {
  res.json({ user: sanitizeUser(req.user) });
}
