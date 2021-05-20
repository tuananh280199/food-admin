import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor} from "./config/configStore";
import 'tailwindcss/dist/tailwind.min.css';
import 'antd/dist/antd.css';
import 'tailwindcss/dist/tailwind.css';
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

reportWebVitals();
