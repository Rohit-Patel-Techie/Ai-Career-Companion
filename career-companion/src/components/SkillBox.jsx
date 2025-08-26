import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Normalize incoming skills into [{ name, proficiency }]
const normalizeSkills = (skillsList) => {
  return (Array.isArray(skillsList) ? skillsList : [])
    .map((s) => {
      if (s && typeof s === "object") {
        const name = (s.name || "").trim();
        const prof = Math.max(0, Math.min(100, Number(s.proficiency) || 0));
        return name ? { name, proficiency: prof } : null;
      }
      if (typeof s === "string") {
        const str = s.trim();
        if (!str) return null;
        if (str.includes(":")) {
          const [n, p] = str.split(":");
          const prof = parseInt(p, 10);
          return { name: (n || "").trim(), proficiency: isNaN(prof) ? 50 : Math.max(0, Math.min(100, prof)) };
        }
        const match = str.match(/\((\d{1,3})\s*\/\s*100\)/);
        if (match) {
          const prof = parseInt(match[1], 10);
          return { name: str.replace(/\(.*\)/, "").trim(), proficiency: Math.max(0, Math.min(100, prof)) };
        }
        return { name: str, proficiency: 50 };
      }
      return null;
    })
    .filter(Boolean);
};

const SkillBox = ({ skills = [] }) => {
  const normalized = normalizeSkills(skills);
  const labels = normalized.map((s) => s.name);
  const values = normalized.map((s) => s.proficiency);
  const labelCount = labels.length;
  const labelFontSize = labelCount <= 6 ? 14 : labelCount <= 10 ? 12 : 11;
  const sortedForList = normalized.slice().sort((a, b) => (Number(b.proficiency) || 0) - (Number(a.proficiency) || 0));

  const primary = {
    bg: "rgba(79, 70, 229, 0.25)", // indigo-600 w/ alpha
    border: "rgba(79, 70, 229, 0.8)",
    point: "rgba(79, 70, 229, 1)",
  };

  const data = {
    labels: labels.length ? labels : ["Add skills in your profile"],
    datasets: [
      {
        label: "Proficiency",
        data: values.length ? values : [50],
        backgroundColor: primary.bg,
        borderColor: primary.border,
        pointBackgroundColor: primary.point,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: primary.point,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed.r}%`,
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          showLabelBackdrop: false,
          color: "#64748B", // slate-500
          z: 10,
          font: { size: 12, weight: "600" },
          callback: (v) => `${v}%`,
        },
        angleLines: {
          color: "rgba(99, 102, 241, 0.12)", // indigo tint
        },
        grid: {
          color: "rgba(99, 102, 241, 0.12)",
        },
        pointLabels: {
          color: "#334155", // slate-700
          font: { size: labelFontSize, weight: "600" },
          padding: 4,
        },
      },
    },
    elements: {
      line: { tension: 0.25 },
      point: { radius: 3, hoverRadius: 5 },
    },
    animation: { duration: 800, easing: "easeOutQuart" },
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-full ">
      <h2 className="text-xl font-bold mb-4">Your Skills</h2>
      {normalized.length ? (
        <div className="flex flex-col space-y-8">
          {/* Radar Chart */}
          <div className="w-full h-80 ">
            <Radar data={data} options={options} />
          </div>

          {/* Skill list with progress bars */}
          <div className="w-full space-y-4 ">
            {sortedForList.map((s, idx) => (
              <div key={`${s.name}-${idx}`} className="w-full">
                <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span className="truncate" title={s.name}>{s.name}</span>
                  <span>{Math.round(s.proficiency)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, s.proficiency))}%`,
                      background: "linear-gradient(90deg, rgba(79,70,229,1) 0%, rgba(59,130,246,1) 100%)",
                    }}
                  />
                </div>
              </div>
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
