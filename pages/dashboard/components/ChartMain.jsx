import { useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, TimeScale } from "chart.js";
import 'chartjs-adapter-date-fns';
import { parseISO } from 'date-fns';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, Title, TimeScale
);

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Count of Different Malfunctions',
    },
  },
};

const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'OEE Over Time',
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
      },
      title: {
        display: true,
        text: 'Date',
      },
    },
    y: {
      title: {
        display: true,
        text: 'OEE (%)',
      },
      beginAtZero: true,
    },
  },
};

const ChartMain = ({ malfunctions, shifts, selectedStation }) => {
  const [stationData, setStationData] = useState(null);
  const [lineData, setLineData] = useState(null);

  console.log(shifts)
  useEffect(() => {
    if (malfunctions.length > 0) {
      const filteredMalfunctions = malfunctions.filter(
        (malfunction) => malfunction.station === selectedStation
      );

      const malfunctionReasons = [...new Set(filteredMalfunctions.map(m => m.Reason))];
      const malfunctionCounts = malfunctionReasons.map(Reason =>
        filteredMalfunctions.filter(m => m.Reason === Reason).length
      );

      const backgroundColors = malfunctionReasons.map(
        () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
      );

      const pieData = {
        labels: malfunctionReasons,
        datasets: [
          {
            label: 'Malfunctions',
            data: malfunctionCounts,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color),
            borderWidth: 1,
          },
        ],
      };

      setStationData(pieData);
    } else {
      // Reset stationData if malfunctions are empty
      setStationData(null);
    }

    if (shifts.length > 0) {
      const shiftDates = shifts.map(shift => parseISO(shift.date));
      const shiftOEEs = shifts.map(shift => shift.oee);

      console.log(shiftOEEs)
      const lineData = {
        labels: shiftDates,
        datasets: [
          {
            label: 'OEE',
            data: shiftOEEs,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
          },
        ],
      };

      console.log(lineData)
      setLineData(lineData);
    } else {
      // Reset lineData if shifts are empty
      setLineData(null);
    }
  }, [malfunctions, shifts, selectedStation]);

  return (
    <div className="widget-content" style={{ width: "500px" }}>
      {stationData ? (
        <Pie options={pieOptions} data={stationData} />
      ) : (
        <p>No data available for the selected station.</p>
      )}
      {lineData ? (
        <Line options={lineOptions} data={lineData} />
      ) : (
        <p>No OEE data available for the shifts.</p>
      )}
    </div>
  );
};

export default ChartMain;
