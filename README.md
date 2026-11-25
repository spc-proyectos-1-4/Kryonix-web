# Web de Kryonix

La web de Kryonix, hecha con HTML, CSS y JavaScript, sin frameworks ni librerías.

## Estructura

```
kryonix-site/
├── index.html         ← la página: estructura y textos
├── css/styles.css     ← el diseño: colores, tamaños, adaptación a móvil
├── js/main.js         ← lo interactivo: menú, pestañas, demo, precios, formulario
├── img/               ← logo (SVG), favicon e iconos (PNG)
├── privacidad.html    ← política de privacidad (PLANTILLA, hay que completarla)
└── aviso-legal.html   ← aviso legal (PLANTILLA, hay que completarla)
```

Cada archivo hace una sola cosa: el HTML dice **qué hay**, el CSS **cómo se ve** y el JS **cómo se comporta**. Así, para cambiar un color no tocáis el HTML, y para cambiar un texto no tocáis el JS.

## Cómo verla en vuestro ordenador

1. Abrid la carpeta en Visual Studio Code.
2. Instalad la extensión **Live Server**.
3. Clic derecho en `index.html` → **Open with Live Server**. Cada vez que guardéis, el navegador se recarga solo.

(También vale con hacer doble clic en `index.html`, pero sin recarga automática.)

## Qué falta antes de publicarla

- [ ] **Precios**: buscad `[PRECIO]` en `index.html`. En los planes hay que cambiar también los atributos `data-mensual` y `data-anual`.
- [ ] **Páginas legales**: completad los `[DATOS]` de `privacidad.html` y `aviso-legal.html` y revisadlas con vuestro gestor. Son obligatorias en España si la web recoge datos (RGPD y LSSI).
- [ ] **Frase "respondemos en un día laborable"**: confirmad que la podéis cumplir.

## Cómo publicarla

**Opción fácil: Netlify**
1. Entrad en https://app.netlify.com/drop.
2. Arrastrad la carpeta `kryonix-site` entera.
3. En unos segundos tenéis una dirección pública (algo como `kryonix.netlify.app`).

**Opción con Git: GitHub Pages**
1. Subid la carpeta a un repositorio de GitHub.
2. Settings → Pages → elegid la rama `main`.
3. La web queda en `vuestro-usuario.github.io/kryonix-site`. Cada `git push` la actualiza.

**Dominio propio** (kryonix.es, por ejemplo): se compra en un registrador (DonDominio, Namecheap…) por unos 10 € al año y se conecta a Netlify o GitHub Pages desde sus ajustes.

## Cómo cambiar cosas habituales

| Quiero cambiar… | Dónde |
|---|---|
| Un texto | `index.html` |
| Un color de toda la web | `css/styles.css`, bloque `:root` (variables) |
| Los números de la demo | `js/main.js`, objeto `PANELES` |
| Qué módulos se recomiendan a cada sector | `index.html`, atributo `data-sectores` de cada módulo |
| Una pregunta frecuente | `index.html`, sección `#faq` (un `<details>` por pregunta) |
