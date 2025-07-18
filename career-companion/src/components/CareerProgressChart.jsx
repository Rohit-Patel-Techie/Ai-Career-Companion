import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const CareerProgressChart = ({ skills = [] }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const skillArray = skills.filter(Boolean);
    const data = {
        labels: skillArray.length ? skillArray : ["Skill Proficiency (example)"],
        datasets: [
            {
                label: "Skill Proficiency Chart",
                data: skillArray.map(() => Math.floor(Math.random() * 100) + 1),
                backgroundColor: "rgba(99, 102, 241, 0.7)",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
    };

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy(); // clean up
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
            type: "bar",
            data,
            options,
        });

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [skills]);

    return (
        <div className="bg-white shadow rounded-lg p-6 h-[300px]">
            <h2 className="text-xl font-bold mb-4">Skill Proficiency</h2>
            <canvas ref={chartRef} />
        </div>
    );
};

export default CareerProgressChart;