import { servicios, promociones } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    renderizarServicios();
    configurarFormularioContacto();
    configurarAnimacionesScroll();
});

function configurarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: si quieres que la animación se repita al subir, descomenta lo siguiente
                // } else {
                //     entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-element').forEach(el => observer.observe(el));
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