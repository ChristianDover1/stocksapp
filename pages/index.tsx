import { useEffect, useState } from "react"
import classes from "styles/Home.module.css"
// import cookie from "js-cookie"
import { parseRawToChart } from "src/utils/parse/rawToChart"
import Chart from "src/components/stocks/Chart"
import StockNews from "src/components/stocks/StockNews"
import authFetch from "src/utils/authFetch"

import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"

export default function Home() {
  const [chartOptions, setChartOptions] = useState<any>([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [trendingNews, setTrendingNews] = useState<any>([])

  useEffect(() => {
    fetch(`/api/news/trending`, {
      method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
      if (Object.keys(data).length === 0) {
        return
      }
      setTrendingNews(() => {
        return data.news.map((item) => {
          return { ...item }
        })
      })
    })

    fetch(`/api/stocks/trending/chart`, {
      method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
      if (Object.keys(data).length === 0) {
        return
      }
      setChartOptions(() => {
        var chartList = []
        chartList.push(
          data.trending.data.map((item) => {
            var chart = parseRawToChart(item)
            return {
              title: { text: chart.symbol },
              yAxis: [
                {
                  max: chart.high,
                  min: chart.low,
                },
              ],
              series: [
                {
                  name: "Test",
                  data: chart.data,
                  tooltip: {
                    valueDecimals: 2,
                  },
                },
              ],
            }
          })
        )
        setDataLoaded(true)
        return chartList[0]
      })
    })
  }, [])
  var chartCarouselList: any = []
  var stockNews: any = []
  if (dataLoaded) {
    var i = 0
    chartCarouselList = chartOptions.map((chartDetails) => {
      return <Chart key={i++} options={chartDetails} />
    })
    i = 0
    stockNews = trendingNews.map((item) => {
      return <StockNews key={i++} position={i} {...trendingNews[i]}></StockNews>
    })
  }

  return (
    <>
      {dataLoaded && (
        <>
          <div className={classes.carouselDiv}>
            <Carousel showThumbs={false} autoPlay={true} interval={3000} infiniteLoop={true}>
              {chartCarouselList}
            </Carousel>
          </div>
          {stockNews.length !== 0 || <h1 className={classes.loadingMessage}>Loading News...</h1>}
          {stockNews}
          <div className={classes.chart}>{/* <Chart options={chartOptions} size={{ width: 500}} /> */}</div>
        </>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}