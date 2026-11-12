import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter,Routes,Route,Link} from 'react-router-dom';
import {Layout} from './components/Layout';
import {Home} from './pages/Home';
import {Reservations} from './pages/Reservations';
import {Admin} from './pages/Admin';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><HashRouter><Layout><Routes><Route path="/" element={<Home/>}/><Route path="/reservas" element={<Reservations/>}/><Route path="/admin-demo" element={<Admin/>}/><Route path="*" element={<section className="inner-page container"><h1>Volvamos a la cancha.</h1><p>Esta página no existe.</p><Link className="button blue-button" to="/">Volvé al inicio</Link></section>}/></Routes></Layout></HashRouter></React.StrictMode>);
