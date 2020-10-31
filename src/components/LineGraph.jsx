import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: (tooltipItem) => numeral(tooltipItem.value).format("+0,0"),
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: (value) => numeral(value).format("0a"),
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

const LineGraph = ({ casesType, ...props }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const axiosData = async () => {
      await axios
        .get("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((data) => {
          let chartData = buildChartData(data.data, casesType);
          setData(chartData);
        });
    };
    axiosData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                data: data,
                backgroundColor: "rgba(255, 99, 132, 0.4)",
                borderColor: "rgba(255, 99, 132, 1)",
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default LineGraph;
