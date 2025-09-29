class UI {
    static initWorldCards() {
        const worldsGrid = document.getElementById('worlds-grid');
        const worlds = [
            { id: 'earth', icon: '🌍', titleKey: 'earthTitle', locationKey: 'earthLocation' },
            { id: 'cetus', icon: '🏜️', titleKey: 'cetusTitle', locationKey: 'cetusLocation' },
            { id: 'vallis', icon: '🧊', titleKey: 'vallisTitle', locationKey: 'vallisLocation' },
            { id: 'cambion', icon: '💀', titleKey: 'cambionTitle', locationKey: 'cambionLocation' },
            { id: 'duviri', icon: '👑', titleKey: 'duviriTitle', locationKey: 'duviriLocation' },
            { id: 'zariman', icon: '🚀', titleKey: 'zarimanTitle', locationKey: 'zarimanLocation' }
        ];

        worldsGrid.innerHTML = worlds.map(world => `
            <div class="world-card ${world.id}">
                <div class="cycle-transition" id="${world.id}-transition" data-i18n="cycleChange">Cycle change...</div>
                <div>
                    <h2>${world.icon} <span data-i18n="${world.titleKey}">${world.id}</span></h2>
                    <p class="location-name" data-i18n="${world.locationKey}">Location</p>
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
            </div>
        `).join('');
    }

    static updateWorldDisplay(world, data, lang) {
        const statusElement = document.getElementById(`${world}-status`);
        const timerElement = document.getElementById(`${world}-timer`);
        const changeTimeElement = document.getElementById(`${world}-change-time`);
        const progressElement = document.getElementById(`${world}-progress`);
        const orbiterElement = document.getElementById(`${world}-orbiter`);
        const orbitElement = document.getElementById(`${world}-orbit`);

        if (statusElement) statusElement.textContent = data.status;
        if (timerElement) timerElement.textContent = this.formatWorldTime(data.timeLeft);
        if (progressElement) {
            const progressPercent = 100 - (data.timeLeft / data.totalTime * 100);
            progressElement.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
        }
        if (orbiterElement) orbiterElement.textContent = data.orbiter;
        
        // Update orbit rotation
        if (orbitElement && orbiterElement) {
            const rotation = (360 * (1 - data.timeLeft / data.totalTime));
            orbitElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            orbiterElement.style.transform = `rotate(${-rotation}deg)`;
        }

        // Update change time
        if (changeTimeElement) {
            const changeTime = new Date(Date.now() + data.timeLeft * 1000);
            const timeString = changeTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
            changeTimeElement.textContent = `${translations[lang].changeTime} ${timeString}`;
        }

        // Update timer warnings
        if (timerElement) {
            timerElement.classList.remove('warning', 'critical');
            if (data.timeLeft < 600) timerElement.classList.add('critical');
            else if (data.timeLeft < 1800) timerElement.classList.add('warning');
        }
    }

    static updateBaroDisplay(data, lang) {
        const elements = {
            status: document.getElementById('baro-status'),
            timer: document.getElementById('baro-timer'),
            changeTime: document.getElementById('baro-change-time'),
            location: document.getElementById('baro-location'),
            inventory: document.getElementById('baro-inventory')
        };

        if (data.isHere) {
            elements.status.textContent = `👳 ${translations[lang].baroTitle} - ${translations[lang].here}`;
            elements.timer.textContent = this.formatBaroTime(data.timeLeft);
            elements.location.textContent = data.location;
            
            if (data.inventory && data.inventory.length > 0) {
                elements.inventory.innerHTML = '<div class="baro-items">' + 
                    data.inventory.map(item => `<span class="baro-item">${item}</span>`).join('') + 
                    '</div>';
            } else {
                elements.inventory.textContent = translations[lang].unavailable;
            }

            const departureTime = new Date(Date.now() + data.timeLeft * 1000);
            const timeString = departureTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
            elements.changeTime.textContent = `${translations[lang].departureTime} ${timeString}`;
        } else {
            elements.status.textContent = `👳 ${translations[lang].baroTitle} - ${translations[lang].coming}`;
            elements.timer.textContent = this.formatBaroTime(data.timeLeft);
            elements.location.textContent = translations[lang].unknown;
            elements.inventory.textContent = translations[lang].unavailable;

            const arrivalTime = new Date(Date.now() + data.timeLeft * 1000);
            const timeString = arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
            elements.changeTime.textContent = `${translations[lang].arrivalTime} ${timeString}`;
        }
    }

    static formatWorldTime(seconds) {
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    static formatBaroTime(seconds) {
        const totalSeconds = Math.floor(seconds);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        
        if (days > 0) {
            return `${days}${translations[App?.currentLang || 'en'].day} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}
