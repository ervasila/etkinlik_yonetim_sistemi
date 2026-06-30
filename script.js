const STORAGE_KEY = "event-management-system-events";

const sampleEvents = [
  {
    id: "sample-1",
    title: "Frontend Gelistirme Atolyesi",
    description: "HTML, CSS ve JavaScript ile uygulama gelistirme odakli uygulamali atolye.",
    category: "Atolye",
    status: "Yayinda",
    date: "2026-07-12",
    time: "14:00",
    location: "Istanbul Teknoloji Merkezi",
    capacity: 60,
    attendees: 34,
  },
  {
    id: "sample-2",
    title: "Genc Girisimciler Meetupu",
    description: "Yeni is fikirleri, networking ve kisa sunumlar icin topluluk bulusmasi.",
    category: "Meetup",
    status: "Planlandi",
    date: "2026-07-20",
    time: "19:00",
    location: "Kadikoy",
    capacity: 90,
    attendees: 18,
  },
  {
    id: "sample-3",
    title: "Kariyer ve Teknoloji Konferansi",
    description: "Sektor profesyonellerinden kariyer, yazilim ve urun gelistirme oturumlari.",
    category: "Konferans",
    status: "Yayinda",
    date: "2026-08-03",
    time: "10:30",
    location: "Online",
    capacity: 250,
    attendees: 146,
  },
];

const form = document.querySelector("#eventForm");
const eventList = document.querySelector("#eventList");
const eventTemplate = document.querySelector("#eventTemplate");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const statusFilter = document.querySelector("#statusFilter");
const resultCount = document.querySelector("#resultCount");
const totalEvents = document.querySelector("#totalEvents");
const activeEvents = document.querySelector("#activeEvents");
const totalAttendees = document.querySelector("#totalAttendees");
const occupancyRate = document.querySelector("#occupancyRate");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const categoryInput = document.querySelector("#category");
const statusInput = document.querySelector("#status");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");
const locationInput = document.querySelector("#location");
const capacityInput = document.querySelector("#capacity");

let events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || sampleEvents;

dateInput.value = new Date().toISOString().split("T")[0];
timeInput.value = "12:00";

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function formatDate(date, time) {
  const formatter = new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${formatter.format(new Date(date))} - ${time}`;
}

function getFilteredEvents() {
  const query = searchInput.value.trim().toLocaleLowerCase("tr-TR");
  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;

  return events.filter((event) => {
    const matchesSearch =
      event.title.toLocaleLowerCase("tr-TR").includes(query) ||
      event.location.toLocaleLowerCase("tr-TR").includes(query) ||
      event.description.toLocaleLowerCase("tr-TR").includes(query);
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function updateStats() {
  const capacity = events.reduce((total, event) => total + event.capacity, 0);
  const attendees = events.reduce((total, event) => total + event.attendees, 0);
  const occupancy = capacity ? Math.round((attendees / capacity) * 100) : 0;

  totalEvents.textContent = events.length;
  activeEvents.textContent = events.filter((event) => event.status !== "Tamamlandi").length;
  totalAttendees.textContent = attendees;
  occupancyRate.textContent = `${occupancy}%`;
}

function getStatusClass(status) {
  if (status === "Tamamlandi") {
    return "done";
  }

  if (status === "Planlandi") {
    return "planned";
  }

  return "";
}

function renderEvents() {
  const visibleEvents = getFilteredEvents();
  eventList.innerHTML = "";
  resultCount.textContent = `${visibleEvents.length} kayit`;
  emptyState.classList.toggle("hidden", visibleEvents.length > 0);

  visibleEvents
    .slice()
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .forEach((event) => {
      const card = eventTemplate.content.firstElementChild.cloneNode(true);
      const fullness = Math.min(Math.round((event.attendees / event.capacity) * 100), 100);
      const registerButton = card.querySelector('[data-action="register"]');

      card.dataset.id = event.id;
      card.querySelector(".badge").textContent = event.category;
      const statusBadge = card.querySelector(".status");
      const statusClass = getStatusClass(event.status);

      statusBadge.textContent = event.status;

      if (statusClass) {
        statusBadge.classList.add(statusClass);
      }

      card.querySelector("h3").textContent = event.title;
      card.querySelector(".event-description").textContent = event.description;
      card.querySelector('[data-field="date"]').textContent = formatDate(event.date, event.time);
      card.querySelector('[data-field="location"]').textContent = event.location;
      card.querySelector('[data-field="capacityText"]').textContent =
        `${event.attendees}/${event.capacity} katilimci - %${fullness} dolu`;
      card.querySelector('[data-field="capacityBar"]').style.width = `${fullness}%`;

      if (event.attendees >= event.capacity || event.status === "Tamamlandi") {
        registerButton.disabled = true;
        registerButton.textContent = event.status === "Tamamlandi" ? "Tamamlandi" : "Kontenjan Dolu";
      }

      eventList.appendChild(card);
    });
}

function renderApp() {
  updateStats();
  renderEvents();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const capacity = Number(capacityInput.value);

  events.push({
    id: crypto.randomUUID(),
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    category: categoryInput.value,
    status: statusInput.value,
    date: dateInput.value,
    time: timeInput.value,
    location: locationInput.value.trim(),
    capacity,
    attendees: 0,
  });

  saveEvents();
  renderApp();
  form.reset();
  dateInput.value = new Date().toISOString().split("T")[0];
  timeInput.value = "12:00";
  titleInput.focus();
});

eventList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  const card = event.target.closest(".event-card");

  if (!button || !card) {
    return;
  }

  const selectedEvent = events.find((item) => item.id === card.dataset.id);

  if (!selectedEvent) {
    return;
  }

  if (button.dataset.action === "register" && selectedEvent.attendees < selectedEvent.capacity) {
    selectedEvent.attendees += 1;
  }

  if (button.dataset.action === "delete") {
    events = events.filter((item) => item.id !== selectedEvent.id);
  }

  saveEvents();
  renderApp();
});

[searchInput, categoryFilter, statusFilter].forEach((input) => {
  input.addEventListener("input", renderEvents);
});

saveEvents();
renderApp();
