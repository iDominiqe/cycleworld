// API константы и функции
const API_BASE = 'https://api.warframestat.us/';

// Функция получения данных с API
async function fetchAPIData() {
    updateSyncStatus(true);
    
    try {
        const platform = currentPlatform;
        console.log(`Fetching data for platform: ${platform}`);
        
        const endpoints = [
            'earthCycle',
            'cetusCycle', 
            'vallisCycle',
            'cambionCycle',
            'duviriCycle',
            'zarimanCycle',
            'voidTrader'
        ];
        
        const requests = endpoints.map(endpoint => 
            fetch(`${API_BASE}${platform}/${endpoint}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .catch(error => {
                    console.error(`Error fetching ${endpoint}:`, error);
                    return null;
                })
        );
        
        const results = await Promise.all(requests);
        
        // Проверяем, есть ли ошибки в результатах
        const validResults = results.filter(result => result !== null);
        if (validResults.length === 0) {
            throw new Error('All API requests failed');
        }
        
        const [earth, cetus, vallis, cambion, duviri, zariman, baro] = results;
        
        // Обновляем время сервера
        lastServerTime = Date.now();
        
        // Обрабатываем данные миров (только если они есть)
        if (earth) {
            processWorldData('earth', earth, {
                isDay: earth.isDay,
                expiry: earth.expiry,
                totalTime: 4 * 60 * 60, // 4 часа
                dayStatus: '☀️ Day',
                nightStatus: '🌙 Night',
                dayOrbiter: '☀️',
                nightOrbiter: '🌙'
            });
        }
        
        if (cetus) {
            processWorldData('cetus', cetus, {
                isDay: cetus.isDay,
                expiry: cetus.expiry,
                totalTime: 2.5 * 60 * 60, // 2.5 часа
                dayStatus: '☀️ Day',
                nightStatus: '🌙 Night',
                dayOrbiter: '☀️',
                nightOrbiter: '🌙'
            });
        }
        
        if (vallis) {
            processWorldData('vallis', vallis, {
                isDay: vallis.isWarm,
                expiry: vallis.expiry,
                totalTime: 4 * 60 * 60, // 4 часа
                dayStatus: '🔥 Warm',
                nightStatus: '❄️ Cold',
                dayOrbiter: '🔥',
                nightOrbiter: '❄️'
            });
        }
        
        if (cambion) {
            processWorldData('cambion', cambion, {
                isDay: cambion.active === 'fass',
                expiry: cambion.expiry,
                totalTime: 3 * 60 * 60, // 3 часа
                dayStatus: '🌞 Fass',
                nightStatus: '🌚 Vome',
                dayOrbiter: '🌞',
                nightOrbiter: '🌚'
            });
        }
        
        if (duviri) {
            processWorldData('duviri', duviri, {
                state: duviri.state,
                expiry: duviri.expiry,
                totalTime: 1 * 60 * 60, // 1 час
                statusMap: {
                    'joy': '😊 Joy',
                    'sorrow': '😔 Sorrow', 
                    'fear': '😱 Fear',
                    'anger': '😠 Anger',
                    'envy': '😒 Envy'
                },
                orbiterMap: {
                    'joy': '😊',
                    'sorrow': '😔',
                    'fear': '😱',
                    'anger': '😠',
                    'envy': '😒'
                }
            });
        }
        
        if (zariman) {
            processWorldData('zariman', zariman, {
                state: zariman.state,
                expiry: zariman.expiry,
                totalTime: 3 * 60 * 60, // 3 часа
                statusMap: {
                    'corpus': '🤖 Corpus',
                    'grineer': '💥 Grineer'
                },
                orbiterMap: {
                    'corpus': '🤖',
                    'grineer': '💥'
                }
            });
        }
        
        // Обрабатываем данные Baro
        if (baro) {
            const now = Date.now();
            const activationTime = new Date(baro.activation).getTime();
            const expiryTime = new Date(baro.expiry).getTime();
            
            baroData = {
                isHere: baro.active,
                timeLeft: Math.floor(baro.active ? 
                    Math.max(0, (expiryTime - now) / 1000) : 
                    Math.max(0, (activationTime - now) / 1000)),
                location: baro.active ? baro.location : '',
                inventory: baro.active ? (baro.inventory || []).map(item => item.item) : []
            };
            
            updateBaroDisplay(baroData);
        }
        
        updateLastUpdateTime();
        updateSyncStatus(false);
        console.log('Data updated successfully');
        
    } catch (error) {
        console.error('Error fetching API data:', error);
        updateSyncStatus(false);
        
        // Показываем ошибку пользователю
        showErrorMessage(error.message);
    }
}

// Функция показа сообщения об ошибке
function showErrorMessage(message) {
    const worlds = ['earth', 'cetus', 'vallis', 'cambion', 'duviri', 'zariman'];
    worlds.forEach(world => {
        const statusElement = document.getElementById(`${world}-status`);
        if (statusElement) {
            statusElement.textContent = `❌ ${translations[currentLang].error}`;
            statusElement.style.color = '#ff6b6b';
        }
    });
    
    const baroStatus = document.getElementById('baro-status');
    if (baroStatus) {
        baroStatus.textContent = `❌ ${translations[currentLang].error}`;
        baroStatus.style.color = '#ff6b6b';
    }
    
    // Показываем уведомление
    const syncStatus = document.getElementById('sync-status');
    if (syncStatus) {
        syncStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>API Error</span>`;
        syncStatus.style.color = '#ff6b6b';
    }
}

// Функция обработки данных мира
function processWorldData(world, data, config) {
    const now = Date.now();
    const expiryTime = new Date(data.expiry).getTime();
    const timeLeft = Math.floor(Math.max(0, (expiryTime - now) / 1000));
    
    let status, orbiter, currentState;
    
    if (config.state) {
        // Для миров с состояниями (Duviri, Zariman)
        const stateKey = data.state.toLowerCase();
        status = config.statusMap[stateKey] || data.state;
        orbiter = config.orbiterMap[stateKey] || '❓';
        currentState = stateKey;
    } else {
        // Для миров с день/ночь
        status = config.isDay ? config.dayStatus : config.nightStatus;
        orbiter = config.isDay ? config.dayOrbiter : config.nightOrbiter;
        currentState = config.isDay ? 'day' : 'night';
    }
    
    // Проверяем смену состояния для анимации
    if (previousStates[world] && previousStates[world] !== currentState) {
        animateCycleChange(world);
    }
    previousStates[world] = currentState;
    
    // Переводим статус если язык русский
    if (currentLang === 'ru') {
        status = status
            .replace('Day', 'День')
            .replace('Night', 'Ночь')
            .replace('Warm', 'Тепло')
            .replace('Cold', 'Холод')
            .replace('Fass', 'Фасс')
            .replace('Vome', 'Вом')
            .replace('Joy', 'Радость')
            .replace('Sorrow', 'Печаль')
            .replace('Anger', 'Гнев')
            .replace('Fear', 'Страх')
            .replace('Envy', 'Зависть')
            .replace('Corpus', 'Корпус')
            .replace('Grineer', 'Гринир');
    }
    
    worldData[world] = {
        status: status,
        timeLeft: timeLeft,
        totalTime: config.totalTime,
        orbiter: orbiter
    };
    
    updateWorldDisplay(world, worldData[world]);
}

// Функция для тестирования API
async function testAPI() {
    try {
        const response = await fetch('https://api.warframestat.us/pc/earthCycle');
        const data = await response.json();
        console.log('API Test Response:', data);
        return data;
    } catch (error) {
        console.error('API Test Failed:', error);
        return null;
    }
}
