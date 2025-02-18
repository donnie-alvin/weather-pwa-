const apiKey = 'c5979ec5eb849f97299c0a833c1fcabc'; // Replace with your OpenWeather API key

document.getElementById('getWeather').addEventListener('click', () => {
  const city = document.getElementById('city').value;
  const weatherResult = document.getElementById('weatherResult');
  
  if (city === '') {
    weatherResult.innerHTML = 'Please enter a city name!';
    return;
  }
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        weatherResult.innerHTML = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <p>Temperature: ${data.main.temp}°C</p>
          <p>Weather: ${data.weather[0].description}</p>
        `;
      } else {
        weatherResult.innerHTML = 'City not found!';
      }
    })
    .catch(() => {
      weatherResult.innerHTML = 'Unable to fetch weather data.';
    });
});
