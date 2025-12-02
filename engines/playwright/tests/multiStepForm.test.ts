import { expect, test } from '@playwright/test';

test.describe('MultiStepForm Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/app.html?component=multiStepForm');
	});

	test.describe('Initial Render', () => {
		test('should render multi-step form component', async ({ page }) => {
			await expect(page.getByTestId('multi-step-form')).toBeVisible();
		});

		test('should display form title', async ({ page }) => {
			await expect(page.getByText('Multi-Step Form')).toBeVisible();
		});

		test('should render progress indicator', async ({ page }) => {
			await expect(page.getByTestId('form-progress')).toBeVisible();
		});

		test('should show all progress steps', async ({ page }) => {
			await expect(page.getByTestId('progress-step-1')).toBeVisible();
			await expect(page.getByTestId('progress-step-2')).toBeVisible();
			await expect(page.getByTestId('progress-step-3')).toBeVisible();
		});

		test('should start at step 1', async ({ page }) => {
			await expect(page.getByTestId('form-step-1')).toBeVisible();
		});

		test('should show step 1 as active in progress indicator', async ({ page }) => {
			await expect(page.getByTestId('progress-step-1')).toHaveClass(/form-progress-step--active/);
		});

		test('should not show back button on first step', async ({ page }) => {
			await expect(page.getByTestId('form-back')).not.toBeVisible();
		});

		test('should show next button on first step', async ({ page }) => {
			await expect(page.getByTestId('form-next')).toBeVisible();
		});
	});

	test.describe('Step 1 - Personal Information', () => {
		test('should render all step 1 fields', async ({ page }) => {
			await expect(page.getByTestId('input-firstName')).toBeVisible();
			await expect(page.getByTestId('input-lastName')).toBeVisible();
			await expect(page.getByTestId('input-email')).toBeVisible();
			await expect(page.getByTestId('input-phone')).toBeVisible();
		});

		test('should have correct labels for step 1 fields', async ({ page }) => {
			await expect(page.getByText('First Name')).toBeVisible();
			await expect(page.getByText('Last Name')).toBeVisible();
			await expect(page.getByText('Email')).toBeVisible();
			await expect(page.getByText('Phone')).toBeVisible();
		});

		test('should allow input in all step 1 fields', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');

			await expect(page.getByTestId('input-firstName')).toHaveValue('John');
			await expect(page.getByTestId('input-lastName')).toHaveValue('Doe');
			await expect(page.getByTestId('input-email')).toHaveValue('john@example.com');
			await expect(page.getByTestId('input-phone')).toHaveValue('1234567890');
		});

		test('should show validation error when first name is empty', async ({ page }) => {
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-firstName')).toHaveText('First name is required');
		});

		test('should show validation error when last name is empty', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-lastName')).toHaveText('Last name is required');
		});

		test('should show validation error when email is empty', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-email')).toHaveText('Email is required');
		});

		test('should show validation error for invalid email format', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('invalid-email');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-email')).toHaveText('Invalid email format');
		});

		test('should show validation error when phone is empty', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-phone')).toHaveText('Phone is required');
		});

		test('should clear error when user starts typing in field', async ({ page }) => {
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-firstName')).toBeVisible();

			await page.getByTestId('input-firstName').fill('John');
			await expect(page.getByTestId('error-firstName')).not.toBeVisible();
		});

		test('should not proceed to step 2 if validation fails', async ({ page }) => {
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('form-step-1')).toBeVisible();
			await expect(page.getByTestId('form-step-2')).not.toBeVisible();
		});

		test('should proceed to step 2 when all fields are valid', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('form-step-2')).toBeVisible();
			await expect(page.getByTestId('form-step-1')).not.toBeVisible();
		});
	});

	test.describe('Step 2 - Address Information', () => {
		const fillStep1 = async (page: any) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();
		};

		test('should render all step 2 fields', async ({ page }) => {
			await fillStep1(page);

			await expect(page.getByTestId('input-address')).toBeVisible();
			await expect(page.getByTestId('input-city')).toBeVisible();
			await expect(page.getByTestId('input-zipCode')).toBeVisible();
			await expect(page.getByTestId('input-country')).toBeVisible();
		});

		test('should have correct labels for step 2 fields', async ({ page }) => {
			await fillStep1(page);

			await expect(page.locator('label[for="address"]')).toHaveText('Address');
			await expect(page.locator('label[for="city"]')).toHaveText('City');
			await expect(page.locator('label[for="zipCode"]')).toHaveText('ZIP Code');
			await expect(page.locator('label[for="country"]')).toHaveText('Country');
		});

		test('should show back button on step 2', async ({ page }) => {
			await fillStep1(page);
			await expect(page.getByTestId('form-back')).toBeVisible();
		});

		test('should show next button on step 2', async ({ page }) => {
			await fillStep1(page);
			await expect(page.getByTestId('form-next')).toBeVisible();
		});

		test('should show step 2 as active in progress indicator', async ({ page }) => {
			await fillStep1(page);
			await expect(page.getByTestId('progress-step-2')).toHaveClass(/form-progress-step--active/);
		});

		test('should allow input in all step 2 fields', async ({ page }) => {
			await fillStep1(page);

			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');

			await expect(page.getByTestId('input-address')).toHaveValue('123 Main St');
			await expect(page.getByTestId('input-city')).toHaveValue('New York');
			await expect(page.getByTestId('input-zipCode')).toHaveValue('10001');
			await expect(page.getByTestId('input-country')).toHaveValue('USA');
		});

		test('should go back to step 1 when back button clicked', async ({ page }) => {
			await fillStep1(page);
			await page.getByTestId('form-back').click();

			await expect(page.getByTestId('form-step-1')).toBeVisible();
			await expect(page.getByTestId('form-step-2')).not.toBeVisible();
		});

		test('should preserve step 1 data when going back', async ({ page }) => {
			await fillStep1(page);
			await page.getByTestId('form-back').click();

			await expect(page.getByTestId('input-firstName')).toHaveValue('John');
			await expect(page.getByTestId('input-lastName')).toHaveValue('Doe');
			await expect(page.getByTestId('input-email')).toHaveValue('john@example.com');
			await expect(page.getByTestId('input-phone')).toHaveValue('1234567890');
		});

		test('should show validation error when address is empty', async ({ page }) => {
			await fillStep1(page);
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-address')).toHaveText('Address is required');
		});

		test('should show validation error when city is empty', async ({ page }) => {
			await fillStep1(page);
			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-city')).toHaveText('City is required');
		});

		test('should show validation error when zipCode is empty', async ({ page }) => {
			await fillStep1(page);
			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-zipCode')).toHaveText('ZIP code is required');
		});

		test('should show validation error when country is empty', async ({ page }) => {
			await fillStep1(page);
			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-country')).toHaveText('Country is required');
		});

		test('should proceed to step 3 when all fields are valid', async ({ page }) => {
			await fillStep1(page);
			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('form-step-3')).toBeVisible();
			await expect(page.getByTestId('form-step-2')).not.toBeVisible();
		});
	});

	test.describe('Step 3 - Payment Information', () => {
		const fillStep1 = async (page: any) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();
		};

		const fillStep2 = async (page: any) => {
			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();
		};

		test('should render all step 3 fields', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);

			await expect(page.getByTestId('input-cardNumber')).toBeVisible();
			await expect(page.getByTestId('input-cardExpiry')).toBeVisible();
			await expect(page.getByTestId('input-cardCvv')).toBeVisible();
		});

		test('should have correct labels for step 3 fields', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);

			await expect(page.getByText('Card Number')).toBeVisible();
			await expect(page.getByText('Expiry Date')).toBeVisible();
			await expect(page.getByText('CVV')).toBeVisible();
		});

		test('should show back button on step 3', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await expect(page.getByTestId('form-back')).toBeVisible();
		});

		test('should show submit button instead of next on step 3', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);

			await expect(page.getByTestId('form-submit')).toBeVisible();
			await expect(page.getByTestId('form-next')).not.toBeVisible();
		});

		test('should show step 3 as active in progress indicator', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await expect(page.getByTestId('progress-step-3')).toHaveClass(/form-progress-step--active/);
		});

		test('should allow input in all step 3 fields', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);

			await page.getByTestId('input-cardNumber').fill('1234567890123456');
			await page.getByTestId('input-cardExpiry').fill('12/25');
			await page.getByTestId('input-cardCvv').fill('123');

			await expect(page.getByTestId('input-cardNumber')).toHaveValue('1234567890123456');
			await expect(page.getByTestId('input-cardExpiry')).toHaveValue('12/25');
			await expect(page.getByTestId('input-cardCvv')).toHaveValue('123');
		});

		test('should go back to step 2 when back button clicked', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await page.getByTestId('form-back').click();

			await expect(page.getByTestId('form-step-2')).toBeVisible();
			await expect(page.getByTestId('form-step-3')).not.toBeVisible();
		});

		test('should preserve step 2 data when going back', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await page.getByTestId('form-back').click();

			await expect(page.getByTestId('input-address')).toHaveValue('123 Main St');
			await expect(page.getByTestId('input-city')).toHaveValue('New York');
			await expect(page.getByTestId('input-zipCode')).toHaveValue('10001');
			await expect(page.getByTestId('input-country')).toHaveValue('USA');
		});

		test('should show validation error when card number is empty', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await page.getByTestId('form-submit').click();
			await expect(page.getByTestId('error-cardNumber')).toHaveText('Card number is required');
		});

		test('should show validation error for invalid card number', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await page.getByTestId('input-cardNumber').fill('123');
			await page.getByTestId('form-submit').click();
			await expect(page.getByTestId('error-cardNumber')).toHaveText(
				'Card number must be 16 digits',
			);
		});

		test('should show validation error when expiry date is empty', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await page.getByTestId('input-cardNumber').fill('1234567890123456');
			await page.getByTestId('form-submit').click();
			await expect(page.getByTestId('error-cardExpiry')).toHaveText('Expiry date is required');
		});

		test('should show validation error for invalid expiry date format', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await page.getByTestId('input-cardNumber').fill('1234567890123456');
			await page.getByTestId('input-cardExpiry').fill('1234');
			await page.getByTestId('form-submit').click();
			await expect(page.getByTestId('error-cardExpiry')).toHaveText('Invalid format (MM/YY)');
		});

		test('should show validation error when CVV is empty', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await page.getByTestId('input-cardNumber').fill('1234567890123456');
			await page.getByTestId('input-cardExpiry').fill('12/25');
			await page.getByTestId('form-submit').click();
			await expect(page.getByTestId('error-cardCvv')).toHaveText('CVV is required');
		});

		test('should show validation error for invalid CVV', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await page.getByTestId('input-cardNumber').fill('1234567890123456');
			await page.getByTestId('input-cardExpiry').fill('12/25');
			await page.getByTestId('input-cardCvv').fill('12');
			await page.getByTestId('form-submit').click();
			await expect(page.getByTestId('error-cardCvv')).toHaveText('CVV must be 3 or 4 digits');
		});

		test('should accept 4-digit CVV', async ({ page }) => {
			await fillStep1(page);
			await fillStep2(page);
			await page.getByTestId('input-cardNumber').fill('1234567890123456');
			await page.getByTestId('input-cardExpiry').fill('12/25');
			await page.getByTestId('input-cardCvv').fill('1234');
			await page.getByTestId('form-submit').click();

			await expect(page.getByTestId('form-success')).toBeVisible();
		});
	});

	test.describe('Form Submission', () => {
		const fillAllSteps = async (page: any) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();

			await page.getByTestId('input-cardNumber').fill('1234567890123456');
			await page.getByTestId('input-cardExpiry').fill('12/25');
			await page.getByTestId('input-cardCvv').fill('123');
			await page.getByTestId('form-submit').click();
		};

		test('should show success message after submission', async ({ page }) => {
			await fillAllSteps(page);

			await expect(page.getByTestId('form-success')).toBeVisible();
			await expect(page.getByText('Form Submitted Successfully!')).toBeVisible();
			await expect(page.getByText('Thank you for completing the form.')).toBeVisible();
		});

		test('should show reset button after submission', async ({ page }) => {
			await fillAllSteps(page);
			await expect(page.getByTestId('form-reset')).toBeVisible();
		});

		test('should reset form when reset button clicked', async ({ page }) => {
			await fillAllSteps(page);
			await page.getByTestId('form-reset').click();

			await expect(page.getByTestId('form-step-1')).toBeVisible();
			await expect(page.getByTestId('form-success')).not.toBeVisible();
		});

		test('should clear all form data after reset', async ({ page }) => {
			await fillAllSteps(page);
			await page.getByTestId('form-reset').click();

			await expect(page.getByTestId('input-firstName')).toHaveValue('');
			await expect(page.getByTestId('input-lastName')).toHaveValue('');
			await expect(page.getByTestId('input-email')).toHaveValue('');
			await expect(page.getByTestId('input-phone')).toHaveValue('');
		});

		test('should return to step 1 after reset', async ({ page }) => {
			await fillAllSteps(page);
			await page.getByTestId('form-reset').click();

			await expect(page.getByTestId('progress-step-1')).toHaveClass(/form-progress-step--active/);
			await expect(page.getByTestId('progress-step-2')).not.toHaveClass(
				/form-progress-step--active/,
			);
			await expect(page.getByTestId('progress-step-3')).not.toHaveClass(
				/form-progress-step--active/,
			);
		});
	});

	test.describe('Navigation Flow', () => {
		test('should navigate forward through all steps', async ({ page }) => {
			await expect(page.getByTestId('form-step-1')).toBeVisible();

			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('form-step-2')).toBeVisible();

			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('form-step-3')).toBeVisible();
		});

		test('should navigate backward through all steps', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();

			await page.getByTestId('form-back').click();
			await expect(page.getByTestId('form-step-2')).toBeVisible();

			await page.getByTestId('form-back').click();
			await expect(page.getByTestId('form-step-1')).toBeVisible();
		});

		test('should preserve data when navigating back and forth', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();

			await page.getByTestId('form-back').click();
			await page.getByTestId('form-back').click();

			await expect(page.getByTestId('input-firstName')).toHaveValue('John');
			await expect(page.getByTestId('input-lastName')).toHaveValue('Doe');
			await expect(page.getByTestId('input-email')).toHaveValue('john@example.com');
			await expect(page.getByTestId('input-phone')).toHaveValue('1234567890');

			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('input-address')).toHaveValue('123 Main St');
			await expect(page.getByTestId('input-city')).toHaveValue('New York');
			await expect(page.getByTestId('input-zipCode')).toHaveValue('10001');
			await expect(page.getByTestId('input-country')).toHaveValue('USA');
		});

		test('should clear errors when navigating back', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await page.getByTestId('form-next').click();
			await expect(page.getByTestId('error-address')).toBeVisible();

			await page.getByTestId('form-back').click();
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('error-address')).not.toBeVisible();
		});
	});

	test.describe('Progress Indicator', () => {
		test('should show correct progress on step 1', async ({ page }) => {
			await expect(page.getByTestId('progress-step-1')).toHaveClass(/form-progress-step--active/);
			await expect(page.getByTestId('progress-step-2')).not.toHaveClass(
				/form-progress-step--active/,
			);
			await expect(page.getByTestId('progress-step-3')).not.toHaveClass(
				/form-progress-step--active/,
			);
		});

		test('should show correct progress on step 2', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('progress-step-1')).toHaveClass(/form-progress-step--active/);
			await expect(page.getByTestId('progress-step-2')).toHaveClass(/form-progress-step--active/);
			await expect(page.getByTestId('progress-step-3')).not.toHaveClass(
				/form-progress-step--active/,
			);
		});

		test('should show correct progress on step 3', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('progress-step-1')).toHaveClass(/form-progress-step--active/);
			await expect(page.getByTestId('progress-step-2')).toHaveClass(/form-progress-step--active/);
			await expect(page.getByTestId('progress-step-3')).toHaveClass(/form-progress-step--active/);
		});
	});

	test.describe('Input Placeholders', () => {
		test('should have correct placeholder for card number', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('input-cardNumber')).toHaveAttribute(
				'placeholder',
				'1234 5678 9012 3456',
			);
		});

		test('should have correct placeholder for expiry date', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('input-cardExpiry')).toHaveAttribute('placeholder', 'MM/YY');
		});

		test('should have correct placeholder for CVV', async ({ page }) => {
			await page.getByTestId('input-firstName').fill('John');
			await page.getByTestId('input-lastName').fill('Doe');
			await page.getByTestId('input-email').fill('john@example.com');
			await page.getByTestId('input-phone').fill('1234567890');
			await page.getByTestId('form-next').click();

			await page.getByTestId('input-address').fill('123 Main St');
			await page.getByTestId('input-city').fill('New York');
			await page.getByTestId('input-zipCode').fill('10001');
			await page.getByTestId('input-country').fill('USA');
			await page.getByTestId('form-next').click();

			await expect(page.getByTestId('input-cardCvv')).toHaveAttribute('placeholder', '123');
		});
	});
});
