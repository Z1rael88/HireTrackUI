import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {store} from "./store";
import {Provider} from "react-redux";
import './style/style.scss';

const preloader = document.getElementById('preloader');
if (preloader) {
    preloader.classList.add('hidden');
    preloader.remove();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
);