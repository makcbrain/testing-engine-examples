import { afterEach } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

import '@testing-library/jest-dom';

GlobalRegistrator.register();

afterEach(() => {
	document.body.innerHTML = '';
});
