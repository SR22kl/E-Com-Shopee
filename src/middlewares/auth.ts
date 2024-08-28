import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// Middleware to make sure that only admin is allowed.
export const andminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Hey fuckface don't forget to login first", 401));

  const user = await User.findById(id);
  if (!user)
    return next(new ErrorHandler("Hey asshole don't login with fake id", 404));

  if (user.role !== "admin")
    return next(
      new ErrorHandler("Hey retard you ain't admin so get lost", 403)
    );

  next();
});
