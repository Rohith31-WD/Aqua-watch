const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(indexPath, 'utf-8');

// Extract CSS
const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
    fs.writeFileSync(path.join(__dirname, 'src', 'bengaluru.css'), styleMatch[1]);
}

// Extract JS
const scriptMatch = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (scriptMatch) {
    let jsContent = scriptMatch[1];
    
    // Replace React destructuring with imports
    jsContent = jsContent.replace(
        /const\s+{\s*useState,\s*useEffect,\s*useContext,\s*createContext,\s*useRef\s*}\s*=\s*React;/,
        `import React, { useState, useEffect, useContext, createContext, useRef } from 'react';`
    );
    
    // Remove ReactDOM.createRoot at the end
    jsContent = jsContent.replace(/ReactDOM\.createRoot\([\s\S]*?render\(<App \/>\);?/, 'export default App;');
    
    fs.writeFileSync(path.join(__dirname, 'src', 'BengaluruApp.jsx'), jsContent);
}

// Write minimal Vite index.html
const minimalHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%2322d3ee'/%3E%3Cstop offset='1' stop-color='%232563eb'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='12' fill='url(%23g)'/%3E%3Ccircle cx='31' cy='30' r='17' fill='%23e0faff'/%3E%3Cpath d='M18 31c8 7 18 8 29-1v18H18z' fill='%232563eb'/%3E%3Ccircle cx='35' cy='22' r='4' fill='%2322d3ee'/%3E%3Ccircle cx='45' cy='15' r='3' fill='%237dd3fc'/%3E%3Ccircle cx='51' cy='25' r='2.5' fill='%23e0f2fe'/%3E%3C/svg%3E">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AquaWatch - Water & Sanitation Monitoring | Bengaluru</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

fs.writeFileSync(indexPath, minimalHtml);

// Update main.jsx to use BengaluruApp
const mainJsxContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './BengaluruApp.jsx'
import './bengaluru.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
fs.writeFileSync(path.join(__dirname, 'src', 'main.jsx'), mainJsxContent);

console.log("Extraction complete.");
