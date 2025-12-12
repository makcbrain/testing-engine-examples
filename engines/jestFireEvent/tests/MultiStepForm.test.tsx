import { fireEvent, render, screen } from '@testing-library/react';

import { MultiStepForm } from '../../../components/MultiStepForm/MultiStepForm';

describe('MultiStepForm Component', () => {
	describe('Initial Render', () => {
		it('should render multi-step form component', () => {
			render(<MultiStepForm />);
			expect(screen.getByTestId('multi-step-form')).toBeInTheDocument();
		});

		it('should display form title', () => {
			render(<MultiStepForm />);
			expect(screen.getByText('Multi-Step Form')).toBeInTheDocument();
		});

		it('should render progress indicator', () => {
			render(<MultiStepForm />);
			expect(screen.getByTestId('form-progress')).toBeInTheDocument();
		});

		it('should show all progress steps', () => {
			render(<MultiStepForm />);
			expect(screen.getByTestId('progress-step-1')).toBeInTheDocument();
			expect(screen.getByTestId('progress-step-2')).toBeInTheDocument();
			expect(screen.getByTestId('progress-step-3')).toBeInTheDocument();
		});

		it('should start at step 1', () => {
			render(<MultiStepForm />);
			expect(screen.getByTestId('form-step-1')).toBeInTheDocument();
		});

		it('should show step 1 as active in progress indicator', () => {
			render(<MultiStepForm />);
			expect(screen.getByTestId('progress-step-1')).toHaveClass('form-progress-step--active');
		});

		it('should not show back button on first step', () => {
			render(<MultiStepForm />);
			expect(screen.queryByTestId('form-back')).not.toBeInTheDocument();
		});

		it('should show next button on first step', () => {
			render(<MultiStepForm />);
			expect(screen.getByTestId('form-next')).toBeInTheDocument();
		});
	});

	describe('Step 1 - Personal Information', () => {
		it('should render all step 1 fields', () => {
			render(<MultiStepForm />);
			expect(screen.getByTestId('input-firstName')).toBeInTheDocument();
			expect(screen.getByTestId('input-lastName')).toBeInTheDocument();
			expect(screen.getByTestId('input-email')).toBeInTheDocument();
			expect(screen.getByTestId('input-phone')).toBeInTheDocument();
		});

		it('should have correct labels for step 1 fields', () => {
			render(<MultiStepForm />);
			expect(screen.getByLabelText('First Name')).toBeInTheDocument();
			expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
			expect(screen.getByLabelText('Email')).toBeInTheDocument();
			expect(screen.getByLabelText('Phone')).toBeInTheDocument();
		});

		it('should allow input in all step 1 fields', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });

			expect(screen.getByTestId('input-firstName')).toHaveValue('John');
			expect(screen.getByTestId('input-lastName')).toHaveValue('Doe');
			expect(screen.getByTestId('input-email')).toHaveValue('john@example.com');
			expect(screen.getByTestId('input-phone')).toHaveValue('1234567890');
		});

		it('should show validation error when first name is empty', () => {
			render(<MultiStepForm />);

			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('error-firstName')).toHaveTextContent('First name is required');
		});

		it('should show validation error when last name is empty', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('error-lastName')).toHaveTextContent('Last name is required');
		});

		it('should show validation error when email is empty', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('error-email')).toHaveTextContent('Email is required');
		});

		it('should show validation error for invalid email format', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'invalid-email' } });
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('error-email')).toHaveTextContent('Invalid email format');
		});

		it('should show validation error when phone is empty', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('error-phone')).toHaveTextContent('Phone is required');
		});

		it('should clear error when user starts typing in field', () => {
			render(<MultiStepForm />);

			fireEvent.click(screen.getByTestId('form-next'));
			expect(screen.getByTestId('error-firstName')).toBeInTheDocument();

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			expect(screen.queryByTestId('error-firstName')).not.toBeInTheDocument();
		});

		it('should not proceed to step 2 if validation fails', () => {
			render(<MultiStepForm />);

			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('form-step-1')).toBeInTheDocument();
			expect(screen.queryByTestId('form-step-2')).not.toBeInTheDocument();
		});

		it('should proceed to step 2 when all fields are valid', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('form-step-2')).toBeInTheDocument();
			expect(screen.queryByTestId('form-step-1')).not.toBeInTheDocument();
		});
	});

	describe('Step 2 - Address Information', () => {
		const fillStep1 = () => {
			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));
		};

		it('should render all step 2 fields', () => {
			render(<MultiStepForm />);
			fillStep1();

			expect(screen.getByTestId('input-address')).toBeInTheDocument();
			expect(screen.getByTestId('input-city')).toBeInTheDocument();
			expect(screen.getByTestId('input-zipCode')).toBeInTheDocument();
			expect(screen.getByTestId('input-country')).toBeInTheDocument();
		});

		it('should have correct labels for step 2 fields', () => {
			render(<MultiStepForm />);
			fillStep1();

			expect(screen.getByLabelText('Address')).toBeInTheDocument();
			expect(screen.getByLabelText('City')).toBeInTheDocument();
			expect(screen.getByLabelText('ZIP Code')).toBeInTheDocument();
			expect(screen.getByLabelText('Country')).toBeInTheDocument();
		});

		it('should show back button on step 2', () => {
			render(<MultiStepForm />);
			fillStep1();

			expect(screen.getByTestId('form-back')).toBeInTheDocument();
		});

		it('should show next button on step 2', () => {
			render(<MultiStepForm />);
			fillStep1();

			expect(screen.getByTestId('form-next')).toBeInTheDocument();
		});

		it('should show step 2 as active in progress indicator', () => {
			render(<MultiStepForm />);
			fillStep1();

			expect(screen.getByTestId('progress-step-2')).toHaveClass('form-progress-step--active');
		});

		it('should allow input in all step 2 fields', () => {
			render(<MultiStepForm />);
			fillStep1();

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });

			expect(screen.getByTestId('input-address')).toHaveValue('123 Main St');
			expect(screen.getByTestId('input-city')).toHaveValue('New York');
			expect(screen.getByTestId('input-zipCode')).toHaveValue('10001');
			expect(screen.getByTestId('input-country')).toHaveValue('USA');
		});

		it('should go back to step 1 when back button clicked', () => {
			render(<MultiStepForm />);
			fillStep1();

			fireEvent.click(screen.getByTestId('form-back'));

			expect(screen.getByTestId('form-step-1')).toBeInTheDocument();
			expect(screen.queryByTestId('form-step-2')).not.toBeInTheDocument();
		});

		it('should preserve step 1 data when going back', () => {
			render(<MultiStepForm />);
			fillStep1();

			fireEvent.click(screen.getByTestId('form-back'));

			expect(screen.getByTestId('input-firstName')).toHaveValue('John');
			expect(screen.getByTestId('input-lastName')).toHaveValue('Doe');
			expect(screen.getByTestId('input-email')).toHaveValue('john@example.com');
			expect(screen.getByTestId('input-phone')).toHaveValue('1234567890');
		});

		it('should show validation error when address is empty', () => {
			render(<MultiStepForm />);
			fillStep1();

			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('error-address')).toHaveTextContent('Address is required');
		});

		it('should show validation error when city is empty', () => {
			render(<MultiStepForm />);
			fillStep1();

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('error-city')).toHaveTextContent('City is required');
		});

		it('should show validation error when zipCode is empty', () => {
			render(<MultiStepForm />);
			fillStep1();

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('error-zipCode')).toHaveTextContent('ZIP code is required');
		});

		it('should show validation error when country is empty', () => {
			render(<MultiStepForm />);
			fillStep1();

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('error-country')).toHaveTextContent('Country is required');
		});

		it('should proceed to step 3 when all fields are valid', () => {
			render(<MultiStepForm />);
			fillStep1();

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('form-step-3')).toBeInTheDocument();
			expect(screen.queryByTestId('form-step-2')).not.toBeInTheDocument();
		});
	});

	describe('Step 3 - Payment Information', () => {
		const fillStep1 = () => {
			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));
		};

		const fillStep2 = () => {
			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));
		};

		it('should render all step 3 fields', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			expect(screen.getByTestId('input-cardNumber')).toBeInTheDocument();
			expect(screen.getByTestId('input-cardExpiry')).toBeInTheDocument();
			expect(screen.getByTestId('input-cardCvv')).toBeInTheDocument();
		});

		it('should have correct labels for step 3 fields', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			expect(screen.getByLabelText('Card Number')).toBeInTheDocument();
			expect(screen.getByLabelText('Expiry Date')).toBeInTheDocument();
			expect(screen.getByLabelText('CVV')).toBeInTheDocument();
		});

		it('should show back button on step 3', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			expect(screen.getByTestId('form-back')).toBeInTheDocument();
		});

		it('should show submit button instead of next on step 3', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			expect(screen.getByTestId('form-submit')).toBeInTheDocument();
			expect(screen.queryByTestId('form-next')).not.toBeInTheDocument();
		});

		it('should show step 3 as active in progress indicator', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			expect(screen.getByTestId('progress-step-3')).toHaveClass('form-progress-step--active');
		});

		it('should allow input in all step 3 fields', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.change(screen.getByTestId('input-cardNumber'), {
				target: { value: '1234567890123456' },
			});
			fireEvent.change(screen.getByTestId('input-cardExpiry'), { target: { value: '12/25' } });
			fireEvent.change(screen.getByTestId('input-cardCvv'), { target: { value: '123' } });

			expect(screen.getByTestId('input-cardNumber')).toHaveValue('1234567890123456');
			expect(screen.getByTestId('input-cardExpiry')).toHaveValue('12/25');
			expect(screen.getByTestId('input-cardCvv')).toHaveValue('123');
		});

		it('should go back to step 2 when back button clicked', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.click(screen.getByTestId('form-back'));

			expect(screen.getByTestId('form-step-2')).toBeInTheDocument();
			expect(screen.queryByTestId('form-step-3')).not.toBeInTheDocument();
		});

		it('should preserve step 2 data when going back', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.click(screen.getByTestId('form-back'));

			expect(screen.getByTestId('input-address')).toHaveValue('123 Main St');
			expect(screen.getByTestId('input-city')).toHaveValue('New York');
			expect(screen.getByTestId('input-zipCode')).toHaveValue('10001');
			expect(screen.getByTestId('input-country')).toHaveValue('USA');
		});

		it('should show validation error when card number is empty', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.click(screen.getByTestId('form-submit'));

			expect(screen.getByTestId('error-cardNumber')).toHaveTextContent('Card number is required');
		});

		it('should show validation error for invalid card number', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.change(screen.getByTestId('input-cardNumber'), { target: { value: '123' } });
			fireEvent.click(screen.getByTestId('form-submit'));

			expect(screen.getByTestId('error-cardNumber')).toHaveTextContent(
				'Card number must be 16 digits',
			);
		});

		it('should show validation error when expiry date is empty', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.change(screen.getByTestId('input-cardNumber'), {
				target: { value: '1234567890123456' },
			});
			fireEvent.click(screen.getByTestId('form-submit'));

			expect(screen.getByTestId('error-cardExpiry')).toHaveTextContent('Expiry date is required');
		});

		it('should show validation error for invalid expiry date format', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.change(screen.getByTestId('input-cardNumber'), {
				target: { value: '1234567890123456' },
			});
			fireEvent.change(screen.getByTestId('input-cardExpiry'), { target: { value: '1234' } });
			fireEvent.click(screen.getByTestId('form-submit'));

			expect(screen.getByTestId('error-cardExpiry')).toHaveTextContent('Invalid format (MM/YY)');
		});

		it('should show validation error when CVV is empty', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.change(screen.getByTestId('input-cardNumber'), {
				target: { value: '1234567890123456' },
			});
			fireEvent.change(screen.getByTestId('input-cardExpiry'), { target: { value: '12/25' } });
			fireEvent.click(screen.getByTestId('form-submit'));

			expect(screen.getByTestId('error-cardCvv')).toHaveTextContent('CVV is required');
		});

		it('should show validation error for invalid CVV', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.change(screen.getByTestId('input-cardNumber'), {
				target: { value: '1234567890123456' },
			});
			fireEvent.change(screen.getByTestId('input-cardExpiry'), { target: { value: '12/25' } });
			fireEvent.change(screen.getByTestId('input-cardCvv'), { target: { value: '12' } });
			fireEvent.click(screen.getByTestId('form-submit'));

			expect(screen.getByTestId('error-cardCvv')).toHaveTextContent('CVV must be 3 or 4 digits');
		});

		it('should accept 4-digit CVV', () => {
			render(<MultiStepForm />);
			fillStep1();
			fillStep2();

			fireEvent.change(screen.getByTestId('input-cardNumber'), {
				target: { value: '1234567890123456' },
			});
			fireEvent.change(screen.getByTestId('input-cardExpiry'), { target: { value: '12/25' } });
			fireEvent.change(screen.getByTestId('input-cardCvv'), { target: { value: '1234' } });
			fireEvent.click(screen.getByTestId('form-submit'));

			expect(screen.getByTestId('form-success')).toBeInTheDocument();
		});
	});

	describe('Form Submission', () => {
		const fillAllSteps = () => {
			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.change(screen.getByTestId('input-cardNumber'), {
				target: { value: '1234567890123456' },
			});
			fireEvent.change(screen.getByTestId('input-cardExpiry'), { target: { value: '12/25' } });
			fireEvent.change(screen.getByTestId('input-cardCvv'), { target: { value: '123' } });
			fireEvent.click(screen.getByTestId('form-submit'));
		};

		it('should show success message after submission', () => {
			render(<MultiStepForm />);
			fillAllSteps();

			expect(screen.getByTestId('form-success')).toBeInTheDocument();
			expect(screen.getByText('Form Submitted Successfully!')).toBeInTheDocument();
			expect(screen.getByText('Thank you for completing the form.')).toBeInTheDocument();
		});

		it('should show reset button after submission', () => {
			render(<MultiStepForm />);
			fillAllSteps();

			expect(screen.getByTestId('form-reset')).toBeInTheDocument();
		});

		it('should reset form when reset button clicked', () => {
			render(<MultiStepForm />);
			fillAllSteps();

			fireEvent.click(screen.getByTestId('form-reset'));

			expect(screen.getByTestId('form-step-1')).toBeInTheDocument();
			expect(screen.queryByTestId('form-success')).not.toBeInTheDocument();
		});

		it('should clear all form data after reset', () => {
			render(<MultiStepForm />);
			fillAllSteps();

			fireEvent.click(screen.getByTestId('form-reset'));

			expect(screen.getByTestId('input-firstName')).toHaveValue('');
			expect(screen.getByTestId('input-lastName')).toHaveValue('');
			expect(screen.getByTestId('input-email')).toHaveValue('');
			expect(screen.getByTestId('input-phone')).toHaveValue('');
		});

		it('should return to step 1 after reset', () => {
			render(<MultiStepForm />);
			fillAllSteps();

			fireEvent.click(screen.getByTestId('form-reset'));

			expect(screen.getByTestId('progress-step-1')).toHaveClass('form-progress-step--active');
			expect(screen.getByTestId('progress-step-2')).not.toHaveClass('form-progress-step--active');
			expect(screen.getByTestId('progress-step-3')).not.toHaveClass('form-progress-step--active');
		});
	});

	describe('Navigation Flow', () => {
		it('should navigate forward through all steps', () => {
			render(<MultiStepForm />);

			expect(screen.getByTestId('form-step-1')).toBeInTheDocument();

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('form-step-2')).toBeInTheDocument();

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('form-step-3')).toBeInTheDocument();
		});

		it('should navigate backward through all steps', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.click(screen.getByTestId('form-back'));
			expect(screen.getByTestId('form-step-2')).toBeInTheDocument();

			fireEvent.click(screen.getByTestId('form-back'));
			expect(screen.getByTestId('form-step-1')).toBeInTheDocument();
		});

		it('should preserve data when navigating back and forth', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.click(screen.getByTestId('form-back'));
			fireEvent.click(screen.getByTestId('form-back'));

			expect(screen.getByTestId('input-firstName')).toHaveValue('John');
			expect(screen.getByTestId('input-lastName')).toHaveValue('Doe');
			expect(screen.getByTestId('input-email')).toHaveValue('john@example.com');
			expect(screen.getByTestId('input-phone')).toHaveValue('1234567890');

			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('input-address')).toHaveValue('123 Main St');
			expect(screen.getByTestId('input-city')).toHaveValue('New York');
			expect(screen.getByTestId('input-zipCode')).toHaveValue('10001');
			expect(screen.getByTestId('input-country')).toHaveValue('USA');
		});

		it('should clear errors when navigating back', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.click(screen.getByTestId('form-next'));
			expect(screen.getByTestId('error-address')).toBeInTheDocument();

			fireEvent.click(screen.getByTestId('form-back'));
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.queryByTestId('error-address')).not.toBeInTheDocument();
		});
	});

	describe('Progress Indicator', () => {
		it('should show correct progress on step 1', () => {
			render(<MultiStepForm />);

			expect(screen.getByTestId('progress-step-1')).toHaveClass('form-progress-step--active');
			expect(screen.getByTestId('progress-step-2')).not.toHaveClass('form-progress-step--active');
			expect(screen.getByTestId('progress-step-3')).not.toHaveClass('form-progress-step--active');
		});

		it('should show correct progress on step 2', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('progress-step-1')).toHaveClass('form-progress-step--active');
			expect(screen.getByTestId('progress-step-2')).toHaveClass('form-progress-step--active');
			expect(screen.getByTestId('progress-step-3')).not.toHaveClass('form-progress-step--active');
		});

		it('should show correct progress on step 3', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('progress-step-1')).toHaveClass('form-progress-step--active');
			expect(screen.getByTestId('progress-step-2')).toHaveClass('form-progress-step--active');
			expect(screen.getByTestId('progress-step-3')).toHaveClass('form-progress-step--active');
		});
	});

	describe('Input Placeholders', () => {
		it('should have correct placeholder for card number', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('input-cardNumber')).toHaveAttribute(
				'placeholder',
				'1234 5678 9012 3456',
			);
		});

		it('should have correct placeholder for expiry date', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('input-cardExpiry')).toHaveAttribute('placeholder', 'MM/YY');
		});

		it('should have correct placeholder for CVV', () => {
			render(<MultiStepForm />);

			fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'John' } });
			fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Doe' } });
			fireEvent.change(screen.getByTestId('input-email'), {
				target: { value: 'john@example.com' },
			});
			fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByTestId('form-next'));

			fireEvent.change(screen.getByTestId('input-address'), { target: { value: '123 Main St' } });
			fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'New York' } });
			fireEvent.change(screen.getByTestId('input-zipCode'), { target: { value: '10001' } });
			fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'USA' } });
			fireEvent.click(screen.getByTestId('form-next'));

			expect(screen.getByTestId('input-cardCvv')).toHaveAttribute('placeholder', '123');
		});
	});
});
