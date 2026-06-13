const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['patient', 'doctor']).withMessage('Invalid role'),
  validate
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Doctor validators
const doctorValidator = [
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('treatmentType').isIn(['Allopathic', 'Homeopathic', 'Herbal']).withMessage('Valid treatment type required'),
  body('fee').isNumeric().withMessage('Fee must be a number').isFloat({ min: 0 }).withMessage('Fee cannot be negative'),
  validate
];

// Appointment validators
const appointmentValidator = [
  body('doctorId').notEmpty().withMessage('Doctor ID is required').isMongoId().withMessage('Invalid doctor ID'),
  body('clinicId').notEmpty().withMessage('Clinic ID is required').isMongoId().withMessage('Invalid clinic ID'),
  body('appointmentDate').notEmpty().withMessage('Appointment date is required').isISO8601().withMessage('Invalid date format'),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  validate
];

// Clinic validators
const clinicValidator = [
  body('clinicName').trim().notEmpty().withMessage('Clinic name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  validate
];

// Prescription validators
const prescriptionValidator = [
  body('appointmentId').notEmpty().isMongoId().withMessage('Valid appointment ID required'),
  body('diagnosis').trim().notEmpty().withMessage('Diagnosis is required'),
  body('medicines').isArray({ min: 1 }).withMessage('At least one medicine is required'),
  body('medicines.*.name').notEmpty().withMessage('Medicine name is required'),
  validate
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  doctorValidator,
  appointmentValidator,
  clinicValidator,
  prescriptionValidator
};
