# Auditoría de textos — Country Club Longchamps

## Alcance

Revisión editorial de las rutas `/#/`, `/#/reservas` y `/#/admin-demo`, sus componentes compartidos, datos simulados, calendario, mensajes de error, estados vacíos, modales, notificaciones, textos alternativos, nombres accesibles, metadatos SEO y manifiesto de accesos directos. También se revisó la página no encontrada.

Se conserva el español argentino con voseo y el nombre oficial **Country Club Longchamps**. La marca gráfica en mayúsculas se mantiene intacta. Se conservan las etiquetas nominales de navegación (Inicio, Deportes, Reservas, etc.) y las acciones convencionales «Ver detalle», «Atrás» y «Cómo llegar».

## Hallazgos

- Convención de marca: todas las variantes con tilde se reemplazaron por **Padel**, **padel** o **PADEL**, según el contexto. La forma con tilde era ortográficamente válida; el reemplazo responde a la preferencia expresa de marca, no a un error normativo.
- Gramática: se completaron artículos en las enumeraciones del hero y del flujo de reserva.
- Consistencia editorial: se unificaron las llamadas a la acción con voseo argentino y las denominaciones de reservas, turnos y demostración.
- Claridad: se sustituyeron mensajes ambiguos como «No alcanza» y explicaciones técnicas sobre memoria por indicaciones comprensibles.
- Concordancia: el contador administrativo distingue «1 turno simulado» de «0/2/… turnos simulados», sin alterar los datos.
- Naturalidad: «No se ha generado…» pasó a «No se generó…» y «online» a «en línea». Son mejoras de estilo; las expresiones anteriores no se clasifican como faltas de ortografía.
- Marca: el nombre abreviado del acceso directo ahora coincide con el nombre completo del club.
- Tildes y mayúsculas: se verificaron las formas de voseo. «Encontranos», «Seguinos», «Quedate» y «Hacete» ya estaban bien escritas en sus contextos y se conservaron. Se mantuvieron las mayúsculas del diseño, así como las tildes de Fútbol, Elegí, Seleccioná, Confirmá y demás palabras que las requieren.
- No se detectaron otras erratas ortográficas evidentes tras la revisión. No se agregaron características, precios, horarios ni servicios del club.

## Registro de cambios

59 ajustes editoriales aplicados a 65 ocurrencias en 9 archivos de la aplicación. La siguiente tabla incluye los originales con tilde únicamente como evidencia de la auditoría; no son textos que se rendericen en la web.

| Archivo | Original | Corregido | Motivo | Ocurrencias |
| --- | --- | --- | --- | --- |
| `src/pages/Home.tsx` | `pádel` | `padel` | Convención de marca solicitada; se conserva el uso de mayúsculas según el contexto. | 3 |
| `src/pages/Home.tsx` | `PÁDEL` | `PADEL` | Convención de marca solicitada; se conserva el uso de mayúsculas según el contexto. | 1 |
| `src/data/demo.ts` | `Pádel` | `Padel` | Convención de marca solicitada; se conserva el uso de mayúsculas según el contexto. | 2 |
| `src/data/demo.ts` | `pádel` | `padel` | Convención de marca solicitada; se conserva el uso de mayúsculas según el contexto. | 1 |
| `index.html` | `pádel` | `padel` | Convención de marca solicitada; se conserva el uso de mayúsculas según el contexto. | 3 |
| `src/components/Layout.tsx` | `Reservar cancha` | `Reservá tu cancha` | Voseo argentino y llamada a la acción consistente. | 2 |
| `src/pages/Home.tsx` | `Reservar cancha` | `Reservá tu cancha` | Voseo argentino y llamada a la acción consistente. | 1 |
| `src/components/Layout.tsx` | `Saltar al contenido` | `Ir al contenido principal` | Etiqueta de accesibilidad más precisa. | 1 |
| `src/components/Layout.tsx` | `Explorar panel demo` | `Explorá el panel demo` | Voseo argentino; se añade el artículo. | 1 |
| `src/components/Layout.tsx` | `Consultar al club por WhatsApp` | `Consultá al club por WhatsApp` | Voseo argentino en el nombre accesible del enlace. | 1 |
| `src/components/Layout.tsx` | `· Demo comercial` | `· Demostración comercial` | Terminología uniforme para identificar la demostración. | 1 |
| `src/pages/Home.tsx` | `Viví el fútbol, tenis y padel` | `Viví el fútbol, el tenis y el padel` | Se completan los artículos de la enumeración. | 1 |
| `src/pages/Home.tsx` | `Descubrir el club` | `Conocé el club` | Voseo argentino y llamada a la acción directa. | 1 |
| `src/pages/Home.tsx` | `Buscar disponibilidad` | `Consultá disponibilidad` | Voseo argentino y terminología de disponibilidad. | 1 |
| `src/pages/Home.tsx` | `Ver canchas` | `Conocé las canchas` | Voseo argentino. | 1 |
| `src/pages/Home.tsx` | `>Reservar <` | `>Reservá <` | Voseo argentino en las tarjetas deportivas. | 1 |
| `src/pages/Home.tsx` | `Seleccioná cancha, día y horario.` | `Seleccioná la cancha, el día y el horario.` | Se completan los artículos de la enumeración. | 1 |
| `src/pages/Home.tsx` | `Consultar gastronomía` | `Consultá por gastronomía` | Construcción natural y voseo argentino. | 1 |
| `src/pages/Home.tsx` | `Conocer propuesta` | `Conocé la propuesta` | Se añade el artículo y se usa voseo argentino. | 1 |
| `src/pages/Home.tsx` | `Probar reserva` | `Simulá una reserva` | Acción precisa que mantiene explícito el carácter simulado. | 1 |
| `src/pages/Home.tsx` | `Eventos ficticios para presentar la demo.` | `Eventos ficticios para esta demostración.` | Redacción directa y terminología uniforme. | 1 |
| `src/pages/Home.tsx` | `No son fotografías de las instalaciones reales.` | `No corresponden a las instalaciones del club.` | Aclaración más directa, sin cambiar el significado. | 1 |
| `src/data/demo.ts` | `Cuatro jugadores, un gran plan.` | `Cuatro jugadores y un gran plan.` | Coordinación más natural entre las dos ideas. | 1 |
| `src/pages/Reservations.tsx` | `Visitante demo` | `Visitante de demostración` | Identificación clara del dato simulado. | 1 |
| `src/pages/Reservations.tsx` | `sistema de reservas online` | `sistema de reservas en línea` | Se evita el anglicismo innecesario. | 1 |
| `src/pages/Reservations.tsx` | `No se ha generado ninguna reserva real.` | `No se generó ninguna reserva real.` | Tiempo verbal más natural en español argentino. | 1 |
| `src/pages/Reservations.tsx` | `Volver al inicio` | `Volvé al inicio` | Voseo argentino. | 1 |
| `src/pages/Reservations.tsx` | `Simular otra reserva` | `Simulá otra reserva` | Voseo argentino. | 1 |
| `src/pages/Reservations.tsx` | `Encontrá tu horario` | `Seleccioná un horario` | Instrucción directa y coherente con el paso de selección. | 1 |
| `src/pages/Reservations.tsx` | `Disponibilidad ilustrativa. Hora de Buenos Aires; los horarios pasados están deshabilitados.` | `Disponibilidad simulada, en hora de Buenos Aires. Los horarios pasados están deshabilitados.` | Se separan las ideas y se aclara la zona horaria. | 1 |
| `src/pages/Reservations.tsx` | `'No alcanza'` | `'Supera el cierre'` | Se explica por qué la duración no está disponible. | 1 |
| `src/pages/Reservations.tsx` | `No hay horarios para esa duración.` | `No hay horarios disponibles para esa duración.` | Se explicita que se trata de disponibilidad. | 1 |
| `src/pages/Reservations.tsx` | `Cambiar fecha` | `Cambiá la fecha` | Voseo argentino y artículo. | 1 |
| `src/pages/Reservations.tsx` | `Seleccioná un horario compatible con la duración.` | `Seleccioná un horario disponible para esa duración.` | Indicación más concreta y terminología uniforme. | 1 |
| `src/pages/Reservations.tsx` | `'Confirmar simulación'` | `'Confirmá la simulación'` | Voseo argentino y artículo. | 1 |
| `src/pages/Reservations.tsx` | `'Continuar'` | `'Continuá'` | Voseo argentino. | 1 |
| `src/pages/Reservations.tsx` | `Sin importes oficiales. La demo no genera una reserva real.` | `No se muestran precios oficiales. Esta demostración no genera reservas reales.` | Redacción completa y más clara, sin inventar precios. | 1 |
| `src/pages/Reservations.tsx` | `Modo demostración` | `Modo de demostración` | Se completa la construcción nominal. | 1 |
| `src/pages/Admin.tsx` | `Horario bloqueado en esta sesión demo.` | `Horario bloqueado en esta sesión de demostración.` | Construcción más natural para la notificación. | 1 |
| `src/pages/Admin.tsx` | `Los cambios se pierden al recargar.` | `Los cambios no se guardan al recargar la página.` | Se explica el alcance de la simulación con mayor precisión. | 1 |
| `src/pages/Admin.tsx` | `Bloquear horario` | `Bloqueá un horario` | Voseo argentino y artículo. | 1 |
| `src/pages/Admin.tsx` | `Crear turno demo` | `Creá un turno demo` | Voseo argentino y artículo; mantiene la aclaración compacta del botón. | 1 |
| `src/pages/Admin.tsx` | `{filtered.length} registros ficticios` | `{filtered.length} {filtered.length===1?'turno simulado':'turnos simulados'}` | Concordancia de número y uso uniforme de la palabra turno. | 1 |
| `src/pages/Admin.tsx` | `>Ver <` | `>Ver detalle <` | Etiqueta más específica para abrir el detalle de un turno. | 1 |
| `src/pages/Admin.tsx` | `Detalle del turno demo` | `Detalle del turno simulado` | Se explicita el carácter ficticio del registro. | 1 |
| `src/pages/Admin.tsx` | `Este registro solo representa una interacción de demostración.` | `Este turno es simulado y no representa una reserva real.` | Aclaración directa y terminología consistente. | 1 |
| `src/pages/Admin.tsx` | `Simular bloqueo de horario` | `Simulá un bloqueo de horario` | Voseo argentino y artículo en el título del formulario. | 1 |
| `src/pages/Admin.tsx` | `Crear reserva de demostración` | `Creá una reserva de demostración` | Voseo argentino y artículo. | 1 |
| `src/pages/Admin.tsx` | `Sin datos personales. El cambio se conserva únicamente en memoria hasta recargar.` | `No se solicitan datos personales. El cambio se conserva hasta que recargues la página.` | Se reemplaza la explicación técnica por una instrucción clara para la persona usuaria. | 1 |
| `src/pages/Admin.tsx` | `'Confirmar simulación'` | `'Confirmá la simulación'` | Voseo argentino y artículo. | 1 |
| `src/services/bookingService.ts` | `Ese horario ya no está disponible en la demo. Elegí otro.` | `Ese horario ya no está disponible en esta demostración. Elegí otro.` | Terminología uniforme y natural en los mensajes de error. | 1 |
| `src/main.tsx` | `Volver al inicio` | `Volvé al inicio` | Voseo argentino en la página no encontrada. | 1 |
| `index.html` | `reservas online` | `reservas en línea` | Se evita el anglicismo en los metadatos SEO. | 1 |
| `index.html` | `Demo comercial de Vigolo Web Studio.` | `Demostración comercial de Vigolo Web Studio.` | Terminología uniforme en los metadatos sociales. | 1 |
| `public/site.webmanifest` | `"short_name": "Country Club"` | `"short_name": "Country Club Longchamps"` | Se conserva el nombre completo del club en los accesos directos. | 1 |
| `src/pages/Reservations.tsx` | `Cancha por elegir` | `Elegí una cancha` | Indicación directa y natural en el resumen incompleto. | 1 |
| `src/pages/Reservations.tsx` | `Horario por elegir` | `Elegí un horario` | Indicación directa y natural en el resumen incompleto. | 1 |
| `src/pages/Admin.tsx` | `Vista de jugadores` | `Vista de reservas` | El enlace lleva al simulador de reservas; se unifica la terminología. | 1 |
| `src/pages/Admin.tsx` | `No hay turnos en esta vista. Creá uno de demostración.` | `No hay turnos para esta selección. Creá un turno simulado.` | Estado vacío más preciso y terminología uniforme. | 1 |

## Archivos modificados

- `index.html`
- `public/site.webmanifest`
- `src/components/Layout.tsx`
- `src/data/demo.ts`
- `src/main.tsx`
- `src/pages/Admin.tsx`
- `src/pages/Home.tsx`
- `src/pages/Reservations.tsx`
- `src/services/bookingService.ts`
- `docs/AUDITORIA-TEXTOS.md`: este informe.

## Conservación funcional y visual

No se modificaron las rutas, identificadores de deportes, claves de estado, variables, reglas del calendario, disponibilidad, precios, estructura de navegación, componentes visuales, CSS, fuentes, logo 3D ni fotografías. La única condición de presentación nueva es la concordancia singular/plural del contador de turnos. Se conservaron todos los avisos de simulación. No fue necesario ajustar el diseño ni el espacio de los componentes.

## Validación

- Búsqueda con normalización Unicode de las variantes con tilde en todo `src/`, `index.html` y `public/site.webmanifest`: ninguna coincidencia.
- `npm run build`: correcto.
- `npm test`: correcto; seis pruebas del servicio aprobadas también con ejecución directa.
- `npm run check:routes`: las tres rutas y el layout compartido renderizan correctamente.
- Chromium: 40 estados de interfaz revisados, a 320, 375, 768 y 1440 px. Sin desbordamiento horizontal de página ni del header en las tres rutas y sin errores de consola ni de ejecución.
- Se revisaron menú móvil, modales de deportes, torneos y galería, flujo de reserva con fecha/horario/duración/resumen/confirmación/reinicio, filtros administrativos, detalle de turno, formularios y notificaciones de reserva y bloqueo, y estados sin horarios disponibles.
- No se agregaron dependencias ni pruebas permanentes que reproduzcan los textos de implementación; la comprobación interactiva fue una revisión puntual en navegador.

## Publicación

Los cambios se integran en `main` del repositorio existente mediante el flujo Git autorizado. El workflow de GitHub Actions compila y despliega automáticamente la actualización. La URL de la web se mantiene: https://vigolomarketing-tech.github.io/COUNTRY-CLUB-LONGCHAMPS-/
