
const projectsContainer = document.getElementById('projects-container');
const errorMsg = document.getElementById('error-msg');
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
let projects = []; 

document.getElementById('year').textContent = new Date().getFullYear();

async function loadProjects() {
  try {
    const url = "https://gabistam.github.io/Demo_API/data/projects.json";
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);

    const data = await res.json();   
    projects = data.projects;        
    displayProjects(projects);       
  } catch (err) {
    console.error("Erreur API:", err);
    errorMsg.classList.remove('hidden');
    errorMsg.textContent = "Erreur de chargement des projets : " + err.message;
  }
}

function createCardHTML(p) {
  return `
    <article class="card">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="muted">${p.client}</p>
      <div class="badges">
        ${p.technologies.map(t => `<span>${t}</span>`).join('')}
      </div>
      <button data-id="${p.id}" class="open-btn">Voir détails</button>
    </article>
  `;
}

function displayProjects(list) {
  projectsContainer.innerHTML = list.map(createCardHTML).join('') 
                              || "<p>Aucun projet trouvé.</p>";

  document.querySelectorAll('.open-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(Number(btn.dataset.id));
    });
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tech = btn.dataset.tech;

    document.querySelectorAll('.filter-btn')
      .forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');

    if (tech === "all") displayProjects(projects);
    else displayProjects(projects.filter(p => p.technologies.includes(tech)));
  });
});

function openModal(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-client').textContent = "Client : " + p.client;
  document.getElementById('modal-tech').innerHTML = p.technologies.map(t => `<span>${t}</span>`).join('');
  document.getElementById('modal-features').innerHTML = p.features.map(f => `<li>${f}</li>`).join('');
  
  const modalImage = document.getElementById('modal-image');
  modalImage.src = p.image;
  modalImage.alt = p.title;

  const modalLink = document.getElementById('modal-link');
  modalLink.href = p.url || "#";

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    if (nav.style.display === 'flex') {
      nav.style.display = '';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '1rem';
    }
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const formMsg = document.getElementById('form-msg');

    if (!name.value.trim()) {
      formMsg.textContent = "Le nom est requis.";
      formMsg.style.color = "red";
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email.value)) {
      formMsg.textContent = "Adresse email invalide.";
      formMsg.style.color = "red";
      return;
    }
    if (!message.value.trim()) {
      formMsg.textContent = "Le message est requis.";
      formMsg.style.color = "red";
      return;
    }

    // Succès
    formMsg.textContent = "Message envoyé avec succès (simulation) !";
    formMsg.style.color = "green";
    contactForm.reset();
  });
}

loadProjects();
