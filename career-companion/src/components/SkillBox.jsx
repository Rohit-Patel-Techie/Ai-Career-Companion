import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SkillBox = ({ skills = [] }) => {
  // Prepare data for pie chart
  const data = {
    labels: skills,
    datasets: [
      {
        label: "Skills Distribution",
        data: skills.map(() => 1), // Equal weight for each skill
        backgroundColor: [
          "#4F46E5", // Indigo-600
          "#6366F1", // Indigo-500
          "#818CF8", // Indigo-400
          "#A5B4FC", // Indigo-300
          "#C7D2FE", // Indigo-200
          "#E0E7FF", // Indigo-100
          "#4338CA", // Indigo-700
          "#3730A3", // Indigo-800
          "#312E81", // Indigo-900
          "#2563EB", // Blue-600
          "#3B82F6", // Blue-500
          "#60A5FA", // Blue-400
          "#93C5FD", // Blue-300
          "#BFDBFE", // Blue-200
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return percentage + '%';
        },
        font: {
          weight: 'bold',
          size: 14,
        },
      },
      legend: {
        position: "bottom",
        labels: {
          color: "#4B5563", // Gray-600
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return context.label + ': ' + context.parsed + ' skill(s)';
          }
        }
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-full">
      <h2 className="text-xl font-bold mb-4">Your Skills</h2>
      {skills.length ? (
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="w-full md:w-1/2 h-64 flex justify-center items-center">
            <Pie data={data} options={options} />
          </div>
          {/* Grid Layout for Tags */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4 md:mt-0 w-full">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-block px-4 py-2 h-8 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out transform hover:bg-indigo-200 min-w-0"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400">No skills listed.</p>
      )}
    </div>
  );
};

export default SkillBox;
