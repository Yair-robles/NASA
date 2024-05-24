const apiKey = "KT5njo942UnnY5Vdib0EuZBV56dk1bTwSKomfn8p"; // Reemplaza con tu clave de API
const apodContainer = document.getElementById("apod-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
let currentPage = 1;
const itemsPerPage = 10;
let dates = [];

// Obtener las fechas de los últimos N días
function getLastNDates(n) {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < n; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
}

// Obtener los APODs para un conjunto de fechas
function fetchAPODs(dates) {
    const requests = dates.map((date) =>
        fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
        ).then((response) => response.json())
    );
    return Promise.all(requests);
}

// Mostrar las imágenes y la información en la página
function displayAPODs(apods) {
    apodContainer.innerHTML = "";
    apods.forEach((apod) => {
        const apodItem = document.createElement("div");
        apodItem.className = "card";
        if (apod.media_type === "image") {
            apodItem.innerHTML = `
                <img src="${apod.url}" alt="${apod.title}">
                <div class="card__content">
                    <p class="card__title">${apod.title}</p>
                    <p class="card__description">${apod.date}</p>
                    <p class="card__description">${apod.explanation}</p>
                </div>
            `;
        } else if (apod.media_type === "video") {
            apodItem.innerHTML = `
                <iframe src="${apod.url}?autoplay=1&mute=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                <div class="card__content">
                    <p class="card__title">${apod.title}</p>
                    <p class="card__description">${apod.date}</p>
                    <p class="card__description">${apod.explanation}</p>
                    <a class="card__link-button" href="${apod.url}" target="_blank">Ver Video</a>
                </div>
            `;
        }
        apodContainer.appendChild(apodItem);
        setTimeout(() => {
            apodItem.classList.add("show");
        }, 100);
    });
}

// Manejar la paginación con transición y desplazamiento
function handlePagination() {
    // Ocultar tarjetas actuales
    const currentCards = document.querySelectorAll('.card');
    currentCards.forEach(card => card.classList.remove('show'));

    // Esperar a que las tarjetas se oculten
    setTimeout(() => {
        // Desplazarse hacia arriba
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Esperar a que la página se desplace antes de cargar nuevas tarjetas
        setTimeout(() => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentDates = dates.slice(startIndex, endIndex);
            fetchAPODs(currentDates).then(displayAPODs);
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = endIndex >= dates.length;
        }, 500); // Tiempo para el desplazamiento
    }, 500); // Tiempo para ocultar las tarjetas
}

// Eventos de los botones de paginación
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        handlePagination();
    }
});

nextButton.addEventListener("click", () => {
    if (currentPage * itemsPerPage < dates.length) {
        currentPage++;
        handlePagination();
    }
});

// Inicialización
function init() {
    const totalItems = 100; // Mostrar las últimas 100 imágenes
    dates = getLastNDates(totalItems);
    handlePagination();
}
init();

document.addEventListener('DOMContentLoaded', (event) => {
    Swal.fire({
        title: 'Disfruta de la experiencia completa',
        text: 'Haz clic en "Aceptar" para reproducir la música de fondo.',
        icon: 'info',
        width: 600,
        padding: '3em',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        background: '#fff url(/images/trees.png)',
        customClass: {
            popup: 'custom-popup-class',
            title: 'custom-title-class',
            content: 'custom-content-class',
            confirmButton: 'custom-confirm-button-class',
            cancelButton: 'custom-cancel-button-class'
        },
        backdrop: `
            rgba(0,0,123,0.4)
            url("/images/nyan-cat.gif")
            left top
            no-repeat
        `
    }).then((result) => {
        if (result.isConfirmed) {
            const audio = document.getElementById('background-music');
            audio.loop = true; // Hacer que la música se reproduzca en bucle
            audio.play().catch(error => {
                console.log('No se pudo reproducir la música:', error);
            });
        }
    });
});