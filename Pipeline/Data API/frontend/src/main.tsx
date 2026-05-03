
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx';

import 'bootstrap/dist/css/bootstrap.min.css'; // global bootstrap import.
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
       <Routes>
          <Route path="/" element={<App />} />
       </Routes>
    </BrowserRouter>
  </>
)
