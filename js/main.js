/* =========================================================================
   KRYONIX · Interactividad de la web
   Cada bloque es una función independiente. Si una falla, las demás
   siguen funcionando, y es más fácil encontrar dónde está un error.
   ========================================================================= */

// 'use strict' activa un modo más estricto de JS: avisa de errores
// que de otra forma pasarían desapercibidos (por ejemplo, variables sin declarar).
'use strict';

/* -------------------------------------------------------------------------
   1. MENÚ EN MÓVIL
   El botón abre/cierra el menú añadiendo la clase "abierto".
   aria-expanded le dice al lector de pantalla si está abierto o cerrado.
   ------------------------------------------------------------------------- */
function iniciarMenu() {
  const boton = document.querySelector('.nav__boton');
  const menu = document.getElementById('menu');
  if (!boton || !menu) return;  // si no existen en la página, no hacemos nada

  function cerrar() {
    menu.classList.remove('abierto');
    boton.setAttribute('aria-expanded', 'false');
  }

  boton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');  // toggle devuelve true si la ha añadido
    boton.setAttribute('aria-expanded', String(abierto));
  });

  // Al pulsar un enlace del menú, lo cerramos (si no, tapa la sección a la que vamos)
  menu.querySelectorAll('a').forEach((enlace) => enlace.addEventListener('click', cerrar));

  // La tecla Escape también cierra el menú
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cerrar();
  });
}

/* -------------------------------------------------------------------------
   2. PESTAÑAS DE PRODUCTOS
   Todos los paneles están en el HTML; aquí solo mostramos uno y ocultamos el resto
   con el atributo "hidden". También se pueden manejar con las flechas del teclado.
   ------------------------------------------------------------------------- */
function iniciarPestanas() {
  const pestanas = Array.from(document.querySelectorAll('[role="tab"]'));
  if (pestanas.length === 0) return;

  function activar(pestana) {
    pestanas.forEach((p) => {
      const seleccionada = p === pestana;
      p.setAttribute('aria-selected', String(seleccionada));
      // tabindex -1: solo la pestaña activa se alcanza con Tab; entre pestañas se usan las flechas
      p.tabIndex = seleccionada ? 0 : -1;
      document.getElementById(p.getAttribute('aria-controls')).hidden = !seleccionada;
    });
  }

  pestanas.forEach((pestana, i) => {
    pestana.addEventListener('click', () => activar(pestana));

    pestana.addEventListener('keydown', (evento) => {
      let siguiente = null;
      if (evento.key === 'ArrowRight') siguiente = pestanas[(i + 1) % pestanas.length];
      if (evento.key === 'ArrowLeft') siguiente = pestanas[(i - 1 + pestanas.length) % pestanas.length];
      if (siguiente) {
        evento.preventDefault();
        activar(siguiente);
        siguiente.focus();
      }
    });
  });
}

/* -------------------------------------------------------------------------
   3. MÓDULOS SEGÚN EL TIPO DE NEGOCIO
   Cada módulo tiene data-sectores="taller clinica ...". Al elegir un sector,
   marcamos como "recomendado" los que lo incluyen y atenuamos el resto.
   ------------------------------------------------------------------------- */
function iniciarFiltroSectores() {
  const botones = document.querySelectorAll('[data-sector]');
  const modulos = document.querySelectorAll('.modulo');
  if (botones.length === 0) return;

  botones.forEach((boton) => {
    boton.addEventListener('click', () => {
      const sector = boton.dataset.sector;  // dataset.sector lee el atributo data-sector

      botones.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));

      modulos.forEach((modulo) => {
        const sectores = modulo.dataset.sectores.split(' ');
        const recomendado = sector !== 'todos' && sectores.includes(sector);
        modulo.classList.toggle('recomendado', recomendado);
        modulo.classList.toggle('atenuado', sector !== 'todos' && !recomendado);
      });
    });
  });
}

/* -------------------------------------------------------------------------
   4. DEMO DE PANELES DE DATOS
   Los datos están separados de la lógica: si queréis cambiar un número o
   añadir un panel, solo tocáis este objeto, no el código que dibuja.
   s = semana, m = mes. up: true sube (verde), false baja (naranja), null neutro.
   ------------------------------------------------------------------------- */
const PANELES = {
  ventas: {
    nombre: 'Ventas',
    pregunta: '¿Cuánto estoy facturando y qué es lo que más vendo?',
    euros: true,
    grafica: 'Facturado por',
    listaTitulo: 'Lo que más se vende',
    kpis: [
      { l: 'Facturado', s: '4.260 €', m: '17.900 €', ds: '▲ 12 % vs semana pasada', dm: '▲ 8 % vs mes pasado', up: true },
      { l: 'Ventas y servicios', s: '58', m: '241', ds: '▲ 6 vs semana pasada', dm: '▲ 19 vs mes pasado', up: true },
      { l: 'Ticket medio', s: '73 €', m: '74 €', ds: '▼ 3 % vs semana pasada', dm: '▼ 1 % vs mes pasado', up: false },
      { l: 'Pendiente de cobro', s: '640 €', m: '1.420 €', ds: '3 clientes', dm: '7 clientes', up: null }
    ],
    barrasSemana: [620, 840, 510, 930, 1060, 300],
    barrasMes: [3900, 4650, 4300, 5050],
    listaSemana: [['Servicio A', 21], ['Servicio B', 14], ['Producto C', 12], ['Producto D', 7]],
    listaMes: [['Servicio A', 88], ['Servicio B', 61], ['Producto C', 49], ['Producto D', 31]],
    aviso: 'Aviso: 3 clientes tienen pagos pendientes de más de 30 días.'
  },
  reservas: {
    nombre: 'Reservas',
    pregunta: '¿Qué días y horas se llenan, y cuáles se quedan vacías?',
    euros: false,
    grafica: 'Citas por',
    listaTitulo: 'Ocupación por franja horaria',
    kpis: [
      { l: 'Citas', s: '86', m: '352', ds: '▲ 9 % vs semana pasada', dm: '▲ 6 % vs mes pasado', up: true },
      { l: 'Ocupación', s: '78 %', m: '74 %', ds: '▲ 4 puntos', dm: '▲ 2 puntos', up: true },
      { l: 'No presentados', s: '5', m: '19', ds: '▲ 2 vs semana pasada', dm: '▼ 3 vs mes pasado', up: false },
      { l: 'Clientes nuevos', s: '11', m: '41', ds: '▲ 3 vs semana pasada', dm: '▲ 8 vs mes pasado', up: true }
    ],
    barrasSemana: [12, 9, 14, 16, 21, 14],
    barrasMes: [82, 88, 84, 98],
    listaSemana: [['Mañanas (9–13 h)', '91 %'], ['Mediodía (13–16 h)', '52 %'], ['Tardes (16–20 h)', '84 %'], ['Sábados', '97 %']],
    listaMes: [['Mañanas (9–13 h)', '88 %'], ['Mediodía (13–16 h)', '49 %'], ['Tardes (16–20 h)', '81 %'], ['Sábados', '95 %']],
    aviso: 'Idea: el mediodía está a la mitad. Buen momento para una oferta o para citas rápidas.'
  },
  stock: {
    nombre: 'Stock',
    pregunta: '¿Qué se gasta más y qué tengo que pedir ya?',
    euros: false,
    grafica: 'Unidades gastadas por',
    listaTitulo: 'Lo que más se gasta',
    kpis: [
      { l: 'Valor del stock', s: '12.480 €', m: '12.480 €', ds: 'Hoy', dm: 'Hoy', up: null },
      { l: 'Bajo mínimo', s: '4', m: '4', ds: 'productos a pedir', dm: 'productos a pedir', up: false },
      { l: 'Pedidos pendientes', s: '2', m: '6', ds: 'por recibir', dm: 'en el mes', up: null },
      { l: 'Sin movimiento', s: '17', m: '17', ds: 'productos en 90 días', dm: 'productos en 90 días', up: false }
    ],
    barrasSemana: [34, 41, 28, 46, 52, 19],
    barrasMes: [198, 224, 211, 236],
    listaSemana: [['Producto A', 48], ['Producto B', 36], ['Producto C', 22], ['Producto D', 15]],
    listaMes: [['Producto A', 196], ['Producto B', 151], ['Producto C', 93], ['Producto D', 64]],
    aviso: 'Aviso: 4 productos por debajo del mínimo. Mira a qué proveedor se los sueles pedir.'
  },
  clientes: {
    nombre: 'Clientes',
    pregunta: '¿Mis clientes repiten? ¿Quién lleva tiempo sin venir?',
    euros: false,
    grafica: 'Clientes atendidos por',
    listaTitulo: 'Cómo nos conocieron',
    kpis: [
      { l: 'Clientes atendidos', s: '64', m: '248', ds: '▲ 7 % vs semana pasada', dm: '▲ 5 % vs mes pasado', up: true },
      { l: 'Repiten', s: '71 %', m: '68 %', ds: '▲ 3 puntos', dm: '▲ 1 punto', up: true },
      { l: 'Clientes nuevos', s: '11', m: '41', ds: '▲ 3 vs semana pasada', dm: '▲ 8 vs mes pasado', up: true },
      { l: 'Sin volver', s: '18', m: '18', ds: 'más de 6 meses', dm: 'más de 6 meses', up: false }
    ],
    barrasSemana: [9, 11, 8, 12, 16, 8],
    barrasMes: [57, 63, 60, 68],
    listaSemana: [['Recomendación', 5], ['Google', 3], ['Redes sociales', 2], ['Pasaba por delante', 1]],
    listaMes: [['Recomendación', 17], ['Google', 12], ['Redes sociales', 8], ['Pasaba por delante', 4]],
    aviso: 'Idea: 18 clientes llevan más de 6 meses sin venir. Mándales un recordatorio.'
  },
  equipo: {
    nombre: 'Equipo',
    pregunta: '¿Cuántas horas trabajamos y cuántas se facturan?',
    euros: false,
    grafica: 'Horas facturadas por',
    listaTitulo: 'Horas facturadas por persona',
    kpis: [
      { l: 'Horas trabajadas', s: '118 h', m: '486 h', ds: '3 personas', dm: '3 personas', up: null },
      { l: 'Horas facturadas', s: '94 h', m: '371 h', ds: '▲ 6 % vs semana pasada', dm: '▲ 2 % vs mes pasado', up: true },
      { l: 'Aprovechamiento', s: '80 %', m: '76 %', ds: '▲ 3 puntos', dm: '▼ 1 punto', up: true },
      { l: 'Trabajos por persona', s: '8', m: '31', ds: 'de media', dm: 'de media', up: null }
    ],
    barrasSemana: [17, 18, 15, 19, 20, 5],
    barrasMes: [88, 95, 90, 98],
    listaSemana: [['Ana', '36 h'], ['Luis', '31 h'], ['Marta', '27 h']],
    listaMes: [['Ana', '141 h'], ['Luis', '124 h'], ['Marta', '106 h']],
    aviso: 'Aviso: el miércoles hubo 6 h sin trabajo asignado.'
  }
};

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const SEMANAS = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];

function iniciarDemo() {
  const contenedorPaneles = document.getElementById('demo-paneles');
  if (!contenedorPaneles) return;

  // "Estado" de la demo: qué panel y qué periodo están elegidos.
  // Cada vez que cambia, llamamos a dibujar() y la pantalla se actualiza.
  const estado = { panel: 'ventas', periodo: 'semana' };

  // Referencias a los huecos del HTML que vamos a rellenar
  const el = {
    pregunta: document.getElementById('demo-pregunta'),
    kpis: document.getElementById('demo-kpis'),
    graficaTitulo: document.getElementById('demo-grafica-titulo'),
    grafica: document.getElementById('demo-grafica'),
    listaTitulo: document.getElementById('demo-lista-titulo'),
    lista: document.getElementById('demo-lista'),
    aviso: document.getElementById('demo-aviso')
  };

  // Creamos un botón por cada panel a partir de los datos (Object.entries da pares [clave, valor])
  Object.entries(PANELES).forEach(([clave, panel]) => {
    const boton = crear('button', 'pildora', panel.nombre);
    boton.type = 'button';
    boton.dataset.panel = clave;
    boton.addEventListener('click', () => { estado.panel = clave; dibujar(); });
    contenedorPaneles.appendChild(boton);
  });

  document.querySelectorAll('[data-periodo]').forEach((boton) => {
    boton.addEventListener('click', () => { estado.periodo = boton.dataset.periodo; dibujar(); });
  });

  function dibujar() {
    const p = PANELES[estado.panel];
    const semana = estado.periodo === 'semana';

    // Botones: marcamos el activo
    contenedorPaneles.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.panel === estado.panel)));
    document.querySelectorAll('[data-periodo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.periodo === estado.periodo)));

    // textContent (y no innerHTML) para meter texto: es más seguro porque
    // nunca interpreta el texto como HTML
    el.pregunta.textContent = p.pregunta;
    el.graficaTitulo.textContent = `${p.grafica} ${semana ? 'día' : 'semana'}`;
    el.listaTitulo.textContent = p.listaTitulo;
    el.aviso.textContent = p.aviso;

    // KPIs: replaceChildren() vacía el contenedor y mete los nuevos elementos
    el.kpis.replaceChildren(...p.kpis.map((k) => {
      const tarjeta = crear('div', 'kpi');
      const clase = k.up === true ? 'kpi__cambio kpi__cambio--sube' : k.up === false ? 'kpi__cambio kpi__cambio--baja' : 'kpi__cambio';
      tarjeta.append(
        crear('div', 'kpi__etiqueta', k.l),
        crear('div', 'kpi__valor', semana ? k.s : k.m),
        crear('div', clase, semana ? k.ds : k.dm)
      );
      return tarjeta;
    }));

    // Gráfica de barras: la altura de cada barra es su valor dividido entre el máximo
    const valores = semana ? p.barrasSemana : p.barrasMes;
    const etiquetas = semana ? DIAS : SEMANAS;
    const maximo = Math.max(...valores);
    const rellenos = [];

    el.grafica.replaceChildren(...valores.map((valor, i) => {
      const barra = crear('div', 'barra');
      barra.title = `${etiquetas[i]}: ${formatear(valor, p.euros)}`;   // tooltip al pasar el ratón
      const relleno = crear('div', 'barra__relleno');
      relleno.dataset.altura = `${Math.round((valor / maximo) * 85)}%`;
      rellenos.push(relleno);
      barra.append(crear('span', 'barra__valor', abreviar(valor, p.euros)), relleno, crear('span', 'barra__etiqueta', etiquetas[i]));
      return barra;
    }));

    // Ponemos la altura un fotograma después de crear las barras para que
    // la transición CSS se vea (de 0 a su altura). requestAnimationFrame
    // espera al siguiente dibujado del navegador.
    requestAnimationFrame(() => {
      rellenos.forEach((r) => { r.style.height = r.dataset.altura; });
    });

    // Lista con barras horizontales. Algunos valores son texto ("91 %"),
    // así que con parseFloat sacamos el número para calcular el ancho.
    const filas = semana ? p.listaSemana : p.listaMes;
    const maxLista = Math.max(...filas.map((f) => parseFloat(f[1])));
    el.lista.replaceChildren(...filas.map(([nombre, valor]) => {
      const li = document.createElement('li');
      const cabecera = crear('div', 'ranking__fila');
      cabecera.append(crear('span', '', nombre), crear('span', '', String(valor)));
      const pista = crear('div', 'ranking__pista');
      const barra = crear('div', 'ranking__barra');
      barra.style.width = `${Math.round((parseFloat(valor) / maxLista) * 100)}%`;
      pista.appendChild(barra);
      li.append(cabecera, pista);
      return li;
    }));
  }

  dibujar();  // primer dibujo al cargar la página
}

/* -------------------------------------------------------------------------
   5. PRECIOS: MENSUAL / ANUAL
   Cada precio guarda sus dos versiones en data-mensual y data-anual.
   ------------------------------------------------------------------------- */
function iniciarPrecios() {
  const botones = document.querySelectorAll('[data-ciclo]');
  const textos = document.querySelectorAll('[data-mensual]');

  botones.forEach((boton) => {
    boton.addEventListener('click', () => {
      const ciclo = boton.dataset.ciclo;  // "mensual" o "anual"
      botones.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
      textos.forEach((t) => { t.textContent = t.dataset[ciclo]; });
    });
  });
}

/* -------------------------------------------------------------------------
   6. FORMULARIO DE CONTACTO
   Lo enviamos con fetch() para no salir de la página y mostrar un mensaje.
   Si el JS no funciona, el formulario se envía igualmente de forma normal.
   ------------------------------------------------------------------------- */
function iniciarFormulario() {
  const formulario = document.getElementById('formulario');
  const estadoEnvio = document.getElementById('formulario-estado');
  if (!formulario) return;

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();  // evitamos que el navegador cambie de página

    // Aviso mientras no esté configurado Formspree
    if (formulario.action.includes('TU_ID_DE_FORMSPREE')) {
      mostrar('Falta configurar el envío del formulario (ver README).', 'error');
      return;
    }

    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;
    mostrar('Enviando…', '');

    // try/catch: si falla la conexión, capturamos el error en vez de que la web se rompa
    try {
      const respuesta = await fetch(formulario.action, {
        method: 'POST',
        body: new FormData(formulario),          // recoge todos los campos con "name"
        headers: { Accept: 'application/json' }
      });
      if (!respuesta.ok) throw new Error('Respuesta ' + respuesta.status);
      formulario.reset();
      mostrar('¡Gracias! Hemos recibido tu mensaje y te escribimos pronto.', 'ok');
    } catch (error) {
      console.error(error);
      mostrar('No se ha podido enviar. Escríbenos directamente al email de la izquierda.', 'error');
    } finally {
      boton.disabled = false;  // "finally" se ejecuta siempre, haya ido bien o mal
    }
  });

  function mostrar(texto, tipo) {
    estadoEnvio.textContent = texto;
    estadoEnvio.className = 'formulario__estado ' + tipo;
  }
}

/* -------------------------------------------------------------------------
   AYUDANTES (funciones pequeñas que usamos varias veces)
   ------------------------------------------------------------------------- */

// Crea un elemento con una clase y un texto en una sola línea
function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

// 4260 -> "4.260 €" (toLocaleString pone los puntos de miles a la española)
function formatear(numero, euros) {
  return numero.toLocaleString('es-ES') + (euros ? ' €' : '');
}

// 4260 -> "4,3k" para que quepa encima de la barra
function abreviar(numero, euros) {
  if (euros && numero >= 1000) return (numero / 1000).toFixed(1).replace('.', ',') + 'k';
  return String(numero);
}

/* -------------------------------------------------------------------------
   ARRANQUE
   Como el <script> lleva "defer", cuando llega aquí el HTML ya está cargado.
   ------------------------------------------------------------------------- */
iniciarMenu();
iniciarPestanas();
iniciarFiltroSectores();
iniciarDemo();
iniciarPrecios();
iniciarFormulario();
document.getElementById('anio').textContent = new Date().getFullYear();
