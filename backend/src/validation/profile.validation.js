import Joi from "joi";

export const validateUpdateProfile = (data, role) => {
  let schema;

  switch (role) {
    case "driver":
      schema = Joi.object({
        firstName: Joi.string().trim().max(191).optional(),
        surname: Joi.string().trim().max(191).optional(),
        email: Joi.string().trim().email().optional(),
        phoneNumber: Joi.string()
          .pattern(/^\+?[1-9]\d{1,14}$/)
          .optional()
          .messages({ "string.pattern.base": "Invalid phone number format" }),
        licenseNumber: Joi.string()
          .pattern(/^[A-Z0-9-]{5,20}$/i)
          .max(191)
          .optional(),
        municipality: Joi.string().trim().max(191).optional(),
        vehicleRegistration: Joi.string().trim().max(191).optional().allow(""),
        validUntil: Joi.date()
          .greater("now")
          .optional()
          .messages({ "date.greater": "validUntil must be a future date" }),
      }).unknown(false);
      break;

    case "owner":
      schema = Joi.object({
        firstName: Joi.string().trim().max(191).optional(),
        surname: Joi.string().trim().max(191).optional(),
        email: Joi.string().trim().email().optional(),
        companyName: Joi.string().trim().max(191).optional(),
        correspondedMe: Joi.string().trim().max(191).optional(),
        phoneNumber: Joi.string()
          .pattern(/^\+?[1-9]\d{1,14}$/)
          .optional()
          .messages({ "string.pattern.base": "Invalid phone number format" }),
      }).unknown(false);
      break;

    case "superadmin":
      schema = Joi.object({
        firstName: Joi.string().trim().max(191).optional(),
        surname: Joi.string().trim().max(191).optional(),
        email: Joi.string().trim().email().optional(),
        phoneNumber: Joi.string()
          .pattern(/^\+?[1-9]\d{1,14}$/)
          .optional()
          .messages({ "string.pattern.base": "Invalid phone number format" }),
      }).unknown(false);
      break;

    default:
      schema = Joi.object({}).unknown(false);
  }

  return schema.validate(data, { abortEarly: false });
};

// Change password validation
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
}).unknown(false);

export const validateChangePassword = (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};