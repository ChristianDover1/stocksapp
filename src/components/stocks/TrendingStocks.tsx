import cookie from "js-cookie"

import { useState, useEffect } from "react"
import Stock from "./Stock"
import classes from "./TrendingStocks.module.css"
import authFetch from "src/utils/authFetch"

export default function TrendingStocks(props) {
  const [dataLoaded, setDataLoaded] = useState(false)
  const [trendingStocks, setTrendingStocks] = useState([])

  useEffect(() => {
    // Get Data
    const authCookie = cookie.get("auth")
    const data = authFetch(`/api/stocks/trending`, {
      method: "GET",
      headers: {
        auth: authCookie,
      },
    }).then((data) => {
      if (Object.keys(data).length === 0) {
        return
      }
      setTrendingStocks(data.trending)
      setDataLoaded(true)
    })
  }, [])

  function addTrendingHandler(position) {
    const symbols = trendingStocks.map((stockItem) => {
      return stockItem.symbol
    })
    if (trendingStocks[position].symbol in symbols) {
      return
    }
    setTrendingStocks((currentStocks) => {
      return [...currentStocks, { ...trendingStocks[position], favorited: true }]
    })
    setTrendingStocks((currentTrending) => {
      currentTrending[position] = { ...currentTrending[position], favorited: true }
      return currentTrending
    })
  }

  var trendingList = []
  if (dataLoaded && typeof trendingStocks != "undefined") {
    var i = 0
    trendingList = trendingStocks.map((item) => {
      return (
        <Stock
          key={++i}
          position={++i}
          handler={addTrendingHandler}
          trending={true}
          symbol={item.symbol}
          name={item.name}
          price={item.price}
          change={item.change}
          dayRange={item.dayRange.split(" - ")}
        ></Stock>
      )
    })
  }

  return (
    <>
      <div>
        <h1 className={classes.title}>FEATURED STOCKS</h1>
        <hr className={classes.hr1} />
        <hr className={classes.hr2} />
        <hr className={classes.hr3} />
        <i>*crypto not supported</i>
        <div className={classes.stocksContainer}>{dataLoaded && trendingList}</div>
      </div>
    </>
  )
}
