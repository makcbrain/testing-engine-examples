import { fireEvent, render, screen, within } from '@testing-library/react';

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
		it('should add a todo when input is filled and button clicked', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Buy groceries' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.queryByTestId('todo-empty-message')).not.toBeInTheDocument();
			expect(screen.getByText('Buy groceries')).toBeInTheDocument();
		});

		it('should clear input after adding todo', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Buy groceries' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('todo-input')).toHaveValue('');
		});

		it('should add todo when pressing Enter', () => {
			render(<TodoList />);

			const input = screen.getByTestId('todo-input');
			fireEvent.change(input, { target: { value: 'Buy groceries' } });
			fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

			expect(screen.getByText('Buy groceries')).toBeInTheDocument();
		});

		it('should add multiple todos', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Buy groceries' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Walk the dog' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Read a book' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText('Buy groceries')).toBeInTheDocument();
			expect(screen.getByText('Walk the dog')).toBeInTheDocument();
			expect(screen.getByText('Read a book')).toBeInTheDocument();
		});

		it('should not add todo with empty text', () => {
			render(<TodoList />);

			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});

		it('should not add todo with only whitespace', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: '   ' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});

		it('should add many todos sequentially', () => {
			render(<TodoList />);

			for (let i = 1; i <= 10; i++) {
				fireEvent.change(screen.getByTestId('todo-input'), { target: { value: `Todo ${i}` } });
				fireEvent.click(screen.getByTestId('todo-add-button'));
			}

			for (let i = 1; i <= 10; i++) {
				expect(screen.getByText(`Todo ${i}`)).toBeInTheDocument();
			}
		});
	});

	describe('Todo Item Structure', () => {
		it('should render checkbox for each todo', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Test todo' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const todoItems = screen.getByTestId('todo-items');
			const checkbox = within(todoItems).getByRole('checkbox');
			expect(checkbox).toBeInTheDocument();
		});

		it('should render delete button for each todo', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Test todo' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText('Delete')).toBeInTheDocument();
		});

		it('should have unchecked checkbox by default', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Test todo' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).not.toBeChecked();
		});
	});

	describe('Toggle Todo Completion', () => {
		it('should toggle todo to completed when checkbox clicked', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Test todo' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');
			fireEvent.click(checkbox);

			expect(checkbox).toBeChecked();
		});

		it('should toggle todo back to active when clicked again', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Test todo' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');
			fireEvent.click(checkbox);
			fireEvent.click(checkbox);

			expect(checkbox).not.toBeChecked();
		});

		it('should add completed class when todo is completed', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Test todo' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');
			fireEvent.click(checkbox);

			const todoItem = screen.getByTestId('todo-items').querySelector('.todo-item');
			expect(todoItem).toHaveClass('todo-item--completed');
		});

		it('should toggle multiple todos independently', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 3' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkboxes = screen.getAllByRole('checkbox');
			fireEvent.click(checkboxes[0]);
			fireEvent.click(checkboxes[2]);

			expect(checkboxes[0]).toBeChecked();
			expect(checkboxes[1]).not.toBeChecked();
			expect(checkboxes[2]).toBeChecked();
		});
	});

	describe('Delete Todo', () => {
		it('should delete todo when delete button clicked', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Test todo' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.click(screen.getByText('Delete'));

			expect(screen.queryByText('Test todo')).not.toBeInTheDocument();
			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});

		it('should delete specific todo from list', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 3' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const deleteButtons = screen.getAllByText('Delete');
			fireEvent.click(deleteButtons[1]);

			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();
			expect(screen.getByText('Todo 3')).toBeInTheDocument();
		});

		it('should delete all todos one by one', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.click(screen.getAllByText('Delete')[0]);
			fireEvent.click(screen.getByText('Delete'));

			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});
	});

	describe('Filter Functionality', () => {
		it('should show all todos by default', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getAllByRole('checkbox')[0];
			fireEvent.click(checkbox);

			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
		});

		it('should filter to show only active todos', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getAllByRole('checkbox')[0];
			fireEvent.click(checkbox);

			fireEvent.click(screen.getByTestId('filter-active'));

			expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
		});

		it('should filter to show only completed todos', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getAllByRole('checkbox')[0];
			fireEvent.click(checkbox);

			fireEvent.click(screen.getByTestId('filter-completed'));

			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();
		});

		it('should switch between filters', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getAllByRole('checkbox')[0];
			fireEvent.click(checkbox);

			fireEvent.click(screen.getByTestId('filter-active'));
			expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();

			fireEvent.click(screen.getByTestId('filter-completed'));
			expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();

			fireEvent.click(screen.getByTestId('filter-all'));
			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
		});

		it('should show empty message when filter has no todos', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.click(screen.getByTestId('filter-completed'));

			expect(screen.getByTestId('todo-empty-message')).toBeInTheDocument();
		});

		it('should update filter active class', () => {
			render(<TodoList />);

			fireEvent.click(screen.getByTestId('filter-active'));

			expect(screen.getByTestId('filter-active')).toHaveClass('todo-filter--active');
			expect(screen.getByTestId('filter-all')).not.toHaveClass('todo-filter--active');
		});
	});

	describe('Filter Counters', () => {
		it('should display correct all count', () => {
			render(<TodoList />);

			expect(screen.getByTestId('filter-all')).toHaveTextContent('All (0)');

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('filter-all')).toHaveTextContent('All (1)');
		});

		it('should display correct active count', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('filter-active')).toHaveTextContent('Active (2)');

			const checkbox = screen.getAllByRole('checkbox')[0];
			fireEvent.click(checkbox);

			expect(screen.getByTestId('filter-active')).toHaveTextContent('Active (1)');
		});

		it('should display correct completed count', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed (0)');

			const checkboxes = screen.getAllByRole('checkbox');
			fireEvent.click(checkboxes[0]);

			expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed (1)');

			fireEvent.click(checkboxes[1]);

			expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed (2)');
		});
	});

	describe('Complex Workflows', () => {
		it('should handle adding, completing, and deleting todos', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 3' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkboxes = screen.getAllByRole('checkbox');
			fireEvent.click(checkboxes[0]);
			fireEvent.click(checkboxes[1]);

			const deleteButtons = screen.getAllByText('Delete');
			fireEvent.click(deleteButtons[0]);

			expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
			expect(screen.getByText('Todo 3')).toBeInTheDocument();
		});

		it('should handle toggling todos multiple times', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			const checkbox = screen.getByRole('checkbox');

			for (let i = 0; i < 5; i++) {
				fireEvent.click(checkbox);
			}

			expect(checkbox).toBeChecked();
		});

		it('should maintain filter state when adding new todos', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 1' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			fireEvent.click(screen.getByTestId('filter-active'));

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Todo 2' } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText('Todo 1')).toBeInTheDocument();
			expect(screen.getByText('Todo 2')).toBeInTheDocument();
		});

		it('should handle rapid todo additions', () => {
			render(<TodoList />);

			for (let i = 1; i <= 20; i++) {
				fireEvent.change(screen.getByTestId('todo-input'), { target: { value: `Todo ${i}` } });
				fireEvent.click(screen.getByTestId('todo-add-button'));
			}

			expect(screen.getByTestId('filter-all')).toHaveTextContent('All (20)');
		});

		it('should handle complex filtering scenario', () => {
			render(<TodoList />);

			for (let i = 1; i <= 10; i++) {
				fireEvent.change(screen.getByTestId('todo-input'), { target: { value: `Todo ${i}` } });
				fireEvent.click(screen.getByTestId('todo-add-button'));
			}

			const checkboxes = screen.getAllByRole('checkbox');
			for (let i = 0; i < 5; i++) {
				fireEvent.click(checkboxes[i]);
			}

			fireEvent.click(screen.getByTestId('filter-completed'));
			expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed (5)');

			fireEvent.click(screen.getByTestId('filter-active'));
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

		it('should accept text input', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Test input' } });
			expect(screen.getByTestId('todo-input')).toHaveValue('Test input');
		});

		it('should handle special characters in todo text', () => {
			render(<TodoList />);

			fireEvent.change(screen.getByTestId('todo-input'), {
				target: { value: 'Todo with @#$%^&*()' },
			});
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText('Todo with @#$%^&*()')).toBeInTheDocument();
		});

		it('should handle long todo text', () => {
			render(<TodoList />);

			const longText =
				'This is a very long todo text that contains many characters to test how the component handles lengthy input strings';
			fireEvent.change(screen.getByTestId('todo-input'), { target: { value: longText } });
			fireEvent.click(screen.getByTestId('todo-add-button'));

			expect(screen.getByText(longText)).toBeInTheDocument();
		});
	});
});
