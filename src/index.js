import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import {Game} from './js/game.js';

ReactDOM
    .createRoot(document.getElementById("root"))
    .render(<Game/>);
