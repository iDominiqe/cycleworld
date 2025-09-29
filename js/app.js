// Глобальные переменные
let currentLang = 'en';
let currentPlatform = 'pc';
let countdownInterval;
let syncInterval;
let worldData = {};
let baroData = {};
let lastServerTime = Date.now();
let previousStates = {};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сохраненный язык
    const savedLang = localStorage.getItem('warframe-language') || 'en';
    setLanguage(savedLang);
    
    // Создаем карточки миров
    createWorldCards();
    
    // Обработчики для кнопок языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setLanguage(this.dataset.lang);
        });
    });
    
    // Обработчики для вкладок контента
    document.querySelectorAll('.content-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Обновляем активные вкладки
            document.querySelectorAll('.content-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Показываем соответствующий раздел
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${tabId}-section`).classList.add('active');
        });
    });
    
    // Обработчики для переключателя платформ
    document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.dataset.platform;
            
            // Обновляем активные кнопки платформ
            document.querySelectorAll('.platform-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Обновляем текущую платформу
            currentPlatform = platform;
            
            // Загружаем данные для выбранной платформы
            fetchAPIData();
        });
    });
    
    // Инициализация данных
    fetchAPIData();
    
    // Запускаем обновление времени каждую секунду
    countdownInterval = setInterval(updateCountdowns, 1000);
    
    // Синхронизируем с сервером каждые 15 секунд
    syncInterval = setInterval(fetchAPIData, 15000);
    
    // Обновляем события и статус
    updateEventsData();
    updateStatusData();
});

// Функция создания карточек миров
function createWorldCards() {
    const worldsGrid = document.getElementById('worlds-grid');
    const worlds = [
        { id: 'earth', icon: '🌍', titleKey: 'earthTitle', locationKey: 'earthLocation' },
        { id: 'cetus', icon: '🏜️', titleKey: 'cetusTitle', locationKey: 'cetusLocation' },
        { id: 'vallis', icon: '🧊', titleKey: 'vallisTitle', locationKey: 'vallisLocation' },
        { id: 'cambion', icon: '💀', titleKey: 'cambionTitle', locationKey: 'cambionLocation' },
        { id: 'duviri', icon: '👑', titleKey: 'duviriTitle', locationKey: 'duviriLocation' },
        { id: 'zariman', icon: '🚀', titleKey: 'zarimanTitle', locationKey: 'zarimanLocation' }
    ];

    worlds.forEach(world => {
        const worldCard = document.createElement('div');
        worldCard.className = `world-card ${world.id}`;
        worldCard.innerHTML = `
            <div class="cycle-transition" id="${world.id}-transition" data-i18n="cycleChange">Cycle change...</div>
            <div>
                <h2>${world.icon} <span data-i18n="${world.titleKey}">${translations.en[world.titleKey]}</span></h2>
                <p class="location-name" data-i18n="${world.locationKey}">${translations.en[world.locationKey]}</p>
            </div>
            <div>
                <div class="diagram">
                    <div class="planet">${world.icon}</div>
                    <div class="orbit" id="${world.id}-orbit">
                        <div class="orbiter" id="${world.id}-orbiter">☀️</div>
                    </div>
                </div>
                <div class="status-container">
                    <div id="${world.id}-status" class="status">Loading...</div>
                    <div id="${world.id}-timer" class="timer">--:--:--</div>
                    <div id="${world.id}-change-time" class="change-time" data-i18n="changeTime">Change: --:--</div>
                </div>
                <div class="progress-bar">
                    <div id="${world.id}-progress" class="progress" style="width: 0%"></div>
                </div>
            </div>
        `;
        worldsGrid.appendChild(worldCard);
    });
}

// Остальные функции (updateWorldDisplay, updateBaroDisplay, animateCycleChange, updateCountdowns и т.д.)
// ... (все остальные функции из предыдущего кода)
