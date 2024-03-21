import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import authFetch from "src/utils/authFetch"
import DarkBlue from "highcharts/themes/dark-blue"
import { parseRawToChart } from "src/utils/parse/rawToChart"

import StockNews from "src/components/stocks/StockNews"
import Chart from "src/components/stocks/Chart"

import classes from "styles/stock.module.css"

export default function LineChart(props) {
  const [chartData, setChartData] = useState({})
  const [chartDataRange, setChartDataRange] = useState("day")
  const [chartOptionsData, setChartOptionsData] = useState({
    type: "candlestick",
  })

  const [chartDetails, setChartDetails] = useState<any>({})
  const [chartNews, setChartNews] = useState([])
  const [newsList, setNewsList] = useState([])

  const [apiCallLimit, setApiCallLimit] = useState(false)
  const [urlId, setUrlId] = useState<any>("")
  var router = useRouter()

  function updateChartData(range) {
    setUrlId(router.query.id)
    authFetch(`/api/stocks/${router.query.id}/chart?range=${range}`, {
      method: "GET",
    }).then((data) => {
      if (!data || Object.keys(data).length === 0) {
        return
      }
      setChartData(() => {
        if (!data["Time Series (5min)"]) {
          setApiCallLimit(true)
          return {}
        }
        setApiCallLimit(false)
        var retData = parseRawToChart(data)
        return {
          ...chartData,
          [chartDataRange]: {
            dataPoints: retData.data,
            times: retData.times,
            low: retData.low,
            high: retData.high,
          },
        }
      })
    })
  }
  useEffect(() => {
    if (router.isReady) {
      updateChartData("day")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  useEffect(() => {
    if (router.isReady) {
      setUrlId(router.query.id)
      authFetch(`/api/news/${router.query.id}`, {
        method: "GET",
      })
        .then((data) => {
          if (!data){
              return
            }
          setChartDetails(data.details)
          setChartNews(data.news)
        })
    }
  }, [router.isReady, router.query.id])

  function handleSelectorClick(range) {
    if (typeof chartData[range] == "undefined") {
      updateChartData(range)
      setChartDataRange(range)
    }
  }
  const [chartOptions, setChartOptions] = useState({})
  useEffect(() => {
    if (Object.keys(chartData).length === 0 || typeof chartData[chartDataRange] == "undefined") {
      return
    }
    setChartOptions(() => {
      return {
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
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, chartDetails])
  const updateSeries = () => {}
  useEffect(() => {
    if (chartNews.length !== 0) {
      var i = -1
      setNewsList(
        chartNews.map((item) => {
          i++
          return <StockNews key={i} position={i} {...chartNews[i]}></StockNews>
        })
      )
    }
  }, [chartNews])
  return (
    <div>
      {apiCallLimit && <h1>The chart and/or data cannot be viewed due to the free Alpha Vantage API only supporting 25 requests per day</h1>}
      {Object.keys(chartData).length === 0 || (
        <>
          {apiCallLimit || <Chart options={chartOptions} theme={DarkBlue} />}
          <div className={classes.chartDetails}>
            <div className={classes.chartData}>
              <div className={classes.chartDataSplit}>
                <div className={classes.chartDataEntry}>Ticker: {urlId}</div>
                <div className={classes.chartDataEntry}>
                  Price: ${chartData["day"].dataPoints[chartData["day"].dataPoints.length - 1][3]}
                </div>
              </div>
              <div className={classes.chartDataEntry}>
                Day Low / Day High <br /> {chartData["day"].low} / {chartData["day"].high}
              </div>
              <div className={classes.chartDataSplit}>
                <div className={classes.chartDataEntry}>
                  Market Cap <br /> ${parseInt(chartDetails.MarketCapitalization).toLocaleString("en-US")}
                </div>
                <div className={classes.chartDataEntry}>
                  Div Yield <br /> {chartDetails.DividendYield}
                </div>
              </div>
              <div className={classes.chartDataEntry}>
                52 Week Low / High <br /> {chartDetails["52WeekLow"]} / {chartDetails["52WeekHigh"]}
              </div>
              <div className={classes.chartDataSplit}>
                <div className={classes.chartDataEntry}>PE: {chartDetails.PERatio}</div>
                <div className={classes.chartDataEntry}>Exchange: {chartDetails.Exchange}</div>
              </div>

              <Link href={"/stocks/"} passHref legacyBehavior>
                <button className={classes.backButton}>Back</button>
              </Link>
            </div>
            <div className={classes.chartDescription}>
              <div className={classes.chartDescriptionTitle}>
                <b>
                  {(apiCallLimit && <h1>Sorry the free API only supports 5 requests/min. Try again in a minute</h1>) ||
                    chartDetails.Name}
                </b>
              </div>
              <p className={classes.chartDescriptionBody}>&emsp;&emsp;{chartDetails.Description}</p>
            </div>
          </div>
        </>
      )}
      {newsList}
    </div>
  );
}