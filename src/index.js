import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import Root from './pages/root';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
