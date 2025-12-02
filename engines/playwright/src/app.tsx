import { Counter } from '../../../components/Counter/Counter';
import { MultiStepForm } from '../../../components/MultiStepForm/MultiStepForm';
import { TodoList } from '../../../components/TodoList/TodoList';

export const App = () => {
	const component = new URLSearchParams(window.location.search).get('component');

	switch (component) {
		case 'counter':
			return <Counter />;
		case 'multiStepForm':
			return <MultiStepForm />;
		case 'todoList':
			return <TodoList />;
		default:
			return (
				<div>
					<h1>Available Components</h1>
					<ul>
						<li>
							<a href="?component=counter">Counter</a>
						</li>
						<li>
							<a href="?component=multiStepForm">Multi-Step Form</a>
						</li>
						<li>
							<a href="?component=todoList">Todo List</a>
						</li>
					</ul>
				</div>
			);
	}
};
