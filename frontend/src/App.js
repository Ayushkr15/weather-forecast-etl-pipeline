import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2"; // Only Line and Bar now
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

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Real Time News Analysis</h1>
      <div className="row">
        {/* News Sentiment Trend (Line Chart) */}
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

        {/* News Distribution (Bar Chart) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">News Trend Distribution</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Bar
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Max Sentiment Score",
                      data: maxTemp,
                      backgroundColor: "red",
                    },
                    {
                      label: "Min Sentiment Score",
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

        {/* Sentiment Variability (Bar Chart) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">Daily News Article Volume (Last 7 Days)</div>
            <div className="card-body" style={{ height: "300px" }}>
              <Bar
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Sentiment Variability",
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

        {/* Trending Category (Line Chart) */}
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
                      data: [65, 70, 68, 72, 75, 73, 78],
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
