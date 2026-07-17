import { validationResult } from "express-validator";

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  res.status(422).json({ message: "Validation failed", details: errors.array() });
}
