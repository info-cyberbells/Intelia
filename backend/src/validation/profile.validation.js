import Joi from "joi";

export const validateUpdateProfile = (data, role) => {
  let schema;

  switch (role) {
    case "driver":
      schema = Joi.object({
        firstName: Joi.string().trim().max(191).required(),
        surname: Joi.string().trim().max(191).required(),
        phoneNumber: Joi.string()
          .pattern(/^\+?[1-9]\d{1,14}$/)
          .required()
          .messages({ "string.pattern.base": "Invalid phone number format" }),
        licenseNumber: Joi.string()
          .pattern(/^[A-Z0-9-]{5,20}$/i)
          .max(191)
          .required(),
        municipality: Joi.string().trim().max(191).required(),
        vehicleRegistration: Joi.string().trim().max(191).required(),
        validUntil: Joi.date()
          .greater("now")
          .required()
          .messages({ "date.greater": "validUntil must be a future date" }),
      }).unknown(false);
      break;

    case "owner":
      schema = Joi.object({
        firstName: Joi.string().trim().max(191).required(),
        surname: Joi.string().trim().max(191).required(),
        companyName: Joi.string().trim().max(191).required(),
        correspondedMe: Joi.string().trim().max(191).required(),
        phoneNumber: Joi.string()
          .pattern(/^\+?[1-9]\d{1,14}$/)
          .required()
          .messages({ "string.pattern.base": "Invalid phone number format" }),
      }).unknown(false);
      break;

    case "superadmin":
      schema = Joi.object({
        firstName: Joi.string().trim().max(191).optional(),
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