import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Filler,Tooltip,Legend,} from "chart.js";
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Filler,Tooltip,Legend);
import { Line } from "react-chartjs-2";

export default function AreaChart() {
  const data = {
    labels: ["Mar 1", "Mar 3", "Mar 5", "Mar 7", "Mar 9", "Mar 11", "Mar 13"],
    datasets: [
      {
        label: "Sessions",
        data: [10000, 30000, 25000, 20000, 30000, 26000, 35000],
        fill: true,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Line data={data} options={options} className="p-4" />;
}