import { expect, test } from '@playwright/test';

test.describe('TodoList Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/app.html?component=todoList');
	});

	test.describe('Initial Render', () => {
		test('should render todo list component', async ({ page }) => {
			await expect(page.getByTestId('todo-list')).toBeVisible();
		});

		test('should display title', async ({ page }) => {
			await expect(page.getByTestId('todo-list-title')).toHaveText('Todo List');
		});

		test('should render input field', async ({ page }) => {
			await expect(page.getByTestId('todo-input')).toBeVisible();
		});

		test('should render add button', async ({ page }) => {
			await expect(page.getByTestId('todo-add-button')).toBeVisible();
		});

		test('should have empty input initially', async ({ page }) => {
			await expect(page.getByTestId('todo-input')).toHaveValue('');
		});

		test('should show empty message when no todos', async ({ page }) => {
			await expect(page.getByTestId('todo-empty-message')).toHaveText('No todos to display');
		});

		test('should render all filter buttons', async ({ page }) => {
			await expect(page.getByTestId('filter-all')).toBeVisible();
			await expect(page.getByTestId('filter-active')).toBeVisible();
			await expect(page.getByTestId('filter-completed')).toBeVisible();
		});

		test('should have all filter selected by default', async ({ page }) => {
			await expect(page.getByTestId('filter-all')).toHaveClass(/todo-filter--active/);
		});
	});

	test.describe('Adding Todos', () => {
		test('should add a todo when input is filled and button clicked', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Buy groceries');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByTestId('todo-empty-message')).not.toBeVisible();
			await expect(page.getByText('Buy groceries')).toBeVisible();
		});

		test('should clear input after adding todo', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Buy groceries');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByTestId('todo-input')).toHaveValue('');
		});

		test('should add todo when pressing Enter', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Buy groceries');
			await page.getByTestId('todo-input').press('Enter');

			await expect(page.getByText('Buy groceries')).toBeVisible();
		});

		test('should add multiple todos', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Buy groceries');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Walk the dog');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Read a book');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByText('Buy groceries')).toBeVisible();
			await expect(page.getByText('Walk the dog')).toBeVisible();
			await expect(page.getByText('Read a book')).toBeVisible();
		});

		test('should not add todo with empty text', async ({ page }) => {
			await page.getByTestId('todo-add-button').click();
			await expect(page.getByTestId('todo-empty-message')).toBeVisible();
		});

		test('should not add todo with only whitespace', async ({ page }) => {
			await page.getByTestId('todo-input').fill('   ');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByTestId('todo-empty-message')).toBeVisible();
		});

		test('should add many todos sequentially', async ({ page }) => {
			for (let i = 1; i <= 10; i++) {
				await page.getByTestId('todo-input').fill(`Todo ${i}`);
				await page.getByTestId('todo-add-button').click();
			}

			for (let i = 1; i <= 10; i++) {
				await expect(page.getByText(`Todo ${i}`, { exact: true })).toBeVisible();
			}
		});
	});

	test.describe('Todo Item Structure', () => {
		test('should render checkbox for each todo', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Test todo');
			await page.getByTestId('todo-add-button').click();

			const todoItems = page.getByTestId('todo-items');
			const checkbox = todoItems.locator('input[type="checkbox"]');
			await expect(checkbox).toBeVisible();
		});

		test('should render delete button for each todo', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Test todo');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByText('Delete')).toBeVisible();
		});

		test('should have unchecked checkbox by default', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Test todo');
			await page.getByTestId('todo-add-button').click();

			const checkbox = page.locator('input[type="checkbox"]');
			await expect(checkbox).not.toBeChecked();
		});
	});

	test.describe('Toggle Todo Completion', () => {
		test('should toggle todo to completed when checkbox clicked', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Test todo');
			await page.getByTestId('todo-add-button').click();

			const checkbox = page.locator('input[type="checkbox"]');
			await checkbox.click();

			await expect(checkbox).toBeChecked();
		});

		test('should toggle todo back to active when clicked again', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Test todo');
			await page.getByTestId('todo-add-button').click();

			const checkbox = page.locator('input[type="checkbox"]');
			await checkbox.click();
			await checkbox.click();

			await expect(checkbox).not.toBeChecked();
		});

		test('should add completed class when todo is completed', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Test todo');
			await page.getByTestId('todo-add-button').click();

			const checkbox = page.locator('input[type="checkbox"]');
			await checkbox.click();

			const todoItem = page.getByTestId('todo-items').locator('.todo-item').first();
			await expect(todoItem).toHaveClass(/todo-item--completed/);
		});

		test('should toggle multiple todos independently', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 3');
			await page.getByTestId('todo-add-button').click();

			const checkboxes = page.locator('input[type="checkbox"]');
			await checkboxes.nth(0).click();
			await checkboxes.nth(2).click();

			await expect(checkboxes.nth(0)).toBeChecked();
			await expect(checkboxes.nth(1)).not.toBeChecked();
			await expect(checkboxes.nth(2)).toBeChecked();
		});
	});

	test.describe('Delete Todo', () => {
		test('should delete todo when delete button clicked', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Test todo');
			await page.getByTestId('todo-add-button').click();

			await page.getByText('Delete').click();

			await expect(page.getByText('Test todo')).not.toBeVisible();
			await expect(page.getByTestId('todo-empty-message')).toBeVisible();
		});

		test('should delete specific todo from list', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 3');
			await page.getByTestId('todo-add-button').click();

			const deleteButtons = page.getByText('Delete');
			await deleteButtons.nth(1).click();

			await expect(page.getByText('Todo 1')).toBeVisible();
			await expect(page.getByText('Todo 2')).not.toBeVisible();
			await expect(page.getByText('Todo 3')).toBeVisible();
		});

		test('should delete all todos one by one', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			await page.getByText('Delete').first().click();
			await page.getByText('Delete').click();

			await expect(page.getByTestId('todo-empty-message')).toBeVisible();
		});
	});

	test.describe('Filter Functionality', () => {
		test('should show all todos by default', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			const checkbox = page.locator('input[type="checkbox"]').first();
			await checkbox.click();

			await expect(page.getByText('Todo 1')).toBeVisible();
			await expect(page.getByText('Todo 2')).toBeVisible();
		});

		test('should filter to show only active todos', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			const checkbox = page.locator('input[type="checkbox"]').first();
			await checkbox.click();

			await page.getByTestId('filter-active').click();

			await expect(page.getByText('Todo 1')).not.toBeVisible();
			await expect(page.getByText('Todo 2')).toBeVisible();
		});

		test('should filter to show only completed todos', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			const checkbox = page.locator('input[type="checkbox"]').first();
			await checkbox.click();

			await page.getByTestId('filter-completed').click();

			await expect(page.getByText('Todo 1')).toBeVisible();
			await expect(page.getByText('Todo 2')).not.toBeVisible();
		});

		test('should switch between filters', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			const checkbox = page.locator('input[type="checkbox"]').first();
			await checkbox.click();

			await page.getByTestId('filter-active').click();
			await expect(page.getByText('Todo 1')).not.toBeVisible();

			await page.getByTestId('filter-completed').click();
			await expect(page.getByText('Todo 2')).not.toBeVisible();

			await page.getByTestId('filter-all').click();
			await expect(page.getByText('Todo 1')).toBeVisible();
			await expect(page.getByText('Todo 2')).toBeVisible();
		});

		test('should show empty message when filter has no todos', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('filter-completed').click();

			await expect(page.getByTestId('todo-empty-message')).toBeVisible();
		});

		test('should update filter active class', async ({ page }) => {
			await page.getByTestId('filter-active').click();

			await expect(page.getByTestId('filter-active')).toHaveClass(/todo-filter--active/);
			await expect(page.getByTestId('filter-all')).not.toHaveClass(/todo-filter--active/);
		});
	});

	test.describe('Filter Counters', () => {
		test('should display correct all count', async ({ page }) => {
			await expect(page.getByTestId('filter-all')).toHaveText('All (0)');

			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByTestId('filter-all')).toHaveText('All (1)');
		});

		test('should display correct active count', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByTestId('filter-active')).toHaveText('Active (2)');

			const checkbox = page.locator('input[type="checkbox"]').first();
			await checkbox.click();

			await expect(page.getByTestId('filter-active')).toHaveText('Active (1)');
		});

		test('should display correct completed count', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByTestId('filter-completed')).toHaveText('Completed (0)');

			const checkboxes = page.locator('input[type="checkbox"]');
			await checkboxes.nth(0).click();

			await expect(page.getByTestId('filter-completed')).toHaveText('Completed (1)');

			await checkboxes.nth(1).click();

			await expect(page.getByTestId('filter-completed')).toHaveText('Completed (2)');
		});
	});

	test.describe('Complex Workflows', () => {
		test('should handle adding, completing, and deleting todos', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('todo-input').fill('Todo 3');
			await page.getByTestId('todo-add-button').click();

			const checkboxes = page.locator('input[type="checkbox"]');
			await checkboxes.nth(0).click();
			await checkboxes.nth(1).click();

			const deleteButtons = page.getByText('Delete');
			await deleteButtons.first().click();

			await expect(page.getByText('Todo 1')).not.toBeVisible();
			await expect(page.getByText('Todo 2')).toBeVisible();
			await expect(page.getByText('Todo 3')).toBeVisible();
		});

		test('should handle toggling todos multiple times', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			const checkbox = page.locator('input[type="checkbox"]');

			for (let i = 0; i < 5; i++) {
				await checkbox.click();
			}

			await expect(checkbox).toBeChecked();
		});

		test('should maintain filter state when adding new todos', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo 1');
			await page.getByTestId('todo-add-button').click();

			await page.getByTestId('filter-active').click();

			await page.getByTestId('todo-input').fill('Todo 2');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByText('Todo 1')).toBeVisible();
			await expect(page.getByText('Todo 2')).toBeVisible();
		});

		test('should handle rapid todo additions', async ({ page }) => {
			for (let i = 1; i <= 20; i++) {
				await page.getByTestId('todo-input').fill(`Todo ${i}`);
				await page.getByTestId('todo-add-button').click();
			}

			await expect(page.getByTestId('filter-all')).toHaveText('All (20)');
		});

		test('should handle complex filtering scenario', async ({ page }) => {
			for (let i = 1; i <= 10; i++) {
				await page.getByTestId('todo-input').fill(`Todo ${i}`);
				await page.getByTestId('todo-add-button').click();
			}

			const checkboxes = page.locator('input[type="checkbox"]');
			for (let i = 0; i < 5; i++) {
				await checkboxes.nth(i).click();
			}

			await page.getByTestId('filter-completed').click();
			await expect(page.getByTestId('filter-completed')).toHaveText('Completed (5)');

			await page.getByTestId('filter-active').click();
			await expect(page.getByTestId('filter-active')).toHaveText('Active (5)');
		});
	});

	test.describe('Input Field Behavior', () => {
		test('should have correct placeholder text', async ({ page }) => {
			await expect(page.getByTestId('todo-input')).toHaveAttribute(
				'placeholder',
				'Enter a new todo...',
			);
		});

		test('should accept text input', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Test input');
			await expect(page.getByTestId('todo-input')).toHaveValue('Test input');
		});

		test('should handle special characters in todo text', async ({ page }) => {
			await page.getByTestId('todo-input').fill('Todo with @#$%^&*()');
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByText('Todo with @#$%^&*()')).toBeVisible();
		});

		test('should handle long todo text', async ({ page }) => {
			const longText =
				'This is a very long todo text that contains many characters to test how the component handles lengthy input strings';
			await page.getByTestId('todo-input').fill(longText);
			await page.getByTestId('todo-add-button').click();

			await expect(page.getByText(longText)).toBeVisible();
		});
	});
});
