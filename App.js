import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [play, setPlay] = useState(true);
  /* SpeedTest */
  const [speedTest, setSpeedTest] = useState([]);

  useEffect(() => {
    if (play) {
      let res = api.req_speedTest();
      res
        .then((r) => {
          setSpeedTest((ping) => [...ping, (r / 8).toFixed(2)]);
          console.log("r: ", r);
        })
        .catch((e) => console.log(e));
    }
  }, [speedTest, play]);

  /* CHART JS */
  const options = {
    responsive: true,
    min: 0,
    scales: {
      y: {
        type: "linear",
        min: 0,
        ticks: {
          stepSize: 5,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "SpeedTest",
      },
    },
  };

  // Chronomètre
  var centi = 0;
  var mili = 0;
  var sec = 0;
  var sec_;
  const chrono = () => {
    setInterval(function () {
      mili++;
      if (mili > 9) {
        mili = 0;
      }
    }, 1);

    centi++;
    centi * 10; //=======pour passer en dixièmes de sec
    //=== on remet à zéro quand on passe à 1seconde
    if (centi > 9) {
      centi = 0;
      sec++;
    }

    if (sec < 10) {
      sec_ = "0" + sec;
    } else {
      sec_ = sec;
    }

    console.log(sec_ + ":" + centi + mili);
    return sec_ + ":" + centi + mili;
  };

  const labels = speedTest.map((s) => {
    // DATE TIME
    return chrono();
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Mo/s",
        data: speedTest.map((s) => s),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  speedTest.map((s) => console.log("ss : ", s));
  return (
    <div className="App">
      <p className="text-mo">
        {speedTest.length !== 0
          ? (speedTest[speedTest.length - 1])
          : "..."}
        mo/s
      </p>
      <Line options={options} data={data} />

      {play ? (
        <div onClick={() => setPlay(!play)} className="btn stop"></div>
      ) : (
        <div onClick={() => setPlay(!play)} className="btn start"></div>
      )}
    </div>
  );
}

export default App;
