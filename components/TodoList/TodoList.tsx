import { useRef, useState } from 'react';
import './styles.css';

type Todo = {
	id: number;
	text: string;
	completed: boolean;
};

type FilterType = 'all' | 'active' | 'completed';

export const TodoList = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [filter, setFilter] = useState<FilterType>('all');
	const nextIdRef = useRef(1);

	const addTodo = () => {
		if (inputValue.trim() === '') {
			return;
		}

		const newTodo: Todo = {
			id: nextIdRef.current++,
			text: inputValue,
			completed: false,
		};

		setTodos([...todos, newTodo]);
		setInputValue('');
	};

	const toggleTodo = (id: number) => {
		setTodos(
			todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
		);
	};

	const deleteTodo = (id: number) => {
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const filteredTodos = todos.filter((todo) => {
		if (filter === 'active') {
			return !todo.completed;
		}
		if (filter === 'completed') {
			return todo.completed;
		}
		return true;
	});

	return (
		<div className="todo-list" data-testid="todo-list">
			<h2 className="todo-list-title" data-testid="todo-list-title">
				Todo List
			</h2>

			<div className="todo-input-container">
				<input
					type="text"
					className="todo-input"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && addTodo()}
					placeholder="Enter a new todo..."
					data-testid="todo-input"
				/>
				<button
					type="button"
					className="todo-add-button"
					onClick={addTodo}
					data-testid="todo-add-button"
				>
					Add
				</button>
			</div>

			<div className="todo-filters" data-testid="todo-filters">
				<button
					type="button"
					className={`todo-filter ${filter === 'all' ? 'todo-filter--active' : ''}`}
					onClick={() => setFilter('all')}
					data-testid="filter-all"
				>
					All ({todos.length})
				</button>
				<button
					type="button"
					className={`todo-filter ${filter === 'active' ? 'todo-filter--active' : ''}`}
					onClick={() => setFilter('active')}
					data-testid="filter-active"
				>
					Active ({todos.filter((t) => !t.completed).length})
				</button>
				<button
					type="button"
					className={`todo-filter ${filter === 'completed' ? 'todo-filter--active' : ''}`}
					onClick={() => setFilter('completed')}
					data-testid="filter-completed"
				>
					Completed ({todos.filter((t) => t.completed).length})
				</button>
			</div>

			<ul className="todo-items" data-testid="todo-items">
				{filteredTodos.map((todo) => (
					<li
						key={todo.id}
						className={`todo-item ${todo.completed ? 'todo-item--completed' : ''}`}
						data-testid={`todo-item-${todo.id}`}
					>
						<input
							type="checkbox"
							checked={todo.completed}
							onChange={() => toggleTodo(todo.id)}
							className="todo-checkbox"
							data-testid={`todo-checkbox-${todo.id}`}
						/>
						<span className="todo-text" data-testid={`todo-text-${todo.id}`}>
							{todo.text}
						</span>
						<button
							type="button"
							className="todo-delete-button"
							onClick={() => deleteTodo(todo.id)}
							data-testid={`todo-delete-${todo.id}`}
						>
							Delete
						</button>
					</li>
				))}
			</ul>

			{filteredTodos.length === 0 && (
				<p className="todo-empty-message" data-testid="todo-empty-message">
					No todos to display
				</p>
			)}
		</div>
	);
};
