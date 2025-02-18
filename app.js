const apiKey = '2cd8038f6cf453c980ccc6b6129b46c9'; // Replace with your OpenWeather API key
const maxCities = 5;

// Get User Location
function getUserLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getNearbyCities(lat, lon);
        }, (error) => {
            console.error('Error getting location', error);
        });
    } else {
        console.error('Geolocation not supported');
    }
}

// Get Weather for 5 Nearby Cities
async function getNearbyCities(lat, lon) {
    const nearbyCities = await fetchNearbyCities(lat, lon);
    const weatherData = [];

    for (let i = 0; i < Math.min(nearbyCities.length, maxCities); i++) {
        const city = nearbyCities[i];
        const weather = await fetchWeather(city.lat, city.lon);
        weatherData.push(weather);
    }

    displayWeather(weatherData);
    localStorage.setItem('cachedWeather', JSON.stringify(weatherData));
}

// Fetch City Data (Dummy Function for now)
async function fetchNearbyCities(lat, lon) {
    return [
        { name: "City 1", lat: lat + 0.1, lon: lon + 0.1 },
        { name: "City 2", lat: lat - 0.1, lon: lon - 0.1 },
        { name: "City 3", lat: lat + 0.2, lon: lon - 0.2 },
        { name: "City 4", lat: lat - 0.2, lon: lon + 0.2 },
        { name: "City 5", lat: lat + 0.3, lon: lon + 0.3 }
    ];
}

// Fetch Weather Data
async function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch weather', error);
        return null;
    }
}

// Display Weather
function displayWeather(weatherData) {
    const container = document.getElementById('weather-container');
    container.innerHTML = '';

    weatherData.forEach((data) => {
        if (data) {
            const div = document.createElement('div');
            div.className = 'weather-card';
            div.innerHTML = `
                <h3>${data.name}</h3>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Condition: ${data.weather[0].description}</p>
            `;
            container.appendChild(div);
        }
    });
}

// Load Cached Weather When Offline
function loadCachedWeather() {
    const cachedData = localStorage.getItem('cachedWeather');
    if (cachedData) {
        displayWeather(JSON.parse(cachedData));
    }
}

// Initialize App
window.addEventListener('load', () => {
    if (navigator.onLine) {
        getUserLocation();
    } else {
        loadCachedWeather();
    }
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered', reg.scope))
        .catch(err => console.error('Service Worker registration failed', err));
}
