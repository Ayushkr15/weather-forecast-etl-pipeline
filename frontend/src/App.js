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
    return <h1 className="text-center mt-4">Loading Real Time News Data...</h1>;
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
      <h1 className="text-center mb-4"> Real Time News Analysis </h1>
      <div className="row">
        {/* Temperature Trend (Line Chart) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">News Article Activity Trend (Next 7 Days)</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Sentiment Score",
                      data: maxTemp,
                      borderColor: "red",
                      fill: false,
                    },
                    {
                      label: "Number of News Articles",
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
            <div className="card-header">News Trend</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Bar
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Date",
                      data: maxTemp,
                      backgroundColor: "red",
                    },
                    {
                      label: "Number of News Articles",
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

const NewsCategoryChart = () => {
  const newsCategoryCounts = {
    "Politics News": 45,
    "Business News": 30,
    "Technology News": 15,
    "Entertainment News": 10,
  };

       <div className="col-md-6 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-header">News Category Distribution</div>
        <div className="card-body" style={{ height: "300px" }}>
          <Pie
            data={{
              labels: Object.keys(newsCategoryCounts),
              datasets: [
                {
                  data: Object.values(newsCategoryCounts),
                  backgroundColor: ["orange", "gray", "yellow", "blue"],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      </div>
    </div>

        {/* Temperature Spread (Bar Chart) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">Daily News Article Volume (Last 7 Days)</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Bar
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Frequency",
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
            <div className="card-header">Most Trending Category in India</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Politics",
                      data: [65, 70, 68, 72, 75, 73, 100],
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
