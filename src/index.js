import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainApp from './MainApp';  // This should match your renamed file

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(<MainApp />);
