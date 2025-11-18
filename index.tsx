import { GoogleGenAI } from "@google/genai";
import { servicesData } from './servicesData'; // Importa los datos de servicios

// Informa a TypeScript sobre la variable global 'L' de Leaflet
declare var L: any;

document.addEventListener('DOMContentLoaded', () => {

    const categoryTitles = {
        "tramites": "Trámites y Pagos",
        "comuna": "Vivir en la Florida",
        "personas": "Personas y Familia",
        "salud": "Salud y Educación",
        "cultura": "Cultura y Deporte",
        "desarrollo": "Desarrollo y Emprendimiento",
        "municipio": "Tu Municipalidad"
    };
    
    // --- Lógica de Modo Nocturno ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIconContainer = document.getElementById('theme-icon-container');
    const sunIcon = '<i class="fas fa-sun text-lg" aria-hidden="true"></i>';
    const moonIcon = '<i class="fas fa-moon text-lg" aria-hidden="true"></i>';

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if(themeIconContainer) themeIconContainer.innerHTML = sunIcon;
        } else {
            document.documentElement.classList.remove('dark');
            if(themeIconContainer) themeIconContainer.innerHTML = moonIcon;
        }
    };

    themeToggle?.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
    
    // Aplicar tema al cargar la página
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // --- Lógica para el Modal de Búsqueda ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const searchModal = document.getElementById('search-modal');
    const searchResults = document.getElementById('search-results');
    const searchModalCloseButton = document.getElementById('search-modal-close-button');
    let lastActiveElement: HTMLElement | null = null;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    /**
     * Normalizes a URL to a consistent host representation for de-duplication.
     * It removes protocol, 'www.' prefix, path, and query params.
     * @param {string} urlString The URL to normalize.
     * @returns {string} The normalized hostname (e.g., 'example.com').
     */
    function normalizeUrl(urlString: string): string {
        try {
            const url = new URL(urlString);
            let hostname = url.hostname;
            // Remove 'www.' prefix for consistency
            if (hostname.startsWith('www.')) {
                hostname = hostname.substring(4);
            }
            return hostname;
        } catch (e) {
            // Fallback for potentially malformed URLs. Extracts the domain part.
            return urlString
                .replace(/^(?:https?:\/\/)?/i, "")
                .replace(/^(?:www\.)?/i, "")
                .split('/')[0];
        }
    }

    searchForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query && searchResults) {
            searchResults.innerHTML = `
                <div class="flex justify-center items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Buscando con IA...</span>
                </div>
            `;
            openModal();

            try {
                const prompt = `Eres un asistente virtual para el portal de la Municipalidad de La Florida, Chile. Tu objetivo es responder las preguntas de los ciudadanos de la manera más clara, concisa y útil posible, utilizando información actualizada de la web. Pregunta del ciudadano: "${query}"`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        tools: [{ googleSearch: {} }],
                    },
                });

                const text = response.text;
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

                let sourcesHTML = '';
                const validSources = sources.filter(source => source.web && source.web.uri);

                if (validSources.length > 0) {
                    // Use a Map to store unique sources by their normalized hostname to prevent duplicates from the same site.
                    const uniqueSourcesMap = new Map();
                    validSources.forEach(source => {
                        const normalizedHost = normalizeUrl(source.web.uri);
                        if (!uniqueSourcesMap.has(normalizedHost)) {
                            uniqueSourcesMap.set(normalizedHost, source);
                        }
                    });
                    
                    const uniqueSources = Array.from(uniqueSourcesMap.values());

                    sourcesHTML = `
                        <div class="mt-4 pt-3 border-t border-[var(--border-primary)]">
                            <h4 class="font-semibold text-sm text-gray-600 dark:text-gray-300">Fuentes:</h4>
                            <ul class="list-disc list-inside text-sm mt-2 space-y-1">
                                ${uniqueSources
                                    .map(source => `
                                    <li>
                                        <a href="${source.web.uri}" target="_blank" rel="noopener noreferrer" class="text-[var(--color-primary)] hover:underline">${source.web.title || source.web.uri}</a>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `;
                }

                // Simple markdown-to-html for better formatting
                let htmlContent = '';
                const lines = text.split('\n').filter(line => line.trim() !== '');
                let inList = false;

                for (const line of lines) {
                    let processedLine = line.trim();
                    processedLine = processedLine
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>');

                    if (processedLine.startsWith('• ') || processedLine.startsWith('- ') || processedLine.startsWith('* ')) {
                        if (!inList) {
                            htmlContent += '<ul class="list-disc list-inside space-y-1 my-2">';
                            inList = true;
                        }
                        htmlContent += `<li>${processedLine.substring(2)}</li>`;
                    } else {
                        if (inList) {
                            htmlContent += '</ul>';
                            inList = false;
                        }
                        if (processedLine.startsWith('# ')) {
                            htmlContent += `<h4 class="font-bold text-lg mt-3 mb-1">${processedLine.substring(2)}</h4>`;
                        } else {
                            htmlContent += `<p class="mb-2">${processedLine}</p>`;
                        }
                    }
                }
                if (inList) {
                    htmlContent += '</ul>';
                }

                searchResults.innerHTML = `
                    <div class="text-left text-base">${htmlContent}</div>
                    ${sourcesHTML}
                `;

            } catch (error) {
                console.error("Error en la búsqueda con IA:", error);
                searchResults.innerHTML = '<p>Ocurrió un error al realizar la búsqueda con IA. Por favor, inténtalo de nuevo más tarde.</p>';
            }
        }
    });

    const focusableElementsString = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function openModal() {
        lastActiveElement = document.activeElement as HTMLElement;
        searchModal.classList.remove('hidden');
        searchModal.classList.add('flex');
        
        const focusableElements = searchModal.querySelectorAll(focusableElementsString);
        const firstFocusableElement = focusableElements[0] as HTMLElement;
        const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        firstFocusableElement?.focus();

        searchModal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        });
    }

    function closeModal() {
        searchModal.classList.add('hidden');
        searchModal.classList.remove('flex');
        lastActiveElement?.focus();
    }
    searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeModal(); });
    searchModalCloseButton?.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) closeModal(); });
    
    // --- LÓGICA DEL MAPA INTERACTIVO ---
    let map: any;
    let mapInitialized = false;
    let cesfamLayer: any;
    let reciclajeLayer: any;

    const mapPoints = [
        // CESFAMs from image
        {
            lat: -33.5225, lng: -70.5939, type: 'cesfam',
            name: 'CESFAM DR. FERNANDO MAFFIOLETTI',
            address: 'Avenida Central N°301, La Florida',
            hours: 'L-J: 08:30-17:30, V: 08:30-16:30<br>SAPU: L-V desde 17:30, S-D-F todo el día'
        },
        {
            lat: -33.5653, lng: -70.5815, type: 'cesfam',
            name: 'CESFAM JOSÉ ALVO',
            address: 'Bacteriológico N°10.817, La Florida',
            hours: 'L-J: 08:30-17:30, V: 08:30-16:30<br>SAPU: L-V desde 17:30, S-D-F todo el día'
        },
        {
            lat: -33.5208, lng: -70.5794, type: 'cesfam',
            name: 'CESFAM LA FLORIDA',
            address: 'Avenida La Florida N°6.015, La Florida',
            hours: 'L-J: 08:30-17:30, V: 08:30-16:30<br>SAPU: L-V desde 17:30, S-D-F todo el día'
        },
        {
            lat: -33.5186, lng: -70.5841, type: 'cesfam',
            name: 'CESFAM LOS CASTAÑOS',
            address: 'Diagonal Los Castaños N°5.820, La Florida',
            hours: 'L-J: 08:30-17:30, V: 08:30-16:30<br>SAR: Atención 24 horas'
        },
        {
            lat: -33.5679, lng: -70.5702, type: 'cesfam',
            name: 'CESFAM LOS QUILLAYES',
            address: 'Julio César N°10.905, La Florida',
            hours: 'L-J: 08:30-17:30, V: 08:30-16:30<br>SAR: Atención 24 horas'
        },
        {
            lat: -33.5358, lng: -70.5960, type: 'cesfam',
            name: 'CESFAM SANTA AMALIA',
            address: 'Santa Amalia N°202, La Florida',
            hours: 'L-J: 08:30-17:30, V: 08:30-16:30<br>SAPU: L-V desde 17:30, S-D-F todo el día'
        },
        {
            lat: -33.5358, lng: -70.5898, type: 'cesfam',
            name: 'CESFAM TRINIDAD',
            address: 'Avenida Uno N°10.021, La Florida',
            hours: 'L-J: 08:30-17:30, V: 08:30-16:30<br>SAPU: L-V desde 17:30, S-D-F todo el día'
        },
        {
            lat: -33.5135, lng: -70.6074, type: 'cesfam',
            name: 'CESFAM VILLA O\'HIGGINS',
            address: 'Santa Julia N°870, La Florida',
            hours: 'L-J: 08:30-17:30, V: 08:30-16:30<br>SAPU: Atención 24 horas'
        },
        {
            lat: -33.5332, lng: -70.5721, type: 'cesfam',
            name: 'CESFAM BELLAVISTA',
            address: 'Pudeto N°7.100, La Florida',
            hours: 'L-J: 08:30-17:30, V: 08:30-16:30<br>SAPU: 17:30 a 21:30'
        },
        // Recycling points from text
        {
            lat: -33.5133, lng: -70.6111, type: 'reciclaje',
            name: 'Punto limpio WOM Mall Plaza Vespucio',
            address: 'Av. Vicuña Mackenna 7110, La Florida',
            hours: 'Lunes a Viernes: 10:00 - 21:30'
        },
        {
            lat: -33.4975, lng: -70.6033, type: 'reciclaje',
            name: 'Punto limpio Sodimac Nueva La Florida',
            address: 'Av. José Pedro Alessandri 6402, La Florida',
            hours: 'Lunes a Sábado: 10:00 - 17:00 (Miércoles cerrado)'
        },
        {
            lat: -33.5412, lng: -70.5630, type: 'reciclaje',
            name: 'Punto limpio Club de Leones La Florida Sur',
            address: 'Calle Don Pepe 250, La Florida',
            hours: 'Lunes a Sábado: 10:00 - 18:30'
        },
        {
            lat: -33.5103, lng: -70.5694, type: 'reciclaje',
            name: 'Punto limpio Club Vive La Florida',
            address: 'El Ulmo 824, La Florida',
            hours: 'Lunes a Sábado: 10:00 - 20:00'
        },
    ];

    function initializeMap() {
        if (mapInitialized || !document.getElementById('map-container')) return;

        map = L.map('map-container').setView([-33.538, -70.585], 13); // Centered on La Florida

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const cesfamIcon = L.divIcon({
            html: '<i class="fas fa-clinic-medical"></i>',
            className: 'map-marker-icon map-marker-cesfam',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        const reciclajeIcon = L.divIcon({
            html: '<i class="fas fa-recycle"></i>',
            className: 'map-marker-icon map-marker-reciclaje',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        cesfamLayer = L.layerGroup();
        reciclajeLayer = L.layerGroup();

        mapPoints.forEach(point => {
            const marker = L.marker([point.lat, point.lng], { 
                icon: point.type === 'cesfam' ? cesfamIcon : reciclajeIcon 
            }).bindPopup(`<b>${point.name}</b><br>${point.address}<hr style="margin: 4px 0;" /><strong><i class="fas fa-clock"></i> Horarios:</strong><br>${point.hours}`);

            if (point.type === 'cesfam') {
                marker.addTo(cesfamLayer);
            } else {
                marker.addTo(reciclajeLayer);
            }
        });

        cesfamLayer.addTo(map);
        reciclajeLayer.addTo(map);
        
        (document.getElementById('cesfam-toggle') as HTMLInputElement).addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.checked) {
                map.addLayer(cesfamLayer);
            } else {
                map.removeLayer(cesfamLayer);
            }
        });
        
        (document.getElementById('reciclaje-toggle') as HTMLInputElement).addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.checked) {
                map.addLayer(reciclajeLayer);
            } else {
                map.removeLayer(reciclajeLayer);
            }
        });

        mapInitialized = true;
        
        setTimeout(() => map.invalidateSize(), 100);
    }


    // --- LÓGICA DE NAVEGACIÓN Y RENDERIZADO DE CONTENIDO ---
    const navLinks = document.querySelectorAll('.nav-link');
    const mainDashboard = document.getElementById('main-dashboard');
    const pageContentWrapper = document.getElementById('page-content-wrapper');

    function showPage(pageId) {
        const defaultTitle = "Portal Municipal - La Florida";
        if (pageId === 'home') {
            mainDashboard.classList.remove('hidden');
            pageContentWrapper.classList.add('hidden');
            pageContentWrapper.innerHTML = '';
            document.title = defaultTitle;
            initializeMap();
        } else {
            mainDashboard.classList.add('hidden');
            pageContentWrapper.classList.remove('hidden');
            document.title = `${categoryTitles[pageId] || 'Servicios'} - ${defaultTitle}`;
            renderServicePage(pageId);
        }
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = (e.currentTarget as HTMLElement).dataset.page;
            if (pageId) {
                showPage(pageId);
            }
        });
    });

    function renderServiceCard(service, category) {
         const serviceItems = [
            service.publico ? `Público: ${service.publico.join(', ')}` : null,
            service.tipo ? `Tipo: ${service.tipo}` : null,
            service.modalidad ? `Modalidad: ${service.modalidad.join(', ')}` : null
        ].filter(Boolean).slice(0, 3);

        return `
            <button class="service-page-card" data-service-title="${service.title}" data-category="${category}" aria-label="Ver detalles de ${service.title}">
                <div>
                    <h3>${service.title.toUpperCase()}</h3>
                    <ul>
                        ${serviceItems.map(item => `<li><i class="fas fa-check-circle text-green-500" aria-hidden="true"></i> ${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="card-footer">
                    <span class="font-bold text-[var(--color-primary)]">Ver más...</span>
                </div>
            </button>
        `;
    }

    function addCardClickListeners(category) {
        document.querySelectorAll(`#${category}-service-list .service-page-card`).forEach(card => {
            card.addEventListener('click', () => {
                const serviceTitle = (card as HTMLElement).dataset.serviceTitle;
                renderServiceDetail(serviceTitle, category);
            });
        });
    }

    function renderFilteredServices(category) {
        const services = servicesData[category] || [];
        const publicoFilter = (document.getElementById(`${category}-filter-publico`) as HTMLSelectElement).value;
        const tipoFilter = (document.getElementById(`${category}-filter-tipo`) as HTMLSelectElement).value;
        const modalidadFilter = (document.getElementById(`${category}-filter-modalidad`) as HTMLSelectElement).value;

        const filteredServices = services.filter(s => {
            const publicoMatch = !publicoFilter || (s.publico && s.publico.includes(publicoFilter));
            const tipoMatch = !tipoFilter || s.tipo === tipoFilter;
            const modalidadMatch = !modalidadFilter || (s.modalidad && s.modalidad.includes(modalidadFilter));
            return publicoMatch && tipoMatch && modalidadMatch;
        });

        const listContainer = document.getElementById(`${category}-service-list`);
        if (listContainer) {
            listContainer.innerHTML = filteredServices.length > 0 
                ? filteredServices.map(service => renderServiceCard(service, category)).join('')
                : `<p class="text-gray-500 md:col-span-3 text-center">No se encontraron servicios que coincidan con los filtros seleccionados.</p>`;
            addCardClickListeners(category);
        }
    }
    
    function renderServicePage(category) {
        const services = servicesData[category] || [];
        const uniquePublicos = [...new Set(services.flatMap(s => s.publico || []))].sort();
        const uniqueTipos = [...new Set(services.map(s => s.tipo).filter(Boolean))].sort();
        const uniqueModalidades = [...new Set(services.flatMap(s => s.modalidad || []))].sort();

        const filtersHTML = `
            <div class="bg-secondary p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div class="md:col-span-1 font-bold text-primary">Filtrar por:</div>
                <select id="${category}-filter-publico" name="publico" class="w-full p-2 rounded-md filter-select" aria-label="Filtrar por público objetivo">
                    <option value="">Todo Público</option>
                    ${uniquePublicos.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
                <select id="${category}-filter-tipo" name="tipo" class="w-full p-2 rounded-md filter-select" aria-label="Filtrar por tipo de servicio">
                    <option value="">Todo Tipo</option>
                    ${uniqueTipos.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
                <select id="${category}-filter-modalidad" name="modalidad" class="w-full p-2 rounded-md filter-select" aria-label="Filtrar por modalidad">
                    <option value="">Toda Modalidad</option>
                    ${uniqueModalidades.map(m => `<option value="${m}">${m}</option>`).join('')}
                </select>
            </div>
        `;

        const pageHTML = `
            <section id="${category}-page" class="page-section">
                <div class="mb-6">
                    <h2 class="text-3xl font-bold text-primary">${categoryTitles[category]}</h2>
                    <p class="text-secondary mt-2">Encuentra los servicios, trámites y beneficios que tenemos para ti en esta categoría.</p>
                </div>
                ${filtersHTML}
                <div id="${category}-service-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${services.map(service => renderServiceCard(service, category)).join('')}
                </div>
                <div id="${category}-service-detail" class="hidden"></div>
            </section>
        `;
        pageContentWrapper.innerHTML = pageHTML;

        addCardClickListeners(category);

        document.getElementById(`${category}-filter-publico`)?.addEventListener('change', () => renderFilteredServices(category));
        document.getElementById(`${category}-filter-tipo`)?.addEventListener('change', () => renderFilteredServices(category));
        document.getElementById(`${category}-filter-modalidad`)?.addEventListener('change', () => renderFilteredServices(category));
    }

    function renderServiceDetail(serviceTitle, category) {
        const service = servicesData[category].find(s => s.title === serviceTitle);
        if (!service) return;

        const detailHTML = `
            <button class="back-to-list-btn mb-6 text-[var(--color-primary-dark)] dark:text-[var(--color-primary-light)] font-semibold flex items-center gap-2" data-category="${category}">
                <i class="fas fa-arrow-left" aria-hidden="true"></i> Volver al listado
            </button>
            <article class="bg-secondary p-8 rounded-lg shadow-md service-detail-view">
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="md:col-span-2">
                        <p class="text-sm font-bold uppercase text-[var(--color-primary)]">${service.tipo || 'Servicio'}</p>
                        <h2 class="mb-4">“${service.tagline}”</h2>
                        
                        <h3 class="border-t border-border-primary pt-6">¿Qué necesidad responde?</h3>
                        <p>${service.details.necesidad || 'No especificado.'}</p>

                        <h3>¿En qué consiste el servicio?</h3>
                        <p>${service.details.consiste}</p>

                        <h3>¿Quiénes pueden acceder a este servicio?</h3>
                        <p>${service.details.quienes}</p>
                        
                        <h3>¿Cómo se activa el servicio?</h3>
                        <p>${service.details.como}</p>

                        <h3>¿Dónde y cómo se entrega el servicio?</h3>
                        <p>${service.details.donde}</p>
                    </div>
                    <aside>
                        <div class="bg-tertiary p-6 rounded-lg border border-border-primary">
                            <h4 class="font-bold text-lg mb-4">Resumen del Servicio</h4>
                            <ul class="space-y-2 text-sm">
                                <li><strong>Público:</strong> ${service.publico ? service.publico.join(', ') : 'General'}</li>
                                <li><strong>Tipo:</strong> ${service.tipo || 'No especificado'}</li>
                                <li><strong>Modalidad:</strong> ${service.modalidad ? service.modalidad.join(', ') : 'No especificada'}</li>
                            </ul>
                        </div>
                        <div class="cta-box mt-6">
                            <h4>Inscríbase <strong>aquí!</strong></h4>
                            <p class="mt-4">Juntos, hacemos de La Florida la mejor comuna.<br><strong>La Florida crece contigo</strong></p>
                        </div>
                    </aside>
                 </div>
            </article>
        `;
        
        const pageContainer = document.getElementById(`${category}-page`);
        const detailContainer = document.getElementById(`${category}-service-detail`);
        
        if (pageContainer && detailContainer) {
            pageContainer.querySelector('.bg-secondary.p-4')?.classList.add('hidden');
            pageContainer.querySelector(`#${category}-service-list`)?.classList.add('hidden');
            
            detailContainer.innerHTML = detailHTML;
            detailContainer.classList.remove('hidden');

            detailContainer.querySelector('.back-to-list-btn').addEventListener('click', (e) => {
                const cat = (e.currentTarget as HTMLElement).dataset.category;
                showPage(cat); // Vuelve a renderizar la página de la categoría
            });
        }
    }

    const featuredServices = {
        'adultos-mayores-card': {
            title: "ADULTOS MAYORES",
            description: "Apoyo y bienestar en cada etapa de la vida",
            services: [
                { title: "Gimnasia en terreno.", category: "personas" },
                { title: "Apoyo de pañales adulto", category: "personas" }
            ]
        },
        'mujer-card': {
            title: "MUJER Y EQUIDAD DE GÉNERO",
            description: "Empoderamiento y protección para todas",
            services: [
                { title: "Ferias de servicios (Sección de la Mujer)", category: "personas" },
                { title: "Asistencia Social (Mujer)", category: "personas" }
            ]
        },
        'infancia-card': {
            title: "INFANCIA Y JUVENTUD",
            description: "Construyendo un futuro lleno de oportunidades",
            services: [
                { title: "Entrega de Libros a niños y niñas desde los 3 meses a los 12 años", category: "cultura" },
                { title: "Orientación respecto a becas estatales", category: "cultura" }
            ]
        },
        'inclusion-card': {
            title: "INCLUSIÓN Y DIVERSIDAD",
            description: "Una comuna para todos y todas",
            services: [
                { title: "Taller Estimulación Cognitiva I y II", category: "personas" },
                { title: "Asesoría jurídica (Inclusión y No Discriminación)", category: "personas" }
            ]
        }
    };

    const bottomCardsContainer = document.getElementById('bottom-cards-container');

    function populateBottomCards() {
        for (const cardId in featuredServices) {
            const cardElement = document.getElementById(cardId);
            const data = featuredServices[cardId];
            if (cardElement) {
                let servicesHTML = data.services
                    .filter(service => servicesData[service.category]?.some(s => s.title === service.title))
                    .map(service => 
                    `<li><a href="#" class="bottom-service-link text-[var(--color-primary-dark)] dark:text-[var(--color-primary-light)] hover:underline" data-service-title="${service.title}" data-category="${service.category}">${service.title}</a></li>`
                ).join('');

                cardElement.innerHTML = `
                    <h3>${data.title}</h3>
                    <p class="mb-4">${data.description}</p>
                    <ul class="space-y-2 text-sm">${servicesHTML}</ul>
                `;
            }
        }
    }
    
    bottomCardsContainer.addEventListener('click', e => {
        const target = (e.target as HTMLElement).closest('.bottom-service-link');
        if (target) {
            e.preventDefault();
            const serviceTitle = (target as HTMLElement).dataset.serviceTitle;
            const serviceCategory = (target as HTMLElement).dataset.category;
            
            showPage(serviceCategory);
            
            // Wait for the page to render before trying to show the detail
            setTimeout(() => {
                if (serviceTitle && serviceCategory) {
                    renderServiceDetail(serviceTitle, serviceCategory);
                }
            }, 0);
        }
    });

    showPage('home');
    populateBottomCards();
});