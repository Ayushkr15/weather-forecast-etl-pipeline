import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWeatherData(data.reverse());
        } else {
          console.error("Invalid API response format:", data);
          setError("Invalid API response format.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError("Error fetching weather data.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <h1 className="text-center mt-4">Loading Weather Data...</h1>;
  if (error) return <h1 className="text-center mt-4 text-danger">{error}</h1>;

  const labels = weatherData.map(day => day.date);
  const maxTemp = weatherData.map(day => day.max_temp);
  const minTemp = weatherData.map(day => day.min_temp);
  const weatherConditions = weatherData.map(day => day.weather_condition);

  const conditionCounts = weatherConditions.reduce((acc, condition) => {
    acc[condition] = (acc[condition] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">🌦️ Weather Forecast Dashboard</h1>
      <div className="row">
        {/* Temperature Trend (Line Chart) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">Temperature Trend (Upcoming 7 Days)</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Max Temperature (°C)",
                      data: maxTemp,
                      borderColor: "red",
                      fill: false,
                    },
                    {
                      label: "Min Temperature (°C)",
                      data: minTemp,
                      borderColor: "blue",
                      fill: false,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Temperature Distribution (Bar Chart) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">Max vs Min Temperature</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Bar
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Max Temperature (°C)",
                      data: maxTemp,
                      backgroundColor: "red",
                    },
                    {
                      label: "Min Temperature (°C)",
                      data: minTemp,
                      backgroundColor: "blue",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Weather Condition Distribution (Pie Chart) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">Weather Condition Distribution</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Pie
                data={{
                  labels: Object.keys(conditionCounts),
                  datasets: [
                    {
                      data: Object.values(conditionCounts),
                      backgroundColor: ["orange", "gray", "yellow", "blue"],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Temperature Spread (Bar Chart) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">Temperature Variability</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Bar
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Temperature Range (°C)",
                      data: maxTemp.map((t, i) => t - minTemp[i]),
                      backgroundColor: "purple",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Future Expansion: Humidity Trend */}
        <div className="col-md-12 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">Humidity Trend (Future Data)</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Humidity (%)",
                      data: [65, 70, 68, 72, 75, 73, 74],
                      borderColor: "green",
                      fill: false,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
