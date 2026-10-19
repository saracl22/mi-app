/* ==========================================================
   ARCHIVO: app.js
   Descripción: Lógica de la aplicación de tareas.
   Cada línea está comentada para facilitar el aprendizaje.
   ========================================================== */

/* ---------- Datos de la aplicación ---------- */

/* Clave que usaremos para guardar las tareas en el navegador */
const CLAVE_ALMACEN = "mi-app-tareas";

/* Estado de la aplicación: guarda las tareas y el filtro activo */
const estado = {
    /* Lista de tareas. Cada tarea es un objeto { id, texto, completada } */
    tareas: [],
    /* Filtro actualmente seleccionado: "todas", "pendientes" o "completadas" */
    filtro: "todas"
};

/* ---------- Referencias al DOM (elementos de la página) ---------- */

/* Obtiene el formulario de agregar tarea */
const formulario = document.getElementById("formTarea");

/* Obtiene el campo de texto donde se escribe la tarea */
const inputTarea = document.getElementById("inputTarea");

/* Obtiene la lista <ul> donde se muestran las tareas */
const listaTareas = document.getElementById("listaTareas");

/* Obtiene el párrafo del mensaje de lista vacía */
const mensajeVacio = document.getElementById("mensajeVacio");

/* Obtiene el contenedor de los botones de filtro */
const contenedorFiltros = document.getElementById("filtros");

/* Obtiene el botón de limpiar tareas completadas */
const btnLimpiar = document.getElementById("limpiarCompletadas");

/* Obtiene el elemento que muestra el contador de tareas */
const contador = document.getElementById("contador");

/* Obtiene el elemento que muestra la fecha actual */
const fechaActual = document.getElementById("fechaActual");

/* ---------- Funciones de utilidad ---------- */

/* Genera un identificador único para cada tarea */
function generarId() {
    /* Devuelve un número aleatorio grande junto con la fecha actual */
    return Date.now() + Math.random().toString(16).slice(2);
}

/* Muestra la fecha de hoy en formato largo en español */
function mostrarFecha() {
    /* Crea una fecha con el día de hoy */
    const hoy = new Date();

    /* Define las opciones de formato en español */
    const opciones = {
        /* Día de la semana con nombre completo */
        weekday: "long",
        /* Mes con nombre completo */
        month: "long",
        /* Día numérico del mes */
        day: "numeric",
        /* Año con 4 cifras */
        year: "numeric"
    };

    /* Escribe la fecha formateada dentro del elemento del HTML */
    fechaActual.textContent = hoy.toLocaleDateString("es-ES", opciones);
}

/* ---------- Guardar y cargar tareas (localStorage) ---------- */

/* Lee las tareas guardadas en el navegador y las carga en memoria */
function cargarTareas() {
    /* Lee el texto guardado con la clave definida arriba */
    const guardado = localStorage.getItem(CLAVE_ALMACEN);

    /* Si no hay nada guardado, no se hace nada más */
    if (!guardado) {
        return;
    }

    /* Convierte el texto JSON guardado en un array de tareas */
    try {
        estado.tareas = JSON.parse(guardado);
    } catch (error) {
        /* Si el JSON está corrupto, se avisa por consola y se deja vacío */
        console.error("No se pudieron leer las tareas guardadas:", error);
        estado.tareas = [];
    }
}

/* Guarda el estado actual de tareas en el navegador */
function guardarTareas() {
    /* Convierte el array de tareas a texto JSON y lo almacena */
    localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(estado.tareas));
}

/* ---------- Filtrar y pintar las tareas ---------- */

/* Devuelve las tareas que corresponden al filtro activo */
function obtenerTareasFiltradas() {
    /* Si el filtro es "todas", se devuelven todas las tareas */
    if (estado.filtro === "todas") {
        return estado.tareas;
    }

    /* Si el filtro es "pendientes", se devuelven las no completadas */
    if (estado.filtro === "pendientes") {
        return estado.tareas.filter((tarea) => !tarea.completada);
    }

    /* En cualquier otro caso, se devuelven las completadas */
    return estado.tareas.filter((tarea) => tarea.completada);
}

/* Dibuja las tareas en la lista del HTML */
function renderizarTareas() {
    /* Vacía la lista para poder repintarla desde cero */
    listaTareas.innerHTML = "";

    /* Obtiene las tareas ya filtradas */
    const tareas = obtenerTareasFiltradas();

    /* Recorre cada tarea y crea su elemento en la lista */
    tareas.forEach((tarea) => {
        /* Crea un elemento <li> para la tarea */
        const li = document.createElement("li");

        /* Añade la clase base de tarea */
        li.classList.add("tarea");

        /* Si está completada, añade la clase que la atenúa */
        if (tarea.completada) {
            li.classList.add("tarea--completada");
        }

        /* Crea el checkbox para marcar la tarea como completada */
        const check = document.createElement("input");

        /* El checkbox es de tipo "checkbox" */
        check.type = "checkbox";

        /* Le asignamos la clase del CSS */
        check.classList.add("tarea__check");

        /* Guardamos el id de la tarea en el checkbox para poder recuperarlo */
        check.dataset.id = tarea.id;

        /* Marcamos el checkbox si la tarea ya está completada */
        check.checked = tarea.completada;

        /* Al cambiar el checkbox, se llama a la función que alterna el estado */
        check.addEventListener("change", () => alternarTarea(tarea.id));

        /* Crea el elemento <span> que muestra el texto de la tarea */
        const texto = document.createElement("span");

        /* Le asignamos la clase del CSS */
        texto.classList.add("tarea__texto");

        /* Ponemos dentro el texto plano de la tarea */
        texto.textContent = tarea.texto;

        /* Si está completada, el texto aparece tachado */
        if (tarea.completada) {
            texto.classList.add("tarea__texto--tachado");
        }

        /* Crea el botón para eliminar la tarea */
        const botonEliminar = document.createElement("button");

        /* El botón es de tipo "button" para no enviar el formulario */
        botonEliminar.type = "button";

        /* Le asignamos la clase del CSS */
        botonEliminar.classList.add("tarea__eliminar");

        /* Texto del botón: una "X" */
        botonEliminar.textContent = "✕";

        /* Etiqueta accesible para lectores de pantalla */
        botonEliminar.setAttribute("aria-label", "Eliminar tarea");

        /* Al hacer clic, se elimina la tarea con ese id */
        botonEliminar.addEventListener("click", () => eliminarTarea(tarea.id));

        /* Añade el checkbox al <li> */
        li.appendChild(check);

        /* Añade el texto al <li> */
        li.appendChild(texto);

        /* Añade el botón de eliminar al <li> */
        li.appendChild(botonEliminar);

        /* Añade el <li> completo a la lista de la página */
        listaTareas.appendChild(li);
    });

    /* Actualiza el mensaje de "no hay tareas" según corresponda */
    actualizarMensajeVacio(tareas.length === 0);

    /* Actualiza el contador de tareas del pie de página */
    actualizarContador();
}

/* Muestra u oculta el mensaje de lista vacía */
function actualizarMensajeVacio(mostrar) {
    /* Si se pide mostrar, se quita la clase "oculto" */
    if (mostrar) {
        mensajeVacio.classList.remove("oculto");
    } else {
        /* Si no, se añade la clase "oculto" */
        mensajeVacio.classList.add("oculto");
    }
}

/* Actualiza el texto del contador con el total de tareas */
function actualizarContador() {
    /* Cuenta cuántas hay en total y cuántas están completadas */
    const total = estado.tareas.length;
    const completadas = estado.tareas.filter((tarea) => tarea.completada).length;

    /* Escribe el texto con el formato "3 tareas (1 completada)" */
    contador.textContent = `${total} tarea${total === 1 ? "" : "s"} (${completadas} completada${completadas === 1 ? "" : "s"})`;
}

/* ---------- Acciones sobre las tareas ---------- */

/* Agrega una tarea nueva al estado y repinta la lista */
function agregarTarea(texto) {
    /* Crea el objeto de la tarea con un id único */
    estado.tareas.push({
        /* Identificador único */
        id: generarId(),
        /* Texto de la tarea */
        texto: texto,
        /* Por defecto empieza sin completar */
        completada: false
    });

    /* Guarda los cambios en el navegador */
    guardarTareas();

    /* Vuelve a pintar la lista para que aparezca la tarea nueva */
    renderizarTareas();
}

/* Marca o desmarca una tarea como completada */
function alternarTarea(id) {
    /* Busca la tarea dentro del estado */
    const tarea = estado.tareas.find((item) => item.id === id);

    /* Si no se encuentra, no se hace nada */
    if (!tarea) {
        return;
    }

    /* Invierte el valor de "completada" */
    tarea.completada = !tarea.completada;

    /* Guarda los cambios */
    guardarTareas();

    /* Repinta la lista para ver el tachado y actualizar el contador */
    renderizarTareas();

    /* Devuelve el foco al checkbox de esa tarea (se recreó al repintar) */
    const nuevoCheck = document.querySelector(`.tarea__check[data-id="${id}"]`);

    /* Solo lo enfoca si la tarea sigue visible con el filtro actual */
    if (nuevoCheck) {
        nuevoCheck.focus();
    }
}

/* Elimina una tarea del estado */
function eliminarTarea(id) {
    /* Crea un nuevo array sin la tarea que tiene ese id */
    estado.tareas = estado.tareas.filter((tarea) => tarea.id !== id);

    /* Guarda los cambios */
    guardarTareas();

    /* Repinta la lista para quitar la tarea de la pantalla */
    renderizarTareas();

    /* Devuelve el foco al campo de texto para seguir escribiendo */
    inputTarea.focus();
}

/* Elimina todas las tareas que ya están completadas */
function limpiarCompletadas() {
    /* Se queda solo con las tareas que NO están completadas */
    estado.tareas = estado.tareas.filter((tarea) => !tarea.completada);

    /* Guarda los cambios */
    guardarTareas();

    /* Repinta la lista para mostrar el resultado */
    renderizarTareas();
}

/* ---------- Eventos (interacciones del usuario) ---------- */

/* Escucha el envío del formulario para agregar tareas */
formulario.addEventListener("submit", (evento) => {
    /* Evita que la página se recargue al enviar el formulario */
    evento.preventDefault();

    /* Toma el valor del campo de texto y quita los espacios sobrantes */
    const texto = inputTarea.value.trim();

    /* Si el texto está vacío, no se hace nada */
    if (texto === "") {
        return;
    }

    /* Agrega la tarea al estado (esto también repinta la lista) */
    agregarTarea(texto);

    /* Limpia el campo de texto para escribir la siguiente tarea */
    inputTarea.value = "";

    /* Vuelve a poner el foco en el campo de texto */
    inputTarea.focus();
});

/* Escucha los clics en la barra de filtros */
contenedorFiltros.addEventListener("click", (evento) => {
    /* Solo reacciona si el elemento pulsado es un botón de filtro */
    if (!evento.target.classList.contains("filtro")) {
        return;
    }

    /* Si es el botón de limpiar completadas, ejecuta esa acción */
    if (evento.target === btnLimpiar) {
        /* Borra las tareas completadas */
        limpiarCompletadas();

        /* Sale de la función para no seguir con el cambio de filtro */
        return;
    }

    /* Actualiza el filtro activo con el valor del botón pulsado */
    estado.filtro = evento.target.dataset.filtro;

    /* Quita la clase activa de todos los botones */
    document.querySelectorAll(".filtro").forEach((boton) => {
        boton.classList.remove("filtro--activo");
    });

    /* Añade la clase activa al botón pulsado */
    evento.target.classList.add("filtro--activo");

    /* Repinta la lista con el nuevo filtro aplicado */
    renderizarTareas();
});

/* ---------- Inicialización ---------- */

/* Función que se ejecuta al cargar la página */
function iniciar() {
    /* Muestra la fecha de hoy */
    mostrarFecha();

    /* Carga las tareas guardadas previamente */
    cargarTareas();

    /* Pinta las tareas en la pantalla */
    renderizarTareas();

    /* Pone el foco en el campo de texto al abrir la app */
    inputTarea.focus();
}

/* Ejecuta la función de inicio cuando el HTML ya está listo */
document.addEventListener("DOMContentLoaded", iniciar);
