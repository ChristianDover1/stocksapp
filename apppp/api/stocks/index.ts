var url = require("url")
import { authenticated } from "src/api/authenticated"
import getUser from "src/api/getUser"
import getTrendingStocks from "src/api/get-trending-stocks"
import { MongoClient } from "mongodb"

import { NextApiRequest, NextApiResponse } from "next"

export default authenticated(async function getStocks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const trendingStocks = getTrendingStocks()

    var q = url.parse(req.url, true).query

    var user, stocks
    if (q.options === "new") {
      stocks = q.stocks //Only GET stock data on added stocks
    } else {
      user = await getUser(req.body.email)
      if (typeof user == "undefined") {
        console.log("user undefined")
        res.status(400).send({ message: "User Doesn't Exist." }) // FIX
        return
      }
      if (user.stocks.length > 10) {
        console.log("stocks.length > 10")
        res.status(400).send({ message: "Yahoo Finance free Api only supports 10 stocks at a time." })
        return
      }
      stocks = user.stocks.join(",")
    }
    // return
    if (stocks.length == 0) {
      trendingStocks.then((trendingStocks) => {
        res.status(201)
        res.send({ user: user, stocks: [], trending: trendingStocks })
      })
      return
    }
    fetch(`https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${stocks}`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.YAHOOFINANCE_API,
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.quoteResponse.error) throw data.quoteResponse.error
        var resData = data.quoteResponse.result.map((item) => {
          return {
            symbol: item.symbol,
            name: item.shortName,
            price: item.regularMarketPrice,
            change: item.regularMarketChangePercent,
            dayRange: item.regularMarketDayRange,
          }
        })
        trendingStocks
          .then((values) => {
            res.status(201)
            res.send({ user: user, stocks: resData, trending: values })
            return
          })
          .catch((error) => {
            console.error("Error fetching stock data:", error)
            res.status(500).send({ message: "Error fetching stock data." })
            return
          })
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error)
        res.status(500).send({ message: "Error fetching stock data." })
        return
      })
  } else if (req.method == "PUT") {
    var { email, stocks } = req.body
    var stocksJson
    stocksJson = stocks
    const update = {
      $set: {
        stocks: stocksJson,
      },
    }
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db()
    const usersCollection = db.collection("users")
    const resp = await usersCollection.updateOne({ email: email }, update)
    client.close()

    res.status(201)
    res.send({ message: "User Updated" })
  } else {
    res.send({ message: "we only support GET and PUT" })
  }
})

// const RES_EXAMPLE = {
//   "user": {
//       "_id": "62918a63a954317bd40f0085",
//       "name": "Christian",
//       "email": "new@gmail.com",
//       "password": "$2b$12$Jeue206XmZk8Vh3kjujY3OtlVyiHPnqKq3UOCFmwk4/5Y5jFJTKve",
//       "stocks": [
//           "F",
//           "BAC",
//           "WF",
//           "G",
//           "GOOG"
//       ]
//   },
//   "stocks": [
//       {
//           "symbol": "F",
//           "name": "Ford Motor Company",
//           "price": 11.2,
//           "change": -1.0600697,
//           "dayRange": "10.61 - 11.21"
//       },
//       {
//           "symbol": "BAC",
//           "name": "Bank of America Corporation",
//           "price": 31.24,
//           "change": -1.01394,
//           "dayRange": "30.45 - 31.24"
//       },
//       {
//           "symbol": "WF",
//           "name": "Woori Financial Group Inc.",
//           "price": 27.31,
//           "change": -2.2198384,
//           "dayRange": "26.66 - 27.41"
//       },
//       {
//           "symbol": "G",
//           "name": "Genpact Limited",
//           "price": 42.97,
//           "change": 0.116503,
//           "dayRange": "41.53 - 42.99"
//       },
//       {
//           "symbol": "GOOG",
//           "name": "Alphabet Inc.",
//           "price": 2277.74,
//           "change": 4.4058943,
//           "dayRange": "2125.0 - 2281.0515"
//       }
//   ],
//   "trending": [
//       {
//           "symbol": "BTC-USD",
//           "name": "Bitcoin USD",
//           "price": 21980.361,
//           "change": 7.7356777,
//           "dayRange": "21592.543 - 22230.895"
//       },
//       {
//           "symbol": "UPST",
//           "name": "Upstart Holdings, Inc.",
//           "price": 33.74,
//           "change": 1.9643443,
//           "dayRange": "32.12 - 34.4"
//       },
//       {
//           "symbol": "TWTR",
//           "name": "Twitter, Inc.",
//           "price": 38.79,
//           "change": 1.5179322,
//           "dayRange": "38.32 - 39.51"
//       },
//       {
//           "symbol": "LEVI",
//           "name": "Levi Strauss & Co",
//           "price": 16.41,
//           "change": 3.860757,
//           "dayRange": "15.85 - 16.43"
//       },
//       {
//           "symbol": "AMC",
//           "name": "AMC Entertainment Holdings, Inc",
//           "price": 14.48,
//           "change": 15.194908,
//           "dayRange": "12.41 - 14.685"
//       },
//       {
//           "symbol": "NVAX",
//           "name": "Novavax, Inc.",
//           "price": 73.14,
//           "change": 15.10859,
//           "dayRange": "62.54 - 73.56"
//       },
//       {
//           "symbol": "AFRM",
//           "name": "Affirm Holdings, Inc.",
//           "price": 23.61,
//           "change": 17.055035,
//           "dayRange": "20.26 - 23.66"
//       },
//       {
//           "symbol": "MARA",
//           "name": "Marathon Digital Holdings, Inc.",
//           "price": 7.01,
//           "change": 24.070797,
//           "dayRange": "5.71 - 7.09"
//       },
//       {
//           "symbol": "AI",
//           "name": "C3.ai, Inc.",
//           "price": 19.57,
//           "change": -1.21151,
//           "dayRange": "19.45 - 20.76"
//       },
//       {
//           "symbol": "ETH-USD",
//           "name": "Ethereum USD",
//           "price": 1249.4451,
//           "change": 6.627208,
//           "dayRange": "1233.052 - 1261.776"
//       },
//       {
//           "symbol": "ANY",
//           "name": "Sphere 3D Corp.",
//           "price": 0.74,
//           "change": 29.461157,
//           "dayRange": "0.57 - 0.7892"
//       },
//       {
//           "symbol": "GROV",
//           "name": "Grove Collaborative Holdings, I",
//           "price": 7.37,
//           "change": 84.25,
//           "dayRange": "4.2 - 7.92"
//       },
//       {
//           "symbol": "BTC-CAD",
//           "name": "Bitcoin CAD",
//           "price": 28546.137,
//           "change": 7.141746,
//           "dayRange": "28014.986 - 28816.152"
//       },
//       {
//           "symbol": "SOFI",
//           "name": "SoFi Technologies, Inc.",
//           "price": 6.26,
//           "change": 6.101697,
//           "dayRange": "5.85 - 6.28"
//       },
//       {
//           "symbol": "CHPT",
//           "name": "ChargePoint Holdings, Inc.",
//           "price": 13.75,
//           "change": 10.441769,
//           "dayRange": "12.51 - 14.085"
//       },
//       {
//           "symbol": "USEA",
//           "price": 7.08,
//           "change": 147.55246,
//           "dayRange": "6.1606 - 8.8899"
//       },
//       {
//           "symbol": "MSTR",
//           "name": "MicroStrategy Incorporated",
//           "price": 219.51,
//           "change": 16.574612,
//           "dayRange": "189.8203 - 220.52"
//       },
//       {
//           "symbol": "SOLO",
//           "name": "Electrameccanica Vehicles Corp.",
//           "price": 1.64,
//           "change": 20.588232,
//           "dayRange": "1.39 - 1.65"
//       },
//       {
//           "symbol": "SRG",
//           "name": "Seritage Growth Properties",
//           "price": 6.08,
//           "change": 9.549544,
//           "dayRange": "5.63 - 6.11"
//       },
//       {
//           "symbol": "AVLR",
//           "name": "Avalara, Inc.",
//           "price": 85.63,
//           "change": 16.44,
//           "dayRange": "73.805 - 87.13"
//       }
//   ]
// }
