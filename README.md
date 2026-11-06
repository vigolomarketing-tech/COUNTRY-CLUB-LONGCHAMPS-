# Country Club Longchamps · Demo oficial

Demo comercial desarrollada por **Vigolo Web Studio**. React + Vite + TypeScript + Tailwind CSS + React Router + Lucide. Sin backend, autenticación, pagos ni almacenamiento persistente.

**Web prevista:** https://vigolomarketing-tech.github.io/COUNTRY-CLUB-LONGCHAMPS-/

## Procedencia

Se incorporó en la raíz la entrega original `country-club-longchamps-entrega.zip`, disponible en el workspace, conservando componentes, páginas, datos y funcionalidades. SHA-256 del ZIP original: `48fec834e75be4316190aa221b99b813de64311e150fa8a4f577dde7753bbc76`.

El repositorio destino estaba vacío. No se creó otro repositorio ni se modificaron otros proyectos. Se excluyen `node_modules`, `dist`, archivos de entorno y cachés.

## Ejecutar

Node 22.18+ o 24 y npm.

```bash
npm install
npm run dev
npm test
npm run check:routes
npm run build
npm run preview
```

En desarrollo y preview, abrir la URL indicada por Vite con el prefijo `/COUNTRY-CLUB-LONGCHAMPS-/`.

## Rutas

- `/#/`: inicio, deportes, galería, gastronomía, torneos y contacto.
- `/#/reservas`: deporte, cancha, fecha, horario, duración, resumen y confirmación simulada.
- `/#/admin-demo`: indicadores, agenda, tabla de turnos, filtros, detalles, creación de reservas y bloqueo de horarios.

En Pages, el prefijo completo es `/COUNTRY-CLUB-LONGCHAMPS-/`. `HashRouter` permite abrir y recargar las tres rutas sin 404 del servidor. `vite.config.ts` define exactamente `base: '/COUNTRY-CLUB-LONGCHAMPS-/'`. Las anclas de secciones se gestionan mediante React Router.

## Publicación automática en GitHub Pages

`.github/workflows/pages.yml` instala con `npm ci`, ejecuta las pruebas del servicio, verifica el render de las tres rutas, compila y publica `dist/` usando el mecanismo oficial de GitHub Pages. Se ejecuta en cada push a `main`; los pull requests se verifican sin desplegar. También admite ejecución manual.

Configuración de GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**. No seleccionar Deploy from a branch. Si Pages se habilitó mediante API con `build_type: workflow`, esta opción ya queda configurada. El job `deploy` muestra la URL final.

El despliegue no requiere secretos de aplicación ni credenciales en el código; usa `GITHUB_TOKEN` y OIDC de GitHub Actions. El código no integra servicios pagos.

## Qué es simulado

Todas las canchas, horarios, turnos, ocupación y eventos son ficticios y se identifican como tales. Las fotografías de referencia no representan las instalaciones reales. No se muestran precios oficiales. Los cambios se comparten en memoria entre reservas y administración durante la sesión y desaparecen al recargar. Ninguna confirmación envía mensajes, cobra ni genera una reserva real. Los enlaces de WhatsApp, Instagram y Maps se abren únicamente al pulsarlos.

## Corrección de fechas y horarios

El calendario siempre usa `America/Argentina/Buenos_Aires`, independientemente de la zona horaria del dispositivo. Se rechazan fechas inválidas, días anteriores y turnos que ya comenzaron. Los horarios se actualizan cada 30 segundos en el simulador y en el modal administrativo; el servicio vuelve a validar al confirmar, incluso si una pantalla quedó abierta. El panel deshabilita horarios pasados y ofrece opciones disponibles en sus formularios. Duraciones ilustrativas: 60, 90 y 120 minutos; se evitan superposiciones y turnos que terminen después de las 23. Este cierre es una regla demo, no el horario oficial del club.

## Arquitectura para fase 2

- `src/types/booking.ts`: entidades e interfaz `BookingService`.
- `src/services/bookingService.ts`: adaptador en memoria y reglas de disponibilidad; sustituible por un adaptador remoto sin reconstruir las páginas.
- `src/data/demo.ts`: datos simulados centralizados.
- `src/config/club.ts`: contacto y logo opcional.
- `src/utils/date.ts`: fecha, reloj del club y validación de turnos futuros.
- `src/components/`: layout, calendario y modales nativos.
- `src/pages/`: inicio, reservas y administración.

## Fotografías y escudo

Reemplazar `public/assets/hero.jpg`, `football.jpg`, `tennis.jpg`, `padel.jpg` y `food.jpg` por fotografías oficiales autorizadas conservando esos nombres. La referencia genérica de raquetas fue reemplazada por una foto de pádel de SideSpin Padel con licencia Unsplash. Ver fuentes y licencias en `public/assets/README.md`. Manrope se incluye localmente con su licencia SIL.

**El escudo oficial no estaba disponible.** No se dibujó ni imitó. Agregar `public/assets/escudo-oficial.png` y configurar `club.logo` con `asset('escudo-oficial.png')` en `src/config/club.ts`. La marca tipográfica y el favicon CL siguen siendo provisorios. Solo retirar las aclaraciones ilustrativas tras incorporar datos y assets oficiales.

## Diseño y SEO

Identidad institucional azul `#064A91`, azul oscuro `#082A52`, naranja `#FF7900`, blanco y gris. Hero fotográfico, tarjetas deportivas mejoradas, microinteracciones, menú móvil, galería modal, resumen dinámico y panel responsive. Sin carrusel ni controles aparentes sin acción. Accesibilidad: enlace de salto, formularios etiquetados, foco visible, estados aria, modales nativos con Escape y preferencia de movimiento reducido.

Title, descripción, Open Graph, canonical del dominio previsto y JSON-LD local con los datos proporcionados. No se inventan reseñas, valoraciones ni precios. La imagen social sigue siendo ilustrativa hasta incorporar una oficial.

## Validación y límites

- Instalación npm y build TypeScript/Vite.
- Seis pruebas del servicio: superposición, duración/cierre, creación, fechas, zona horaria argentina y rechazo de turnos pasados en reservas/bloqueos.
- `npm run check:routes`: render de las tres páginas con su layout compartido, sin abrir un servidor ni navegador.
- Revisión de breakpoints para celulares/tablets/escritorio y ajustes de legibilidad, calendario, botones y tarjetas.

La herramienta de navegador `cua_repl.js` no estaba disponible en el entorno gestionado. No confundir las verificaciones de render con pruebas visuales o interacciones completas en navegador: queda pendiente comprobar visualmente a 375, 768 y 1440 px, menú, modales, reserva completa y consola. La interfaz está preparada para esa revisión.
