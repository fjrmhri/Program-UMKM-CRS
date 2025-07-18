import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartComp({ raw }) {
  const labels = raw.map((d) => d.nama);
  const data = {
    labels,
    datasets: [
      {
        label: "Pre Test",
        data: raw.map((d) => d.pre),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        label: "Post Test",
        data: raw.map((d) => d.post),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
      },
      {
        label: "Selisih",
        data: raw.map((d) => d.post - d.pre),
        backgroundColor: "rgba(234, 179, 8, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Grafik Perbandingan Pre, Post, dan Selisih",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Nilai" },
        ticks: { stepSize: 10, precision: 0 },
      },
      x: {
        title: { display: true, text: "Peserta" },
      },
    },
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Grafik Pre, Post & Selisih</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
