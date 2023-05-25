import Image from "next/image";
import { useEffect, useState } from "react";
import classes from "./Chart.module.css";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import BrandDark from "highcharts/themes/brand-dark";

export default function Chart(props) {
  const [chartOptions, setChartOptions] = useState({});
  //   const [chartData, setchartData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [buttonsLoaded, setButtonsLoaded] = useState(false);
  // console.log("props", props);
  // const [chartOptions, setChartOptions] = useState({})
  //   useEffect(() => {
  //     if (Object.keys(props.options).length === 0) {
  //         return;
  //     }
  //     setchartData(() => {
  //         return [...props.options.series[0].data]
  //     });
  //     }, [props.options]);

  useEffect(() => {
    if (Object.keys(props.options).length === 0) {
      return;
    }
    var data = props.options.series[0].data;
    if (props.options.series[0].type === "line") {
      data = data.map((item) => {
        return [item[0], item[4]];
      });
    }
    // const data = [[135,2345,534,234,653]];
    setChartOptions(() => {
      return {
        ...props.options,

        rangeSelector: {
          buttons: [
            {
              type: "all", //free api doesn't allow me to load all ranges on page load
              text: "Day",
              title: "Day",
              // events:{ click:()=>handleSelectorClick("day")}
            },
            {
              type: "all",
              text: "Month",
              title: "Month",
              // events:{ click:()=>handleSelectorClick("month")}
            },
            {
              type: "all",
              text: "all",
              title: "All",
              // events:{ click:()=>handleSelectorClick("all")}
            },
          ],
          selected: 0,
          allButtonsEnabled: true,
        },
        zoomType: "x",
        time: {
          timezoneOffset: new Date().getTimezoneOffset(),
        },
        xAxis: {
          title: Highcharts.Time,
        },
        series: [
          {
            ...props.options.series[0],
            type: chartType,
            data: data,
            tooltip: {
              valueDecimals: 2,
            },
          },
        ],
        chart: {
          events: {
            render: function () {// "load:" doesn't work properly with react so I used "render" instead
              if (buttonsLoaded) return;
              setButtonsLoaded(true);
              const attributes = {
                zIndex: 3,
                width: 70,
                "text-align": "center",
                "border-radius": "5px",
              };
              this.renderer
                .button("Line Chart", 10, 10)
                .attr(attributes)
                .add()
                .on("click", () => {
                  setChartType("line");
                });
              this.renderer
                .button("Candlestick", 105, 10)
                .attr(attributes)
                .add()
                .on("click", () => {
                  setChartType("candlestick");
                });
            },
          },
        },
        caption: {
          text: '*Due to free API limitations: <br/>- "Day" data is possibly a day old or more <br/>- All other ranges are pre gathered and static',
          style: {
            fontStyle: "italic",
          },
        },
        plotOptions: {
          candlestick: {},
        },
      };
    });
  }, [props, chartType,buttonsLoaded ]);

  function lineChartButton() {}

  function candlestickChartButton() {
    console.log("button pressed");
  }
  if (typeof BrandDark !== undefined){
    BrandDark(Highcharts)
}
//   if (props.theme) BrandDark(Highcharts);
//   else props.theme(Highcharts);
  // console.log("chartOptions", chartOptions);
  return (
    <>
      {props.options && (
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType={"stockChart"}
        />
      )}
    </>
  );
}