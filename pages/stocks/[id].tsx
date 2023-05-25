import { useState, useEffect } from "react";
import { Router, useRouter } from "next/router";
import Chart from "../../src/components/stocks/Chart";
import Link from "next/link";
import HighchartsReact from "highcharts-react-official";
import classes from "../../styles/stock.module.css";
import myFetch from "../../src/utils/myFetch";
import StockNews from "../../src/components/stocks/StockNews";
import DarkBlue from "highcharts/themes/dark-blue";
import { parseRawToChart } from "../../src/utils/parse/rawToChart";

// https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo
// TRY RUNNING IN PRODUCTION
export default function LineChart(props) {
  const [chartData, setChartData] = useState({});
  const [chartDataRange, setChartDataRange] = useState("day");
  const [chartOptionsData, setChartOptionsData] = useState({
    type: "candlestick",
  });

  const [chartDetails, setChartDetails] = useState<any>({});
  const [chartNews, setChartNews] = useState([]);
  const [newsList, setNewsList] = useState([]);

  const [apiCallLimit, setApiCallLimit] = useState(false);
  const [urlId, setUrlId] = useState<any>("");
  var router = useRouter();

  function updateChartData(range) {
    setUrlId(router.query.id);
    myFetch(
      `http://localhost:3000/api/stocks/${router.query.id}?range=${range}`,
      { method: "GET" }
    )
      .then((data) => {
        if (Object.keys(data).length === 0) {
          return;
        }
        setChartData(() => {
          if (!data["Time Series (5min)"]) {
            console.log("TOO MANY API CALLS");
            setApiCallLimit(true);
            return {};
          }
          setApiCallLimit(false);
          var retData = parseRawToChart(data);
          return {
            ...chartData,
            [chartDataRange]: {
              dataPoints: retData.data,
              times: retData.times,
              low: retData.low,
              high: retData.high,
            },
          };
        });
      });
  }
  useEffect(() => {
    if (router.isReady) {
      updateChartData("day");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      setUrlId(router.query.id);
      console.log("inside use effect (Details)", router.query.id);
      fetch(`http://localhost:3000/api/news/${router.query.id}`, {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (typeof data.details.name === "undefined") {
            console.log("TOO MANY API CALLS", data);
          }
          console.log("GETTING DETAILS", data);
          setChartDetails(data.details);
          setChartNews(data.news);
        });
    }
  }, [router.isReady, router.query.id]);

  function handleSelectorClick(range) {
    if (typeof chartData[range] == "undefined") {
      console.log(range, "clicked");
      updateChartData(range);
      setChartDataRange(range);
    }
  }
  const [chartOptions, setChartOptions] = useState({});
  useEffect(() => {
    if (
      Object.keys(chartData).length === 0 ||
      typeof chartData[chartDataRange] == "undefined"
    ) {
      return;
    }
    setChartOptions(() => {
      return {//chartDetails what is
        title: { text: chartDetails.Name },
        subtitle: { text: chartData[chartDataRange].times[0].slice(0, 10) },
        yAxis: [
          {
            max: chartData[chartDataRange].high,
            min: chartData[chartDataRange].low,
          },
        ],
        series: [
          {
            name: urlId,
            data: chartData[chartDataRange].dataPoints,
            tooltip: {
              valueDecimals: 2,
            },
          },
        ],
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, chartDetails]);
  const updateSeries = () => {};
  useEffect(() => {
    if (chartNews.length !== 0) {
      var i = -1;
      setNewsList(
        chartNews.map((item) => {
          i++;
          return <StockNews key={i} position={i} {...chartNews[i]}></StockNews>;
        })
      );
    }
  }, [chartNews]);
  return (
    <div>
      {apiCallLimit && (
        <h1>
          Sorry the free Alpha Vantage API only supports 5 requests/min. Try
          again in a minute{" "}
        </h1>
      )}
      {Object.keys(chartData).length === 0 || (
        <>
          {apiCallLimit || <Chart options={chartOptions} theme={DarkBlue} />}
          <div className={classes.chartDetails}>
            <div className={classes.chartData}>
              <div className={classes.chartDataSplit}>
                <div className={classes.chartDataEntry}>Ticker: {urlId}</div>
                <div className={classes.chartDataEntry}>
                  Price: $
                  {
                    chartData["day"].dataPoints[
                      chartData["day"].dataPoints.length - 1
                    ][3]
                  }
                </div>
              </div>
              {/* <div className={classes.chartDataSplit}> */}
              <div className={classes.chartDataEntry}>
                Day Low / Day High <br /> {chartData["day"].low} /{" "}
                {chartData["day"].high}
              </div>
              {/* </div> */}
              <div className={classes.chartDataSplit}>
                <div className={classes.chartDataEntry}>
                  Market Cap <br /> $
                  {parseInt(chartDetails.MarketCapitalization).toLocaleString(
                    "en-US"
                  )}
                </div>
                <div className={classes.chartDataEntry}>
                  Div Yield <br /> {chartDetails.DividendYield}
                </div>
                {/* <div className={classes.chartDataEntry}>{chartDetails.DividendYield}</div> */}
                {/* <div className={classes.chartDataEntry}>{chartDetails.MarketCapitalization}</div> */}
              </div>
              <div className={classes.chartDataEntry}>
                52 Week Low / High <br /> {chartDetails["52WeekLow"]} /{" "}
                {chartDetails["52WeekHigh"]}
              </div>
              <div className={classes.chartDataSplit}>
                <div className={classes.chartDataEntry}>
                  PE: {chartDetails.PERatio}
                </div>
                <div className={classes.chartDataEntry}>
                  Exchange: {chartDetails.Exchange}
                </div>
              </div>

              <Link href={"/stocks/"} passHref>
                <button className={classes.backButton}>Back</button>
              </Link>
            </div>
            <div className={classes.chartDescription}>
              <div className={classes.chartDescriptionTitle}>
                <b>
                  {(apiCallLimit && (
                    <h1>
                      Sorry the free API only supports 5 requests/min. Try again
                      in a minute
                    </h1>
                  )) ||
                    chartDetails.Name}
                </b>
              </div>
              <p className={classes.chartDescriptionBody}>
                &emsp;&emsp;{chartDetails.Description}
              </p>
            </div>
          </div>
        </>
      )}
      {newsList}
    </div>
  );
}