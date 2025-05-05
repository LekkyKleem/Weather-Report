import { useState, useEffect } from 'react';
import './WeatherApp.css';

// Типизация данных
type ForecastData = {
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

type WeatherProps = {
  city: string;
  forecastDays?: number; // Число дней для прогноза
};

// Функция для правильного склонения слова "день"
const getDayWord = (number: number) => {
  if (number % 100 >= 11 && number % 100 <= 14) {
    return 'дней';
  }
  const lastDigit = number % 10;
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
};

const Weather = ({ city, forecastDays = 1 }: WeatherProps) => {
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Функция для запроса данных о погоде
  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const apiKey = 'be61ea39971b82e35e204c4252d8c13e';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=ru`
      );

      if (!response.ok) throw new Error('Город не найден');

      const forecastData = await response.json();
      const filteredForecast = forecastData.list.filter(
        (item: ForecastData) => item.dt_txt.includes('12:00:00')
      );

      // Ограничиваем количество дней
      setForecast(filteredForecast.slice(0, forecastDays));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при изменении города или количества дней
  useEffect(() => {
    fetchWeatherData(city);
  }, [city, forecastDays]);

  return (
    <div className="weather">
      <h2>Прогноз на {forecastDays} {getDayWord(forecastDays)}</h2>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="forecast-cards">
        {forecast.length === 0 ? (
          <p>Пожалуйста, введите город для прогноза.</p>
        ) : (
          forecast.map((item, index) => (
            <div key={index} className="forecast-card">
              <p>
                <strong>{new Date(item.dt_txt).toLocaleDateString('ru-RU')}</strong>
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
              />
              <p>Температура: {item.main.temp}°C</p>
              <p>Ощущается как: {item.main.feels_like}°C</p>
              <p>Влажность: {item.main.humidity}%</p>
              <p>Описание: {item.weather[0].description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Weather;
