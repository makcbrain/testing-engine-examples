import { useState } from 'react';
import './styles.css';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
};

type ValidationErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zipCode: '',
  country: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
};

export const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!formData.cardExpiry.trim()) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Invalid format (MM/YY)';
    }
    if (!formData.cardCvv.trim()) {
      newErrors.cardCvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
      newErrors.cardCvv = 'CVV must be 3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (validateStep3()) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="form-container" data-testid="multi-step-form">
        <div className="form-success" data-testid="form-success">
          <h2>Form Submitted Successfully!</h2>
          <p>Thank you for completing the form.</p>
          <button
            className="form-button"
            onClick={handleReset}
            data-testid="form-reset"
          >
            Submit Another Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container" data-testid="multi-step-form">
      <h2 className="form-title">Multi-Step Form</h2>

      <div className="form-progress" data-testid="form-progress">
        <div
          className={`form-progress-step ${currentStep >= 1 ? 'form-progress-step--active' : ''}`}
          data-testid="progress-step-1"
        >
          1
        </div>
        <div
          className={`form-progress-line ${currentStep >= 2 ? 'form-progress-line--active' : ''}`}
        />
        <div
          className={`form-progress-step ${currentStep >= 2 ? 'form-progress-step--active' : ''}`}
          data-testid="progress-step-2"
        >
          2
        </div>
        <div
          className={`form-progress-line ${currentStep >= 3 ? 'form-progress-line--active' : ''}`}
        />
        <div
          className={`form-progress-step ${currentStep >= 3 ? 'form-progress-step--active' : ''}`}
          data-testid="progress-step-3"
        >
          3
        </div>
      </div>

      {currentStep === 1 && (
        <div className="form-step" data-testid="form-step-1">
          <h3>Personal Information</h3>
          <div className="form-field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              data-testid="input-firstName"
            />
            {errors.firstName && (
              <span className="form-error" data-testid="error-firstName">
                {errors.firstName}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              data-testid="input-lastName"
            />
            {errors.lastName && (
              <span className="form-error" data-testid="error-lastName">
                {errors.lastName}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              data-testid="input-email"
            />
            {errors.email && (
              <span className="form-error" data-testid="error-email">
                {errors.email}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              data-testid="input-phone"
            />
            {errors.phone && (
              <span className="form-error" data-testid="error-phone">
                {errors.phone}
              </span>
            )}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="form-step" data-testid="form-step-2">
          <h3>Address Information</h3>
          <div className="form-field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              data-testid="input-address"
            />
            {errors.address && (
              <span className="form-error" data-testid="error-address">
                {errors.address}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              data-testid="input-city"
            />
            {errors.city && (
              <span className="form-error" data-testid="error-city">
                {errors.city}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="zipCode">ZIP Code</label>
            <input
              id="zipCode"
              type="text"
              value={formData.zipCode}
              onChange={(e) => updateField('zipCode', e.target.value)}
              data-testid="input-zipCode"
            />
            {errors.zipCode && (
              <span className="form-error" data-testid="error-zipCode">
                {errors.zipCode}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              value={formData.country}
              onChange={(e) => updateField('country', e.target.value)}
              data-testid="input-country"
            />
            {errors.country && (
              <span className="form-error" data-testid="error-country">
                {errors.country}
              </span>
            )}
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="form-step" data-testid="form-step-3">
          <h3>Payment Information</h3>
          <div className="form-field">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              type="text"
              value={formData.cardNumber}
              onChange={(e) => updateField('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              data-testid="input-cardNumber"
            />
            {errors.cardNumber && (
              <span className="form-error" data-testid="error-cardNumber">
                {errors.cardNumber}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="cardExpiry">Expiry Date</label>
            <input
              id="cardExpiry"
              type="text"
              value={formData.cardExpiry}
              onChange={(e) => updateField('cardExpiry', e.target.value)}
              placeholder="MM/YY"
              data-testid="input-cardExpiry"
            />
            {errors.cardExpiry && (
              <span className="form-error" data-testid="error-cardExpiry">
                {errors.cardExpiry}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="cardCvv">CVV</label>
            <input
              id="cardCvv"
              type="text"
              value={formData.cardCvv}
              onChange={(e) => updateField('cardCvv', e.target.value)}
              placeholder="123"
              data-testid="input-cardCvv"
            />
            {errors.cardCvv && (
              <span className="form-error" data-testid="error-cardCvv">
                {errors.cardCvv}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="form-actions">
        {currentStep > 1 && (
          <button
            className="form-button form-button--secondary"
            onClick={handleBack}
            data-testid="form-back"
          >
            Back
          </button>
        )}
        {currentStep < 3 && (
          <button
            className="form-button form-button--primary"
            onClick={handleNext}
            data-testid="form-next"
          >
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button
            className="form-button form-button--primary"
            onClick={handleSubmit}
            data-testid="form-submit"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};