import { Counter } from '../../../components/Counter/Counter';

export const App = () => {
	const component = new URLSearchParams(window.location.search).get('component');

	switch (component) {
		case 'counter':
			return <Counter />;
		default:
			return (
				<div>
					<h1>Available Components</h1>
					<ul>
						<li>
							<a href="?component=counter">Counter</a>
						</li>
					</ul>
				</div>
			);
	}
};
