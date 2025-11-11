import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().trim().max(191).required(),
  // surname: Joi.string().trim().max(191).allow(null, '').optional(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("superAdmin", "owner", "driver").default("driver"),
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid phone number format" }),

  // OWNER-specific fields
  // companyName: Joi.when("role", {
  //   is: "owner",
  //   then: Joi.string().trim().max(191).required(),
  //   otherwise: Joi.forbidden(),
  // }),
  // correspondedMe: Joi.when("role", {
  //   is: "owner",
  //   then: Joi.string().trim().max(191).required(),
  //   otherwise: Joi.forbidden(),
  // }),

  // DRIVER-specific fields
  licenseNumber: Joi.when("role", {
    is: "driver",
    then: Joi.string()
      .pattern(/^[A-Z0-9-]{5,20}$/i)
      .required()
      .messages({
        "string.pattern.base":
          "License number must be 5–20 characters (letters, numbers, or hyphens)",
      }),
    otherwise: Joi.forbidden(),
  }),
  municipality: Joi.when("role", {
    is: "driver",
    then: Joi.string().trim().max(191).required(),
    otherwise: Joi.forbidden(),
  }),
  // vehicleRegistration: Joi.when("role", {
  //   is: "driver",
  //   then: Joi.string().trim().max(191).required(),
  //   otherwise: Joi.forbidden(),
  // }),
  validUntil: Joi.when("role", {
    is: "driver",
    then: Joi.date()
      .greater("now")
      .required()
      .messages({ "date.greater": "validUntil must be a future date" }),
    otherwise: Joi.forbidden(),
  }),
}).unknown(false);


export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};
