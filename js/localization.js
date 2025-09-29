// Локализация
const translations = {
    en: {
        title: "⏰ Warframe Cycles Panel",
        lastUpdate: "Last update:",
        syncStatus: "Synchronized",
        syncing: "Syncing...",
        cyclesTab: "World Cycles",
        baroTab: "Baro Ki'Teer",
        eventsTab: "Events & Alerts",
        statusTab: "Warframe Status",
        platformPc: "PC",
        platformPs: "PlayStation",
        platformXb: "Xbox",
        platformSw: "Switch",
        earthTitle: "Earth (missions)",
        earthLocation: "Regular missions on Earth",
        cetusTitle: "Earth / Cetus",
        cetusLocation: "Plains of Eidolon",
        vallisTitle: "Orb Vallis",
        vallisLocation: "Venus",
        cambionTitle: "Cambion Drift",
        cambionLocation: "Deimos",
        duviriTitle: "Duviri Paradox",
        duviriLocation: "Duviri",
        zarimanTitle: "Zariman 10-0",
        zarimanLocation: "The Holdfasts",
        changeTime: "Change:",
        cycleChange: "Cycle change...",
        baroTitle: "Baro Ki'Teer",
        arrivalTime: "Arrival:",
        departureTime: "Departure:",
        baroLocation: "Current Location",
        baroInventory: "Inventory",
        eventsTitle: "Events & Alerts",
        alertsTitle: "Alerts",
        eventsListTitle: "Active Events",
        statusTitle: "Warframe Status",
        platformStatusTitle: "Platform Status",
        newsTitle: "Latest News",
        day: "d",
        hour: "h",
        minute: "m",
        second: "s",
        here: "Here",
        coming: "Coming",
        unknown: "Unknown",
        unavailable: "Unavailable",
        loading: "Loading...",
        error: "Error loading data"
    },
    ru: {
        title: "⏰ Панель Циклов Warframe",
        lastUpdate: "Последнее обновление:",
        syncStatus: "Синхронизировано",
        syncing: "Синхронизация...",
        cyclesTab: "Циклы Миров",
        baroTab: "Барро Ки'Тир",
        eventsTab: "События и Тревоги",
        statusTab: "Статус Warframe",
        platformPc: "ПК",
        platformPs: "PlayStation",
        platformXb: "Xbox",
        platformSw: "Switch",
        earthTitle: "Земля (миссии)",
        earthLocation: "Обычные миссии на Земле",
        cetusTitle: "Земля / Сетус",
        cetusLocation: "Равнины Эйдолонов",
        vallisTitle: "Долина Орб",
        vallisLocation: "Венера",
        cambionTitle: "Камбион Дрифт",
        cambionLocation: "Деймос",
        duviriTitle: "Парадокс Дувири",
        duviriLocation: "Дувири",
        zarimanTitle: "Зариман 10-0",
        zarimanLocation: "Холдфасты",
        changeTime: "Смена:",
        cycleChange: "Смена цикла...",
        baroTitle: "Барро Ки'Тир",
        arrivalTime: "Прибытие:",
        departureTime: "Убытие:",
        baroLocation: "Текущее местоположение",
        baroInventory: "Инвентарь",
        eventsTitle: "События и Тревоги",
        alertsTitle: "Тревоги",
        eventsListTitle: "Активные События",
        statusTitle: "Статус Warframe",
        platformStatusTitle: "Статус Платформ",
        newsTitle: "Последние Новости",
        day: "д",
        hour: "ч",
        minute: "м",
        second: "с",
        here: "Прибыл",
        coming: "В пути",
        unknown: "Неизвестно",
        unavailable: "Недоступно",
        loading: "Загрузка...",
        error: "Ошибка загрузки данных"
    }
};

// Функция смены языка
function setLanguage(lang) {
    currentLang = lang;
    
    // Обновляем активную кнопку языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Обновляем все элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Обновляем динамический контент
    updateDynamicContent();
    
    // Сохраняем выбор языка
    localStorage.setItem('warframe-language', lang);
}

// Функция обновления динамического контента после смены языка
function updateDynamicContent() {
    // Обновляем статусы миров
    for (const world in worldData) {
        updateWorldDisplay(world, worldData[world]);
    }
    
    // Обновляем Baro Ki'Teer
    if (baroData.isHere !== undefined) {
        updateBaroDisplay(baroData);
    }
    
    // Обновляем время последнего обновления
    updateLastUpdateTime();
}
