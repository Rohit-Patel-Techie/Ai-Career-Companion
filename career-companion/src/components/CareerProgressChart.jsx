import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const CareerProgressChart = ({ skills = [] }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

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
                        return { name: (n || "").trim(), proficiency: isNaN(prof) ? 0 : Math.max(0, Math.min(100, prof)) };
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

    const normalized = normalizeSkills(skills);
    const topNormalized = normalized
        .slice()
        .sort((a, b) => (Number(b.proficiency) || 0) - (Number(a.proficiency) || 0))
        .slice(0, 5);
    const labels = topNormalized.length ? topNormalized.map((s) => s.name) : ["Skill Proficiency (example)"];
    const profValues = topNormalized.length ? topNormalized.map((s) => s.proficiency) : [50];

    // Education-themed color palette (Indigo, Cyan, Green, Amber, Purple, Blue)
    const palette = [
        { bg: 'rgba(79, 70, 229, 0.85)', border: 'rgba(79, 70, 229, 1)', hover: 'rgba(79, 70, 229, 0.95)' },   // indigo-600
        { bg: 'rgba(6, 182, 212, 0.85)', border: 'rgba(6, 182, 212, 1)', hover: 'rgba(6, 182, 212, 0.95)' },   // cyan-500
        { bg: 'rgba(34, 197, 94, 0.85)', border: 'rgba(34, 197, 94, 1)', hover: 'rgba(34, 197, 94, 0.95)' },   // green-500
        { bg: 'rgba(245, 158, 11, 0.85)', border: 'rgba(245, 158, 11, 1)', hover: 'rgba(245, 158, 11, 0.95)' }, // amber-500
        { bg: 'rgba(168, 85, 247, 0.85)', border: 'rgba(168, 85, 247, 1)', hover: 'rgba(168, 85, 247, 0.95)' }, // purple-500
        { bg: 'rgba(59, 130, 246, 0.85)', border: 'rgba(59, 130, 246, 1)', hover: 'rgba(59, 130, 246, 0.95)' }, // blue-500
    ];
    const bgColors = profValues.map((_, i) => palette[i % palette.length].bg);
    const borderColors = profValues.map((_, i) => palette[i % palette.length].border);
    const hoverColors = profValues.map((_, i) => palette[i % palette.length].hover);

    const data = {
        labels,
        datasets: [
            {
                label: "Skill Proficiency",
                data: profValues,
                backgroundColor: bgColors,
                borderColor: borderColors,
                hoverBackgroundColor: hoverColors,
                hoverBorderColor: borderColors,
                borderWidth: 2,
                borderRadius: 8,
                maxBarThickness: 48,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#334155', font: { size: 12, weight: '500' } },
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: '#94A3B8',
                    font: { size: 11, weight: '500' },
                    callback: (val) => `${val}%`,
                },
                grid: { color: 'rgba(99, 102, 241, 0.06)' },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111827',
                titleColor: '#F8FAFC',
                bodyColor: '#E5E7EB',
                borderColor: '#3B82F6',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
            },
            // Disable ChartDataLabels plugin if present to avoid duplicate labels
            datalabels: { display: false },
        },
        elements: { bar: { borderRadius: 8 } },
        animation: { duration: 900, easing: 'easeOutQuart' },
    };

    // Helper: choose contrasting text color for a given rgba/bg color
    const getContrastColor = (rgba) => {
        const m = typeof rgba === 'string' && rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i);
        let r = 60, g = 60, b = 60;
        if (m) {
            r = parseInt(m[1], 10);
            g = parseInt(m[2], 10);
            b = parseInt(m[3], 10);
        }
        const srgb = [r / 255, g / 255, b / 255].map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
        const luminance = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
        return luminance < 0.5 ? '#111827' : '#F8FAFC';
    };

    // Plugin: draw single percentage label per bar positioned relative to bar height
    const valueLabelsPlugin = {
        id: 'valueLabels',
        afterDatasetsDraw(chart) {
            const { ctx, data, chartArea } = chart;
            ctx.save();
            data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                if (!meta || meta.hidden) return;
                meta.data.forEach((bar, index) => {
                    const raw = dataset.data[index];
                    if (raw === null || raw === undefined) return;
                    const value = Math.round(raw);

                    const { x, y, base } = bar.getProps(['x', 'y', 'base'], true);
                    const isPositive = y < base;

                    // Place label slightly above the bar for positive values
                    let labelY = isPositive ? y - 8 : y + 8;
                    // If too close to top edge, place inside the bar
                    if (labelY < chartArea.top + 10) labelY = y + 14;
                    // Clamp to chart area
                    labelY = Math.max(chartArea.top + 8, Math.min(chartArea.bottom - 8, labelY));

                    const bg = Array.isArray(dataset.backgroundColor)
                        ? dataset.backgroundColor[index]
                        : dataset.backgroundColor;
                    const textColor = getContrastColor(bg);

                    ctx.font = '700 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Single draw (stroke for halo + fill for text)
                    ctx.lineWidth = 3;
                    // ctx.strokeStyle = 'rgba(0,0,0,0.25)';
                    // ctx.strokeText(`${value}%`, x, labelY);
                    ctx.fillStyle = textColor;
                    ctx.fillText(`${value}%`, x, labelY);
                });
            });
            ctx.restore();
        },
    };

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
            type: "bar",
            data,
            options,
            plugins: [valueLabelsPlugin],
        });

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [skills]);

    return (
        <div className="bg-white shadow rounded-lg p-6 h-[300px]">
            <h2 className="text-xl font-bold mb-4">Top 5 Skill Proficiency</h2>
            <canvas ref={chartRef} />
        </div>
    );
};

export default CareerProgressChart;