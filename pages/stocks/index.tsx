import Stock from "src/components/stocks/Stock"
import classes from "styles/stocks.module.css"
import cookie from "js-cookie"
import authFetch from "src/utils/authFetch"
import StockPredictions from "src/components/stocks/StockPredictions"
import { useState, Component, useEffect } from "react"

import { parseYFSymbol } from "src/utils/parse/YFSymbol"
import { StockT, PredictionT } from "src/ts/interfaces/stocks"

export default function Stocks() {
  const [dataLoaded, setDataLoaded] = useState(false)
  const [stocks, setStocks] = useState<StockT[]>([])
  const [trendingStocks, setTrendingStocks] = useState<StockT[]>([])
  const [user, setUser] = useState({ email: "" })
  const [stockPredictions, setStockPredictions] = useState<PredictionT[]>([])

  useEffect(() => {
    const authCookie = cookie.get("auth")
    var stocksPromise = authFetch(`/api/stocks`, {
      method: "GET",
      headers: {
        auth: authCookie,
      },
    })
    stocksPromise.then((data) => {
      if (!data){
        return
      }
      // if (typeof data.stocks === "undefined") {
      //   data.stocks = []
      // }
      setUser(data.user)
      if (data.stocks != undefined) {
        setStocks(() => {
          return data.stocks.map((item) => {
            return { ... item, favorited: true }
          })
        })
        const tickers = data.stocks.map((stockItem) => {
          return stockItem.symbol
        })
        setTrendingStocks((item) => {
          return data.trending.map((item) => {
            return item.symbol in tickers ? { ...item, favorited: true } : item
          })
        })
        setDataLoaded(true)
      }
    })
  }, [])

  function deleteHandler(pos: number) {
    var tempStocks = []
    tempStocks = stocks.slice()
    var deletedStock = tempStocks.splice(pos, 1)[0]
    const trendingSymbols = trendingStocks.map((stockItem) => {
      return stockItem.symbol
    })
    const trendingPos = trendingSymbols.indexOf(deletedStock.symbol)

    if (trendingPos != -1) {
      setTrendingStocks((currentTrending) => {
        currentTrending[trendingPos] = { ...currentTrending[trendingPos], favorited: false }
        return currentTrending
      })
    }
    setStocks(tempStocks)
    var stocksList = []
    for (i = 0; i < tempStocks.length; i++) {
      stocksList.push(tempStocks[i].symbol)
    }
    updateStocksDB(stocksList)
  }
  function searchHandler() {
    var input = (document.getElementById("symbolInput") as HTMLButtonElement).value.split(" ")
    fetch(`/api/stocks/prediction?prediction=${input}`, {
      method: "GET",
      headers: {
        auth: cookie.get("auth"),
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setStockPredictions(
          data.predictions.map((item) => {
            return { ...item }
          })
        )
      })
  }

  function addHandler(symbol: string) {
    let updatedSymbols = stocks.map((stockItem) => {
      return stockItem.symbol
    })
    updatedSymbols.push(symbol)
    const type = parseYFSymbol(symbol).type
    if (type != "Stock") {
      alert('"Any symbol with a ". = ^ -" is not supported')
      return
    }
    setStockPredictions([])
    fetch(`/api/stocks?options=new&stocks=${symbol}`, {
      method: "GET",
      headers: { auth: cookie.get("auth") },
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (!data.message) {
          var tempStocks = stocks.slice()
          tempStocks = tempStocks.concat({ ...data.stocks[0], favorited: true })
          setStocks(tempStocks)
        }
      })
    updateStocksDB([...updatedSymbols])
  }
  function updateStocksDB(newStocks: string[]) {
    fetch(`/api/stocks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email, stocks: newStocks }),
    })
  }

  function addTrendingHandler(position) {
    const symbols = stocks.map((stockItem) => {
      return stockItem.symbol
    })
    if (trendingStocks[position].symbol in symbols) {
      return
    }
    setStocks((currentStocks) => {
      const updatedStocks = [...currentStocks, { ...trendingStocks[position], favorited: true }]
      const symbols = updatedStocks.map((stockItem) => {
        return stockItem.symbol
      })
      updateStocksDB(symbols)
      return updatedStocks
    })
    setTrendingStocks((currentTrending) => {
      currentTrending[position] = { ...currentTrending[position], favorited: true }
      return currentTrending
    })
  }
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      searchHandler()
    }
  }
  var i = 0
  var stocksList
  i = 0
  if (dataLoaded && typeof stocks != "undefined") {
    stocksList = stocks.map((item) => {
      return (
        <Stock
          key={i}
          position={i++}
          handler={deleteHandler}
          favorited={item.favorited}
          symbol={item.symbol}
          name={item.name}
          price={item.price}
          change={item.change}
          dayRange={item.dayRange.split(" - ")}
        ></Stock>
      )
    })
  }
  var trendingList
  var j = 0
  if (dataLoaded && typeof trendingStocks != "undefined") {
    trendingList = trendingStocks.map((item) => {
      return (
        <Stock
          key={++i}
          position={j++}
          handler={addTrendingHandler}
          trending={true}
          favorited={item.favorited}
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
      <div className={classes.inputDiv}>
        <i>Enter Tickers to search for equities</i>
        <br />
        <br />
        <input onKeyDown={handleKeyPress} className={classes.stocksInput} id="symbolInput" placeholder="" />
        <button className={classes.addButton} onClick={searchHandler}>
          Search
        </button>
        {stockPredictions.length > 0 && (
          <StockPredictions
            predictions={stockPredictions}
            addHandler={(symbol: string) => addHandler(symbol)}
            closeHandler={() => {
              setStockPredictions([])
            }}
          />
        )}
      </div>
      <h1 className={classes.title}>FAVORITED STOCKS</h1>
      <hr className={classes.hr1} />
      <hr className={classes.hr2} />
      <hr className={classes.hr3} />
      <div className={classes.stocksContainer}>{dataLoaded && stocksList}</div>
      <h1 className={classes.title}>FEATURED STOCKS</h1>
      <hr className={classes.hr1} />
      <hr className={classes.hr2} />
      <hr className={classes.hr3} />
      <i className={classes.cryptoDisclaimer}>
        *due to free api limits - Crypto, mutual funds, currencies, futures and foreign exchanges are not supported.
      </i>
      <div className={classes.stocksContainer}>{dataLoaded && trendingList}</div>
    </>
  )
}