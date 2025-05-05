import { useState } from 'react';
import './WeatherApp.css';  // Импорт стилей
import Weather from './Weather';  // Подключение компонента Weather

const WeatherApp = () => {
  const [activeTab, setActiveTab] = useState<'today' | '3days' | '5days' | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');

    try {
      const apiKey = 'be61ea39971b82e35e204c4252d8c13e';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=ru`
      );

      if (!response.ok) throw new Error('Город не найден');

      const weatherData = await response.json();
      setData(weatherData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <div id="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1163/1163660.png"
          className="weather-logo"
          alt="Weather Logo"
        />

        <nav className="weather-nav">
          <button
            className={activeTab === 'today' ? 'active' : ''}
            onClick={() => setActiveTab('today')}
          >
            Сегодня
          </button>
          <button
            className={activeTab === '3days' ? 'active' : ''}
            onClick={() => setActiveTab('3days')}
          >
            На 3 дня
          </button>
          <button
            className={activeTab === '5days' ? 'active' : ''}
            onClick={() => setActiveTab('5days')}
          >
            На 5 дней
          </button>
        </nav>

        <div className="weather-search">
          <input
            type="text"
            placeholder="Введите город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchWeather(city);
            }}
          />
          <button onClick={() => fetchWeather(city)}>Найти</button>
        </div>
      </div>

      <div className="weather-content">
        {!city || !activeTab ? (
          <p>Выберите город и период на который хотите посмотреть прогноз погоды</p>
        ) : (
          <>
            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {data && (
              <>
                {activeTab === 'today' && <Weather city={city} forecastDays={1} />}
                {activeTab === '3days' && <Weather city={city} forecastDays={3} />}
                {activeTab === '5days' && <Weather city={city} forecastDays={5} />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
