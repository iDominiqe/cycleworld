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
    UI.initWorldCards();
    
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
});

// Функция обновления отсчетов времени
function updateCountdowns() {
    // Обновляем время миров
    for (const world in worldData) {
        if (worldData[world].timeLeft > 0) {
            worldData[world].timeLeft--;
            UI.updateWorldDisplay(world, worldData[world], currentLang);
        }
    }
    
    // Обновляем время Baro
    if (baroData.timeLeft > 0) {
        baroData.timeLeft--;
        UI.updateBaroDisplay(baroData, currentLang);
    }
}

// Функция анимации смены цикла
function animateCycleChange(world) {
    const transitionElement = document.getElementById(`${world}-transition`);
    if (transitionElement) {
        transitionElement.classList.add('active');
        setTimeout(() => {
            transitionElement.classList.remove('active');
        }, 2000);
    }
}

// Функция обновления времени последнего обновления
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    document.getElementById('last-update').textContent = 
        `${translations[currentLang].lastUpdate} ${timeString}`;
}

// Функция обновления статуса синхронизации
function updateSyncStatus(syncing = false) {
    const syncStatusElement = document.getElementById('sync-status');
    if (syncStatusElement) {
        if (syncing) {
            syncStatusElement.classList.add('syncing');
            syncStatusElement.innerHTML = `<i class="fas fa-sync-alt"></i> <span data-i18n="syncing">${translations[currentLang].syncing}</span>`;
        } else {
            syncStatusElement.classList.remove('syncing');
            syncStatusElement.innerHTML = `<i class="fas fa-check-circle"></i> <span data-i18n="syncStatus">${translations[currentLang].syncStatus}</span>`;
        }
    }
}

// Функции для событий и статуса (заглушки)
function updateEventsData() {
    // Заглушка для событий
    document.getElementById('alerts-list').innerHTML = '<div class="event-item">No active alerts</div>';
    document.getElementById('events-list').innerHTML = '<div class="event-item">No active events</div>';
}

function updateStatusData() {
    // Заглушка для статуса
    document.getElementById('news-list').innerHTML = '<div class="status-item">Loading news...</div>';
}

// Обновляем отображение миров
function updateWorldDisplay(world, data) {
    UI.updateWorldDisplay(world, data, currentLang);
}

// Обновляем отображение Baro
function updateBaroDisplay(data) {
    UI.updateBaroDisplay(data, currentLang);
}

// Добавь это в конец app.js, перед последней закрывающей скобкой

// Функция для принудительного обновления данных
function forceRefresh() {
    fetchAPIData();
}

// Функция для смены платформы
function switchPlatform(platform) {
    currentPlatform = platform;
    
    // Обновляем активные кнопки платформ
    document.querySelectorAll('.platform-btn').forEach(b => {
        b.classList.remove('active');
        if (b.dataset.platform === platform) {
            b.classList.add('active');
        }
    });
    
    // Загружаем данные для выбранной платформы
    fetchAPIData();
}

// Экспортируем функции для глобального доступа
window.forceRefresh = forceRefresh;
window.switchPlatform = switchPlatform;
window.testAPI = testAPI;
