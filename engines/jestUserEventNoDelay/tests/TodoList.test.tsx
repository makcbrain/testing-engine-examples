import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TodoList } from '../../../components/TodoList/TodoList';

describe('TodoList Component', () => {
	describe('Initial Render', () => {
		it('should render todo list component', () => {
			render(<TodoList />);
			expect(screen.getByTestId('todo-list')).toBeInTheDocument();
		});

		it('should display title', () => {
			render(<TodoList />);
			expect(screen.getByTestId('todo-list-title')).toHaveTextContent('Todo List');
		});

		it('should render input field', () => {
			render(<TodoList />);
			expect(screen.getByTestId('todo-input')).toBeInTheDocument();
		});

		it('should render add button', () => {
			render(<TodoList />);
			expect(screen.getByTestId('todo-add-button')).toBeInTheDocument();
		});

		it('should have empty input initially', () => {
			render(<TodoList />);
			expect(screen.getByTestId('todo-input')).toHaveValue('');
		});

		it('should show empty message when no todos', () => {
			render(<TodoList />);
			expect(screen.getByTestId('todo-empty-message')).toHaveTextContent('No todos to display');
		});

		it('should render all filter buttons', () => {
			render(<TodoList />);
			expect(screen.getByTestId('filter-all')).toBeInTheDocument();
			expect(screen.getByTestId('filter-active')).toBeInTheDocument();
			expect(screen.getByTestId('filter-completed')).toBeInTheDocument();
		});

		it('should have all filter selected by default', () => {
			render(<TodoList />);
			expect(screen.getByTestId('filter-all')).toHaveClass('todo-filter--active');
		});
	});

	describe('Adding Todos', () => {
		it('should add a todo when input is filled and button clicked', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Buy groceries');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.queryByTestId('todo-empty-message')).not.toBeInTheDocument();
			expect(screen.getByText('Buy groceries')).toBeInTheDocument();
		});

		it('should clear input after adding todo', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Buy groceries');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('todo-input')).toHaveValue('');
		});

		it('should add todo when pressing Enter', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Buy groceries{Enter}');

			expect(screen.getByText('Buy groceries')).toBeInTheDocument();
		});

		it('should add multiple todos', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Buy groceries');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Walk the dog');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Read a book');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText('Buy groceries')).toBeInTheDocument();
			expect(screen.getByText('Walk the dog')).toBeInTheDocument();
			expect(screen.getByText('Read a book')).toBeInTheDocument();
		});

		it('should not add todo with empty text', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});

		it('should not add todo with only whitespace', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), '   ');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});

		it('should add many todos sequentially', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			for (let i = 1; i <= 10; i++) {
				await user.type(screen.getByTestId('todo-input'), `Todo ${i}`);
				await user.click(screen.getByTestId('todo-add-button'));
			}

			for (let i = 1; i <= 10; i++) {
				expect(screen.getByText(`Todo ${i}`)).toBeInTheDocument();
			}
		});
	});

	describe('Todo Item Structure', () => {
		it('should render checkbox for each todo', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Test todo');
			await user.click(screen.getByTestId('todo-add-button'));

			const todoItems = screen.getByTestId('todo-items');
			const checkbox = within(todoItems).getByRole('checkbox');
			expect(checkbox).toBeInTheDocument();
		});

		it('should render delete button for each todo', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Test todo');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText('Delete')).toBeInTheDocument();
		});

		it('should have unchecked checkbox by default', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Test todo');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).not.toBeChecked();
		});
	});

	describe('Toggle Todo Completion', () => {
		it('should toggle todo to completed when checkbox clicked', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Test todo');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');
			await user.click(checkbox);

			expect(checkbox).toBeChecked();
		});

		it('should toggle todo back to active when clicked again', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Test todo');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');
			await user.click(checkbox);
			await user.click(checkbox);

			expect(checkbox).not.toBeChecked();
		});

		it('should add completed class when todo is completed', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Test todo');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');
			await user.click(checkbox);

			const todoItem = screen.getByTestId('todo-items').querySelector('.todo-item');
			expect(todoItem).toHaveClass('todo-item--completed');
		});

		it('should toggle multiple todos independently', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 3');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkboxes = screen.getAllByRole('checkbox');
			await user.click(checkboxes[0]);
			await user.click(checkboxes[2]);

			expect(checkboxes[0]).toBeChecked();
			expect(checkboxes[1]).not.toBeChecked();
			expect(checkboxes[2]).toBeChecked();
		});
	});

	describe('Delete Todo', () => {
		it('should delete todo when delete button clicked', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Test todo');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.click(screen.getByText('Delete'));

			expect(screen.queryByText('Test todo')).not.toBeInTheDocument();
			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});

		it('should delete specific todo from list', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 3');
			await user.click(screen.getByTestId('todo-add-button'));

			const deleteButtons = screen.getAllByText('Delete');
			await user.click(deleteButtons[1]);

			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();
			expect(screen.getByText('Todo 3')).toBeInTheDocument();
		});

		it('should delete all todos one by one', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.click(screen.getAllByText('Delete')[0]);
			await user.click(screen.getByText('Delete'));

			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});
	});

	describe('Filter Functionality', () => {
		it('should show all todos by default', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getAllByRole('checkbox')[0];
			await user.click(checkbox);

			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
		});

		it('should filter to show only active todos', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getAllByRole('checkbox')[0];
			await user.click(checkbox);

			await user.click(screen.getByTestId('filter-active'));

			expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
		});

		it('should filter to show only completed todos', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getAllByRole('checkbox')[0];
			await user.click(checkbox);

			await user.click(screen.getByTestId('filter-completed'));

			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();
		});

		it('should switch between filters', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getAllByRole('checkbox')[0];
			await user.click(checkbox);

			await user.click(screen.getByTestId('filter-active'));
			expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();

			await user.click(screen.getByTestId('filter-completed'));
			expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();

			await user.click(screen.getByTestId('filter-all'));
			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
		});

		it('should show empty message when filter has no todos', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.click(screen.getByTestId('filter-completed'));

			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});

		it('should update filter active class', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.click(screen.getByTestId('filter-active'));

			expect(screen.getByTestId('filter-active')).toHaveClass('todo-filter--active');
			expect(screen.getByTestId('filter-all')).not.toHaveClass('todo-filter--active');
		});
	});

	describe('Filter Counters', () => {
		it('should display correct all count', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			expect(screen.getByTestId('filter-all')).toHaveTextContent('All (0)');

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('filter-all')).toHaveTextContent('All (1)');
		});

		it('should display correct active count', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('filter-active')).toHaveTextContent('Active (2)');

			const checkbox = screen.getAllByRole('checkbox')[0];
			await user.click(checkbox);

			expect(screen.getByTestId('filter-active')).toHaveTextContent('Active (1)');
		});

		it('should display correct completed count', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed (0)');

			const checkboxes = screen.getAllByRole('checkbox');
			await user.click(checkboxes[0]);

			expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed (1)');

			await user.click(checkboxes[1]);

			expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed (2)');
		});
	});

	describe('Complex Workflows', () => {
		it('should handle adding, completing, and deleting todos', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 3');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkboxes = screen.getAllByRole('checkbox');
			await user.click(checkboxes[0]);
			await user.click(checkboxes[1]);

			const deleteButtons = screen.getAllByText('Delete');
			await user.click(deleteButtons[0]);

			expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
			expect(screen.getByText('Todo 3')).toBeInTheDocument();
		});

		it('should handle toggling todos multiple times', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');

			for (let i = 0; i < 5; i++) {
				await user.click(checkbox);
			}

			expect(checkbox).toBeChecked();
		});

		it('should maintain filter state when adding new todos', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo 1');
			await user.click(screen.getByTestId('todo-add-button'));

			await user.click(screen.getByTestId('filter-active'));

			await user.type(screen.getByTestId('todo-input'), 'Todo 2');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
		});

		it('should handle rapid todo additions', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			for (let i = 1; i <= 20; i++) {
				await user.type(screen.getByTestId('todo-input'), `Todo ${i}`);
				await user.click(screen.getByTestId('todo-add-button'));
			}

			expect(screen.getByTestId('filter-all')).toHaveTextContent('All (20)');
		});

		it('should handle complex filtering scenario', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			for (let i = 1; i <= 10; i++) {
				await user.type(screen.getByTestId('todo-input'), `Todo ${i}`);
				await user.click(screen.getByTestId('todo-add-button'));
			}

			const checkboxes = screen.getAllByRole('checkbox');
			for (let i = 0; i < 5; i++) {
				await user.click(checkboxes[i]);
			}

			await user.click(screen.getByTestId('filter-completed'));
			expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed (5)');

			await user.click(screen.getByTestId('filter-active'));
			expect(screen.getByTestId('filter-active')).toHaveTextContent('Active (5)');
		});
	});

	describe('Input Field Behavior', () => {
		it('should have correct placeholder text', () => {
			render(<TodoList />);
			expect(screen.getByTestId('todo-input')).toHaveAttribute(
				'placeholder',
				'Enter a new todo...',
			);
		});

		it('should accept text input', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Test input');
			expect(screen.getByTestId('todo-input')).toHaveValue('Test input');
		});

		it('should handle special characters in todo text', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			await user.type(screen.getByTestId('todo-input'), 'Todo with @#$%^&*()');
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText('Todo with @#$%^&*()')).toBeInTheDocument();
		});

		it('should handle long todo text', async () => {
			const user = userEvent.setup({ delay: null });
			render(<TodoList />);

			const longText =
				'This is a very long todo text that contains many characters to test how the component handles lengthy input strings';
			await user.type(screen.getByTestId('todo-input'), longText);
			await user.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText(longText)).toBeInTheDocument();
		});
	});
});
