# Mi App de Tareas

Aplicación web básica (HTML + CSS + JavaScript puro) sin dependencias ni framework.

## Estructura

```
mi-app/
├── index.html      -> Estructura de la página
├── css/
│   └── styles.css  -> Estilos (comentados línea por línea)
├── js/
│   └── app.js      -> Lógica de la app (comentada línea por línea)
└── README.md
```

## Cómo usarla

1. Abre `index.html` con doble clic en tu navegador. No requiere servidor ni instalación.
2. Escribe una tarea en el campo de texto y pulsa **Agregar** (o Enter).
3. Marca el checkbox para completar una tarea, o pulsa **✕** para eliminarla.
4. Usa los filtros **Todas / Pendientes / Completadas**.
5. Las tareas se guardan en el navegador (`localStorage`), así que siguen ahí al recargar.

## Funcionalidades

- Agregar, completar y eliminar tareas.
- Filtros por estado.
- Limpiar todas las tareas completadas.
- Persistencia automática con `localStorage`.
- Diseño responsive (adaptado a móvil).
- Código completamente comentado en español para aprender.
