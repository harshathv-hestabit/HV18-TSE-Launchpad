import Joi from 'joi';

const createUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).required(),
  lastName: Joi.string().trim().min(1).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  status: Joi.string().valid('active', 'inactive').default('active')
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1),
  lastName: Joi.string().trim().min(1),
  email: Joi.string().email().lowercase(),
  password: Joi.string().min(6),
  status: Joi.string().valid('active', 'inactive')
}).min(1);

const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  brand: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  colors: Joi.array().items(Joi.string().trim()).default([]),
  price: Joi.number().min(0).required(),
  tags: Joi.array().items(Joi.string().trim()).min(1).required(),
  status: Joi.string().valid('active', 'inactive').default('active')
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim(),
  brand: Joi.string().trim(),
  category: Joi.string().trim(),
  colors: Joi.array().items(Joi.string().trim()),
  price: Joi.number().min(0),
  tags: Joi.array().items(Joi.string().trim()),
  status: Joi.string().valid('active', 'inactive')
}).min(1);

function validate(schema) {
  return (req, res, next) => {
    const source = ['POST', 'PUT', 'PATCH'].includes(req.method)
      ? req.body
      : req.query;

    const { value, error } = schema.validate(source, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        details: error.details.map(d => d.message)
      });
    }

    req.validated = value;
    next();
  };
}

export const validateCreateUser = validate(createUserSchema);
export const validateUpdateUser = validate(updateUserSchema);

export const validateCreateProduct = validate(createProductSchema);
export const validateUpdateProduct = validate(updateProductSchema);