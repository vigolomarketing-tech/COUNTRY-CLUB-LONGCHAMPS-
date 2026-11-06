import assert from 'node:assert/strict';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {MemoryRouter,Routes,Route} from 'react-router-dom';
import {Home} from '../src/pages/Home';
import {Reservations} from '../src/pages/Reservations';
import {Admin} from '../src/pages/Admin';
import {Layout} from '../src/components/Layout';
export function verify(){for(const [path,Page,expected] of [['/',Home,'NOS'],['/reservas',Reservations,'SIMULADOR DE RESERVAS'],['/admin-demo',Admin,'PANEL DE DEMOSTRACIÓN']] as const){const html=renderToString(<MemoryRouter initialEntries={[path]}><Layout><Routes><Route path={path} element={<Page/>}/></Routes></Layout></MemoryRouter>);assert(html.includes(expected));assert(html.includes('Vigolo Web Studio'));console.log(`PASS ${path}: page and shared layout render`);}}
