// Charger tous les projets
async function loadProjects() {
    try {
        const response = await fetch('https://gabistam.github.io/Demo_API/data/projects.json');

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Afficher les projets
        displayProjects(data.projects);

        // Initialiser les filtres
        setupFilters();

        // Initialiser le modal
        setupModal(data.projects);

    } catch (error) {
        console.error('Erreur de chargement:', error);
        const errorMsg = document.getElementById('error-msg');
        errorMsg.textContent = "Impossible de charger les projets.";
        errorMsg.classList.remove('hidden');
    }
}

// Afficher les projets dynamiquement
function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; 

    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('card');

        projectElement.setAttribute('data-technologies', JSON.stringify(project.technologies));
        projectElement.setAttribute('data-id', project.id);

        projectElement.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="card-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="card-buttons">
                    <button class="btn details-btn" data-id="${project.id}">Voir détails</button>
                </div>
            </div>
        `;

        container.appendChild(projectElement);
    });
}

// Filtrer les projets
function setupFilters() {
    const container = document.getElementById('projects-container');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tech = btn.getAttribute('data-tech');
            buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
            btn.setAttribute('aria-pressed', 'true');

            Array.from(container.children).forEach(card => {
                const projectTechs = JSON.parse(card.getAttribute('data-technologies'));
                card.style.display = (tech === 'all' || projectTechs.includes(tech)) ? '' : 'none';
            });
        });
    });
}

// Configurer le modal
function setupModal(projects) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalClient = document.getElementById('modal-client');
    const modalTech = document.getElementById('modal-tech');
    const modalFeatures = document.getElementById('modal-features');
    const closeBtn = document.querySelector('.modal-close');

    // Ouvrir le modal
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = parseInt(btn.getAttribute('data-id'));
            const project = projects.find(p => p.id === projectId);
            if (!project) return;

            // Remplir le contenu du modal
            modalImage.src = project.image;
            modalImage.alt = project.title;
            modalClient.textContent = `${project.client} - ${project.category} (${project.year}, ${project.duration})`;

            modalTech.innerHTML = '';
            project.technologies.forEach(tech => {
                const span = document.createElement('span');
                span.classList.add('badge');
                span.textContent = tech;
                modalTech.appendChild(span);
            });

            modalFeatures.innerHTML = '';
            project.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                modalFeatures.appendChild(li);
            });

            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    // Fermer le modal
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    });

    // Fermer en cliquant en dehors du contenu
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        }
    });
}

document.addEventListener('DOMContentLoaded', loadProjects);
