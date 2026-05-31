import { servicios, promociones } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    renderizarPromociones();
    renderizarServicios();
    configurarFormularioContacto();
});

function renderizarPromociones() {
    const promocionActiva = promociones.find(p => p.activa);
    if (!promocionActiva) return;

    // Buscar la sección hero para inyectar la alerta justo al inicio
    const heroSection = document.getElementById('inicio');
    if (heroSection) {
        const alertHTML = `
            <div class="container mt-3 fade-in-element" style="position: absolute; top: 80px; left: 0; right: 0; z-index: 100;">
                <div class="alert alert-dismissible fade show text-center shadow-lg" style="background-color: rgba(0, 102, 255, 0.15); border: 1px solid var(--vl-blue); color: #ffffff; backdrop-filter: blur(5px);" role="alert">
                    <span class="badge bg-primary me-2">PROMO</span>
                    <strong>${promocionActiva.titulo}:</strong> ${promocionActiva.descripcion}
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        `;
        heroSection.insertAdjacentHTML('afterbegin', alertHTML);
    }
}

function renderizarServicios() {
    const contenedor = document.getElementById('servicios-grid');
    if (!contenedor) return;

    contenedor.innerHTML = ''; // Aseguramos que el contenedor esté vacío

    servicios.forEach(servicio => {
        // Generar el HTML para las etiquetas
        const etiquetasHTML = servicio.etiquetas.map(etiqueta => 
            `<span class="badge bg-dark border border-secondary mb-1">${etiqueta}</span>`
        ).join('\n                                ');

        // Generar el HTML de la tarjeta completa
        const cardHTML = `
            <div class="col-md-6 col-lg-3">
                <div class="card service-card h-100">
                    <div class="card-body">
                        <div class="service-number">${servicio.id}</div>
                        <h4 class="card-title mt-3">${servicio.titulo}</h4>
                        <div class="mt-3">
                            ${etiquetasHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar en el grid
        contenedor.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function configurarFormularioContacto() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value;
        
        // Simulación visual de envío
        const btnSubmit = form.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;
        
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        btnSubmit.disabled = true;

        // Simulamos un retraso de red de 1.5 segundos
        setTimeout(() => {
            alert(`¡Gracias por contactarnos!\nHemos recibido tu mensaje y pronto te escribiremos a: ${email}`);
            form.reset();
            btnSubmit.innerHTML = textoOriginal;
            btnSubmit.disabled = false;
        }, 1500);
    });
}