import { servicios, promociones } from './database.js';

// Exponemos la función al objeto global para que funcione con el onclick de los botones HTML
window.abrirModalServicio = function (index) {
    const servicio = servicios[index];
    document.getElementById('servicioModalLabel').textContent = servicio.id + " - " + servicio.titulo;

    // Generar etiquetas
    const etiquetasHTML = servicio.etiquetas.map(etiqueta =>
        `<span class="badge bg-dark border border-secondary mb-2 me-1">${etiqueta}</span>`
    ).join('');

    document.getElementById('modal-etiquetas').innerHTML = etiquetasHTML;
    document.getElementById('modal-descripcion').innerHTML = servicio.descripcion;
};

document.addEventListener('DOMContentLoaded', async () => {
    await cargarComponentes();

    renderizarServicios();
    configurarFormularioContacto();
    configurarAnimacionesScroll();
    configurarBurbujaChat();
});

async function cargarComponentes() {
    const componentes = [
        { id: 'comp-navbar', url: 'components/navbar.html' },
        { id: 'comp-hero', url: 'components/hero.html' },
        { id: 'comp-descuentos', url: 'components/descuentos.html' },
        { id: 'comp-nosotros', url: 'components/nosotros.html' },
        { id: 'comp-mision', url: 'components/mision.html' },
        { id: 'comp-servicios', url: 'components/servicios.html' },
        { id: 'comp-galeria', url: 'components/galeria.html' },
        { id: 'comp-beneficios', url: 'components/beneficios.html' },
        { id: 'comp-faq', url: 'components/faq.html' },
        { id: 'comp-footer', url: 'components/footer.html' },
        { id: 'comp-modal', url: 'components/modal.html' }
    ];

    for (const comp of componentes) {
        try {
            const response = await fetch(comp.url);
            if (response.ok) {
                const html = await response.text();
                document.getElementById(comp.id).innerHTML = html;
            } else {
                console.error(`Error cargando componente ${comp.url}:`, response.status);
            }
        } catch (error) {
            console.error(`Error de red al cargar ${comp.url}:`, error);
        }
    }
}

function configurarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Observar elementos dinámicos después de cargar componentes
    setTimeout(() => {
        document.querySelectorAll('.fade-in-element').forEach(el => observer.observe(el));
    }, 500);
}


function renderizarServicios() {
    const contenedor = document.getElementById('servicios-grid');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    servicios.forEach((servicio, index) => {
        const etiquetasHTML = servicio.etiquetas.map(etiqueta =>
            `<span class="badge bg-dark border border-secondary mb-1 me-1">${etiqueta}</span>`
        ).join('');

        // Tarjetas oscuras elegantes sin imagen de fondo
        const cardHTML = `
            <div class="col-md-6 col-lg-4">
                <div class="card service-card h-100 overflow-hidden border-secondary" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#servicioModal" onclick="abrirModalServicio(${index})">
                    <div class="card-body position-relative p-4">
                        <div class="service-number">${servicio.id}</div>
                        <h4 class="card-title mt-3" style="color: #ffffff;">${servicio.titulo}</h4>
                        <div class="mt-3">
                            ${etiquetasHTML}
                        </div>
                        <div class="mt-4 pt-3 border-top border-secondary text-end">
                            <span style="color: #0066ff; font-size: 0.9rem; font-weight: bold;">Leer más <span aria-hidden="true">&rarr;</span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        contenedor.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function configurarFormularioContacto() {
    // Al cargar componentes dinámicamente, necesitamos esperar a que existan en el DOM
    setTimeout(() => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]').value;

            const btnSubmit = form.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit.innerHTML;

            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            btnSubmit.disabled = true;

            setTimeout(() => {
                alert(`¡Gracias por contactarnos!\nHemos recibido tu mensaje y pronto te escribiremos a: ${email}`);
                form.reset();
                btnSubmit.innerHTML = textoOriginal;
                btnSubmit.disabled = false;
            }, 1500);
        });
    }, 500);
}

function configurarBurbujaChat() {
    const btn = document.getElementById('chat-bubble-btn');
    const panel = document.getElementById('chat-panel');
    const closeBtn = document.getElementById('chat-close-btn');
    const form = document.getElementById('floating-chat-form');
    const statusDiv = document.getElementById('chat-status');
    const submitBtn = document.getElementById('chat-submit-btn');

    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
        if (panel.classList.contains('d-none')) {
            panel.classList.remove('d-none');
        } else {
            panel.classList.add('d-none');
        }
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.add('d-none');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('chat-name').value;
        const email = document.getElementById('chat-email').value;
        const message = document.getElementById('chat-message').value;
        const fileInput = document.getElementById('chat-file');

        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        submitBtn.disabled = true;
        statusDiv.classList.remove('d-none');
        statusDiv.textContent = 'Procesando archivo...';
        statusDiv.className = 'mt-2 text-center small text-info';

        let fileData = null;
        let fileName = '';
        let mimeType = '';

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            if (file.size > 5 * 1024 * 1024) {
                statusDiv.textContent = 'Error: El archivo excede los 5MB permitidos.';
                statusDiv.className = 'mt-2 text-center small text-danger';
                submitBtn.innerHTML = 'Enviar a VectorLab';
                submitBtn.disabled = false;
                return;
            }
            
            fileName = file.name;
            mimeType = file.type;
            
            try {
                fileData = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64String = reader.result.split(',')[1];
                        resolve(base64String);
                    };
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
            } catch (error) {
                statusDiv.textContent = 'Error al leer el archivo.';
                statusDiv.className = 'mt-2 text-center small text-danger';
                submitBtn.innerHTML = 'Enviar a VectorLab';
                submitBtn.disabled = false;
                return;
            }
        }

        statusDiv.textContent = 'Enviando mensaje...';

        const payload = {
            name: name,
            email: email,
            message: message,
            fileName: fileName,
            mimeType: mimeType,
            fileData: fileData
        };

        // IMPORTANTE: El usuario debe reemplazar esta URL con la que le genere Google Apps Script
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNcBZHo85r5887iiDQjAPzv-LdXfdg9LaD-KnsYbiHKxWeAdTwWPn99bEj4D6ZHK2T/exec';

        if (GOOGLE_SCRIPT_URL === 'REEMPLAZAR_CON_URL_DE_APPS_SCRIPT') {
            statusDiv.textContent = 'Falta configurar la URL de Google Apps Script en main.js';
            statusDiv.className = 'mt-2 text-center small text-warning';
            submitBtn.innerHTML = 'Enviar a VectorLab';
            submitBtn.disabled = false;
            return;
        }

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            statusDiv.textContent = '¡Mensaje y archivos enviados con éxito!';
            statusDiv.className = 'mt-2 text-center small text-success';
            form.reset();
            
            setTimeout(() => {
                panel.classList.add('d-none');
                statusDiv.classList.add('d-none');
            }, 3000);

        } catch (error) {
            console.error('Error:', error);
            statusDiv.textContent = 'Hubo un error de red al enviar.';
            statusDiv.className = 'mt-2 text-center small text-danger';
        }

        submitBtn.innerHTML = 'Enviar a VectorLab';
        submitBtn.disabled = false;
    });
}