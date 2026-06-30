const STORAGE_KEY = "event-management-system-events";
const USERS_KEY = "event-management-system-users";
const SESSION_KEY = "event-management-system-session";
const ADMIN_USERS = [
  { id: "admin-1", name: "Admin", email: "admin@gmail.com", password: "1234", role: "admin" },
  { id: "admin-2", name: "Admin 1", email: "admin1@gmail.com", password: "1234", role: "admin" },
];
const weatherCodeLabels = {
  0: "Acik",
  1: "Az bulutlu",
  2: "Parcali bulutlu",
  3: "Kapali",
  45: "Sisli",
  48: "Kiragi sisli",
  51: "Hafif ciseleme",
  53: "Ciseleme",
  55: "Yogun ciseleme",
  61: "Hafif yagmur",
  63: "Yagmur",
  65: "Kuvvetli yagmur",
  71: "Hafif kar",
  73: "Kar",
  75: "Kuvvetli kar",
  80: "Hafif saganak",
  81: "Saganak",
  82: "Kuvvetli saganak",
  95: "Gok gurultulu",
};

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
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  },
];

const form = document.querySelector("#eventForm");
const authShell = document.querySelector("#authShell");
const appShell = document.querySelector("#appShell");
const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const authTitle = document.querySelector("#authTitle");
const authSubtitle = document.querySelector("#authSubtitle");
const authMessage = document.querySelector("#authMessage");
const showLoginButton = document.querySelector("#showLogin");
const showRegisterButton = document.querySelector("#showRegister");
const registerNameInput = document.querySelector("#registerName");
const registerEmailInput = document.querySelector("#registerEmail");
const registerPasswordInput = document.querySelector("#registerPassword");
const loginEmailInput = document.querySelector("#loginEmail");
const loginPasswordInput = document.querySelector("#loginPassword");
const roleTabs = document.querySelector(".role-tabs");
const sessionRole = document.querySelector("#sessionRole");
const sessionName = document.querySelector("#sessionName");
const logoutButton = document.querySelector("#logoutButton");
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
const imageUrlInput = document.querySelector("#imageUrl");
const concertKeywordInput = document.querySelector("#concertKeyword");
const concertCityInput = document.querySelector("#concertCity");
const fetchConcertsButton = document.querySelector("#fetchConcerts");
const concertStatus = document.querySelector("#concertStatus");
const concertList = document.querySelector("#concertList");
const artistChips = document.querySelector(".artist-chips");

let events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || sampleEvents;
let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
let currentUser = JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
let selectedLoginRole = "admin";

events = events.map((event, index) => ({
  ...event,
  imageUrl: event.imageUrl || sampleEvents[index % sampleEvents.length].imageUrl,
}));
saveEvents();

users = users
  .filter((user) => !ADMIN_USERS.some((admin) => admin.email === user.email))
  .map((user) => ({ ...user, role: "user" }));
saveUsers();

dateInput.value = new Date().toISOString().split("T")[0];
timeInput.value = "12:00";

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function isAdmin() {
  return currentUser?.role === "admin";
}

function setAuthMessage(message, isSuccess = false) {
  authMessage.textContent = message;
  authMessage.style.color = isSuccess ? "var(--success)" : "var(--danger)";
}

function showRegisterView() {
  authTitle.textContent = "Kayit Ol";
  authSubtitle.textContent = "Kullanici hesabi olustur. Admin hesaplari sabittir.";
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  setAuthMessage("");
}

function showLoginView() {
  authTitle.textContent = "Giris Yap";
  authSubtitle.textContent = "Admin ve kullanici girisleri ayridir.";
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  setAuthMessage("");
}

function setLoginRole(role) {
  selectedLoginRole = role;
  roleTabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.loginRole === role);
  });
}

function updateAdminVisibility() {
  document.querySelectorAll(".admin-only").forEach((element) => {
    element.classList.toggle("hidden", !isAdmin());
  });
}

function showApp() {
  authShell.classList.add("hidden");
  appShell.classList.remove("hidden");
  appShell.classList.toggle("user-mode", !isAdmin());
  appShell.classList.toggle("admin-mode", isAdmin());
  sessionName.textContent = currentUser.name;
  sessionRole.textContent = isAdmin() ? "Admin" : "Kullanici";
  updateAdminVisibility();
  renderApp();
}

function showAuth() {
  appShell.classList.add("hidden");
  authShell.classList.remove("hidden");

  if (users.length) {
    showLoginView();
    loginEmailInput.focus();
  } else {
    showRegisterView();
    registerNameInput.focus();
  }
}

function bootAuth() {
  const knownUsers = [...ADMIN_USERS, ...users];

  if (currentUser && knownUsers.some((user) => user.email === currentUser.email)) {
    showApp();
    return;
  }

  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  showAuth();
}

function formatDate(date, time) {
  const formatter = new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${formatter.format(new Date(date))} - ${time}`;
}

function formatConcertDate(dateValue, timeValue) {
  if (!dateValue) {
    return "Tarih belirtilmemis";
  }

  const formatter = new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = timeValue ? ` - ${timeValue}` : "";

  return `${formatter.format(new Date(dateValue))}${time}`;
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
      const image = card.querySelector('[data-field="image"]');
      image.src =
        event.imageUrl ||
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80";
      image.alt = `${event.title} etkinlik gorseli`;
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
      card.querySelector('[data-field="weather"] span').textContent =
        event.weather || "Hava durumu henuz alinmadi.";

      if (event.attendees >= event.capacity || event.status === "Tamamlandi") {
        registerButton.disabled = true;
        registerButton.textContent = event.status === "Tamamlandi" ? "Tamamlandi" : "Kontenjan Dolu";
      }

      card.querySelectorAll(".admin-only").forEach((element) => {
        element.classList.toggle("hidden", !isAdmin());
      });

      eventList.appendChild(card);
    });
}

function renderApp() {
  updateStats();
  renderEvents();
}

async function getWeatherForEvent(eventItem) {
  if (eventItem.location.toLocaleLowerCase("tr-TR").includes("online")) {
    throw new Error("Online etkinlikler icin lokasyon bazli hava durumu alinamaz.");
  }

  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.searchParams.set("name", eventItem.location);
  geoUrl.searchParams.set("count", "1");
  geoUrl.searchParams.set("language", "tr");
  geoUrl.searchParams.set("format", "json");

  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error("Lokasyon bilgisi alinamadi.");
  }

  const geoData = await geoResponse.json();
  const location = geoData.results?.[0];

  if (!location) {
    throw new Error("Bu lokasyon icin sonuc bulunamadi.");
  }

  const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
  forecastUrl.searchParams.set("latitude", location.latitude);
  forecastUrl.searchParams.set("longitude", location.longitude);
  forecastUrl.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
  forecastUrl.searchParams.set("timezone", "auto");
  forecastUrl.searchParams.set("forecast_days", "16");

  const forecastResponse = await fetch(forecastUrl);

  if (!forecastResponse.ok) {
    throw new Error("Hava durumu bilgisi alinamadi.");
  }

  const forecastData = await forecastResponse.json();
  const dayIndex = forecastData.daily.time.indexOf(eventItem.date);

  if (dayIndex === -1) {
    throw new Error("Hava durumu yalnizca yakin tarihli etkinlikler icin alinabilir.");
  }

  const min = Math.round(forecastData.daily.temperature_2m_min[dayIndex]);
  const max = Math.round(forecastData.daily.temperature_2m_max[dayIndex]);
  const weatherCode = forecastData.daily.weather_code[dayIndex];
  const label = weatherCodeLabels[weatherCode] || "Hava durumu";

  return `${location.name}: ${label}, ${min}°C / ${max}°C`;
}

function renderConcerts(concerts) {
  concertList.innerHTML = "";

  if (!concerts.length) {
    concertStatus.textContent = "Bu sehir icin konser bulunamadi.";
    return;
  }

  concertStatus.textContent = `${concerts.length} konser bulundu.`;

  concerts.forEach((concert) => {
    const venue = concert._embedded?.venues?.[0];
    const date = concert.dates?.start?.localDate;
    const time = concert.dates?.start?.localTime;
    const image = concert.images?.find((item) => item.ratio === "16_9") || concert.images?.[0];
    const card = document.createElement("article");
    const content = document.createElement("div");
    const poster = document.createElement("img");
    const title = document.createElement("h3");
    const dateText = document.createElement("p");
    const venueText = document.createElement("p");
    const link = document.createElement("a");

    card.className = "concert-card";
    content.className = "concert-card-content";

    if (image?.url) {
      poster.src = image.url;
      poster.alt = `${concert.name} konser gorseli`;
      card.appendChild(poster);
    }

    title.textContent = concert.name;
    dateText.textContent = formatConcertDate(date, time);
    venueText.textContent = `${venue?.name || "Mekan belirtilmemis"}${
      venue?.city?.name ? `, ${venue.city.name}` : ""
    }`;
    link.href = concert.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Bilet Al";

    content.append(title, dateText, venueText, link);
    card.appendChild(content);

    concertList.appendChild(card);
  });
}

async function fetchConcerts() {
  const keyword = concertKeywordInput.value.trim();
  const city = concertCityInput.value.trim();

  concertStatus.classList.remove("error");
  concertList.innerHTML = "";

  if (!city) {
    concertStatus.classList.add("error");
    concertStatus.textContent = "Konser aramak icin sehir yaz.";
    concertCityInput.focus();
    return;
  }

  fetchConcertsButton.disabled = true;
  concertStatus.textContent = "Konserler aliniyor...";

  try {
    const url = new URL("/api/concerts", window.location.origin);
    url.searchParams.set("city", city);

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    }

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Konser API istegi basarisiz oldu.");
    }

    const data = await response.json();
    const concerts = data._embedded?.events || [];

    renderConcerts(concerts);
  } catch (error) {
    concertStatus.classList.add("error");
    concertStatus.textContent =
      error.message === "Konserleri gostermek icin Ticketmaster API key ayarlanmali."
        ? "Konserleri gostermek icin uygulama sahibinin Ticketmaster API key ayarlamasi gerekiyor."
        : error.message;
  } finally {
    fetchConcertsButton.disabled = false;
  }
}

fetchConcertsButton.addEventListener("click", fetchConcerts);

showLoginButton.addEventListener("click", showLoginView);

showRegisterButton.addEventListener("click", showRegisterView);

roleTabs.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-login-role]");

  if (!tab) {
    return;
  }

  setLoginRole(tab.dataset.loginRole);
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = registerNameInput.value.trim();
  const email = registerEmailInput.value.trim().toLocaleLowerCase("tr-TR");
  const password = registerPasswordInput.value;
  const role = "user";
  const knownUsers = [...ADMIN_USERS, ...users];

  if (knownUsers.some((user) => user.email === email)) {
    setAuthMessage("Bu e-posta ile kayitli bir hesap var.");
    return;
  }

  users.push({ id: crypto.randomUUID(), name, email, password, role });
  saveUsers();
  registerForm.reset();
  loginEmailInput.value = email;
  setLoginRole("user");
  showLoginView();
  setAuthMessage("Kayit tamamlandi. Simdi giris yapabilirsin.", true);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = loginEmailInput.value.trim().toLocaleLowerCase("tr-TR");
  const password = loginPasswordInput.value;
  const knownUsers = [...ADMIN_USERS, ...users];
  const user = knownUsers.find(
    (item) => item.email === email && item.password === password && item.role === selectedLoginRole,
  );

  if (!user) {
    setAuthMessage("E-posta, sifre veya giris tipi hatali.");
    return;
  }

  currentUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  loginForm.reset();
  showApp();
});

logoutButton.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  showAuth();
});

concertCityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchConcerts();
  }
});

concertKeywordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchConcerts();
  }
});

artistChips.addEventListener("click", (event) => {
  const chip = event.target.closest("[data-artist]");

  if (!chip) {
    return;
  }

  concertKeywordInput.value = chip.dataset.artist;
  fetchConcerts();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!isAdmin()) {
    return;
  }

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
    imageUrl: imageUrlInput.value.trim(),
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

  if (button.dataset.action === "weather") {
    const weatherBox = card.querySelector('[data-field="weather"]');

    button.disabled = true;
    weatherBox.classList.remove("error");
    weatherBox.innerHTML = "<span>Hava durumu aliniyor...</span>";

    getWeatherForEvent(selectedEvent)
      .then((weather) => {
        selectedEvent.weather = weather;
        saveEvents();
        weatherBox.innerHTML = `<span><strong>${weather}</strong></span>`;
      })
      .catch((error) => {
        weatherBox.classList.add("error");
        weatherBox.innerHTML = `<span>${error.message}</span>`;
      })
      .finally(() => {
        button.disabled = false;
      });

    return;
  }

  if (button.dataset.action === "delete" && isAdmin()) {
    events = events.filter((item) => item.id !== selectedEvent.id);
  }

  saveEvents();
  renderApp();
});

[searchInput, categoryFilter, statusFilter].forEach((input) => {
  input.addEventListener("input", renderEvents);
});

saveEvents();
bootAuth();
