import { expect, test } from '@playwright/test';

test.describe('Counter Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/app.html?component=counter');
	});

	test.describe('Initial Render', () => {
		test('should render counter component', async ({ page }) => {
			await expect(page.getByTestId('counter')).toBeVisible();
		});

		test('should display title', async ({ page }) => {
			await expect(page.getByTestId('counter-title')).toHaveText('Counter');
		});

		test('should initialize with zero', async ({ page }) => {
			await expect(page.getByTestId('counter-display')).toHaveText('0');
		});

		test('should render all control buttons', async ({ page }) => {
			await expect(page.getByTestId('counter-increment')).toBeVisible();
			await expect(page.getByTestId('counter-decrement')).toBeVisible();
			await expect(page.getByTestId('counter-reset')).toBeVisible();
		});

		test('should have correct button labels', async ({ page }) => {
			await expect(page.getByTestId('counter-increment')).toHaveText('+');
			await expect(page.getByTestId('counter-decrement')).toHaveText('-');
			await expect(page.getByTestId('counter-reset')).toHaveText('Reset');
		});
	});

	test.describe('Increment Functionality', () => {
		test('should increment counter by one when increment button is clicked', async ({ page }) => {
			await page.getByTestId('counter-increment').click();
			await expect(page.getByTestId('counter-display')).toHaveText('1');
		});

		test('should increment multiple times', async ({ page }) => {
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-increment').click();
			await expect(page.getByTestId('counter-display')).toHaveText('3');
		});

		test('should handle rapid increment clicks', async ({ page }) => {
			for (let i = 0; i < 10; i++) {
				await page.getByTestId('counter-increment').click();
			}
			await expect(page.getByTestId('counter-display')).toHaveText('10');
		});

		test('should increment to positive numbers', async ({ page }) => {
			for (let i = 0; i < 50; i++) {
				await page.getByTestId('counter-increment').click();
			}
			await expect(page.getByTestId('counter-display')).toHaveText('50');
		});
	});

	test.describe('Decrement Functionality', () => {
		test('should decrement counter by one when decrement button is clicked', async ({ page }) => {
			await page.getByTestId('counter-decrement').click();
			await expect(page.getByTestId('counter-display')).toHaveText('-1');
		});

		test('should decrement multiple times', async ({ page }) => {
			await page.getByTestId('counter-decrement').click();
			await page.getByTestId('counter-decrement').click();
			await page.getByTestId('counter-decrement').click();
			await expect(page.getByTestId('counter-display')).toHaveText('-3');
		});

		test('should handle rapid decrement clicks', async ({ page }) => {
			for (let i = 0; i < 10; i++) {
				await page.getByTestId('counter-decrement').click();
			}
			await expect(page.getByTestId('counter-display')).toHaveText('-10');
		});

		test('should decrement to negative numbers', async ({ page }) => {
			for (let i = 0; i < 50; i++) {
				await page.getByTestId('counter-decrement').click();
			}
			await expect(page.getByTestId('counter-display')).toHaveText('-50');
		});
	});

	test.describe('Reset Functionality', () => {
		test('should reset counter to zero from positive number', async ({ page }) => {
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-reset').click();
			await expect(page.getByTestId('counter-display')).toHaveText('0');
		});

		test('should reset counter to zero from negative number', async ({ page }) => {
			await page.getByTestId('counter-decrement').click();
			await page.getByTestId('counter-decrement').click();
			await page.getByTestId('counter-reset').click();
			await expect(page.getByTestId('counter-display')).toHaveText('0');
		});

		test('should reset counter when already at zero', async ({ page }) => {
			await page.getByTestId('counter-reset').click();
			await expect(page.getByTestId('counter-display')).toHaveText('0');
		});

		test('should reset after multiple operations', async ({ page }) => {
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-decrement').click();
			await page.getByTestId('counter-reset').click();
			await expect(page.getByTestId('counter-display')).toHaveText('0');
		});
	});

	test.describe('Combined Operations', () => {
		test('should handle increment then decrement', async ({ page }) => {
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-decrement').click();
			await expect(page.getByTestId('counter-display')).toHaveText('1');
		});

		test('should handle decrement then increment', async ({ page }) => {
			await page.getByTestId('counter-decrement').click();
			await page.getByTestId('counter-decrement').click();
			await page.getByTestId('counter-increment').click();
			await expect(page.getByTestId('counter-display')).toHaveText('-1');
		});

		test('should handle complex sequence of operations', async ({ page }) => {
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-decrement').click();
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-decrement').click();
			await page.getByTestId('counter-decrement').click();
			await expect(page.getByTestId('counter-display')).toHaveText('1');
		});

		test('should maintain correct state after reset and new operations', async ({ page }) => {
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-reset').click();
			await page.getByTestId('counter-decrement').click();
			await expect(page.getByTestId('counter-display')).toHaveText('-1');
		});

		test('should handle multiple resets in sequence', async ({ page }) => {
			await page.getByTestId('counter-increment').click();
			await page.getByTestId('counter-reset').click();
			await page.getByTestId('counter-reset').click();
			await page.getByTestId('counter-reset').click();
			await expect(page.getByTestId('counter-display')).toHaveText('0');
		});
	});

	test.describe('Edge Cases', () => {
		test('should handle alternating increment and decrement', async ({ page }) => {
			for (let i = 0; i < 10; i++) {
				await page.getByTestId('counter-increment').click();
				await page.getByTestId('counter-decrement').click();
			}
			await expect(page.getByTestId('counter-display')).toHaveText('0');
		});

		test('should handle large positive numbers', async ({ page }) => {
			for (let i = 0; i < 100; i++) {
				await page.getByTestId('counter-increment').click();
			}
			await expect(page.getByTestId('counter-display')).toHaveText('100');
		});

		test('should handle large negative numbers', async ({ page }) => {
			for (let i = 0; i < 100; i++) {
				await page.getByTestId('counter-decrement').click();
			}
			await expect(page.getByTestId('counter-display')).toHaveText('-100');
		});

		test('should maintain state through many operations', async ({ page }) => {
			for (let i = 0; i < 25; i++) {
				await page.getByTestId('counter-increment').click();
			}
			for (let i = 0; i < 10; i++) {
				await page.getByTestId('counter-decrement').click();
			}
			await expect(page.getByTestId('counter-display')).toHaveText('15');
		});
	});

	test.describe('Button Accessibility', () => {
		test('should have correct button types', async ({ page }) => {
			await expect(page.getByTestId('counter-increment')).toHaveAttribute('type', 'button');
			await expect(page.getByTestId('counter-decrement')).toHaveAttribute('type', 'button');
			await expect(page.getByTestId('counter-reset')).toHaveAttribute('type', 'button');
		});

		test('should render buttons with proper classes', async ({ page }) => {
			await expect(page.getByTestId('counter-increment')).toHaveClass(/counter-button/);
			await expect(page.getByTestId('counter-increment')).toHaveClass(/counter-button--increment/);

			await expect(page.getByTestId('counter-decrement')).toHaveClass(/counter-button/);
			await expect(page.getByTestId('counter-decrement')).toHaveClass(/counter-button--decrement/);

			await expect(page.getByTestId('counter-reset')).toHaveClass(/counter-button/);
			await expect(page.getByTestId('counter-reset')).toHaveClass(/counter-button--reset/);
		});
	});

	test.describe('Component Structure', () => {
		test('should render with correct main class', async ({ page }) => {
			await expect(page.getByTestId('counter')).toHaveClass(/counter/);
		});

		test('should render title with correct class', async ({ page }) => {
			await expect(page.getByTestId('counter-title')).toHaveClass(/counter-title/);
		});

		test('should render display with correct class', async ({ page }) => {
			await expect(page.getByTestId('counter-display')).toHaveClass(/counter-display/);
		});

		test('should have buttons container', async ({ page }) => {
			const buttonsContainer = page.locator('.counter-buttons');
			await expect(buttonsContainer).toBeVisible();
		});
	});
});
