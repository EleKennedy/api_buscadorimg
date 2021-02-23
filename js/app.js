const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const paginacion = document.querySelector("#paginacion");

const regPorPag = 40;
let totalPag;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();
  const terminoBusqueda = document.querySelector("#termino").value;
  if (terminoBusqueda === "") {
    mostrarAlerta("Agrega un término de búsqueda ");
    return;
  }
  buscarImagenes();
}
function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector(".bg-red-100");

  if (!existeAlerta) {
    const alerta = document.createElement("p");
    alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center");

    alerta.innerHTML = `
  <strong class="font-bold"> Error</strong>
  <span class="block sm:line">${mensaje}</span>
  `;

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}
function buscarImagenes() {
  const termino = document.querySelector("#termino").value;
  const key = "20378389-de1b8fa54ef80d48759cd2f47";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${regPorPag}&page=${paginaActual}`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
      totalPag = calcularPag(resultado.totalHits);
      mostrarImagenes(resultado.hits);
    });
}
//generador q va a regisrtar la cantidada de elemntos de acuero a las pag
function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}
function calcularPag(total) {
  return parseInt(Math.ceil(total / regPorPag));
}
function mostrarImagenes(imagenes) {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  imagenes.forEach(element => {
    const { previewURL, tags, largeImageURL, likes, views, user } = element;
    resultado.innerHTML += `
      <div class="w-1/2 md:w-1/3 lg:1/4 p-3 mb-4">
        <div class="bg-white">
          <img class="w-full img-border" src="${previewURL}" alt="${tags}">
          <div class="p-4">
            <p class="font-light">Usuario:<span class="font-bold"> ${user}</span></p>
            <p class="font-bold">${likes}<span class="font-light"> Me gusta</span></p>
            <p class="font-bold">${views}<span class="font-light"> Veces vista</span></p>
            <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
          </div>
        </div>
      </div>
     `;
  });
  //limpiar pag previo
  while (paginacion.firstChild) {
    paginacion.removeChild(paginacion.firstChild);
  }
  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPag);
  while (true) {
    const { value, done } = iterador.next();
    if (done) return;
    //caso contrario

    const btn = document.createElement("a");
    btn.href = "#";
    btn.dataset.pagina = value;
    btn.textContent = value;
    btn.classList.add("siguente", "bg-yellow-300", "px-4", "py-1", "mr-2", "font-bold", "mb-4", "rounded");

    btn.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };
    paginacion.appendChild(btn);
  }
}
