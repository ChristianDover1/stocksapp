var url = require("url")
import { MongoClient, ServerApiVersion } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import getUser from "./getUser"

const DAY = 86400000

export default async function getTrendingStocks() {
  const client = await MongoClient.connect(process.env.MONGODB_URI)
  const db = client.db()
  const otherCollection = db.collection("other")
  const trending = await otherCollection.findOne({ key: "trending-stocks" })
  var a: any = new Date()
  if (a - trending.data.updated > DAY) {
    console.log("trending stocks updated")
    return fetch(`https://yfapi.net/v1/finance/trending/us`, {
      method: "GET",
      headers: {
        "x-api-key": process.env.YAHOOFINANCE_API,
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const tickers = data.finance.result[0].quotes.map((item) => {
          return item.symbol
        })
        return fetch(`https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${tickers.join(",")}`, {
          method: "GET",
          headers: { "x-api-key": process.env.YAHOOFINANCE_API },
        })
          .then((response) => {
            // console.log("trending stocks response:!!!!!!!!!!!!",response.json())
            return response.json()
          })
          .then((data) => {
            if (data.quoteResponse.error) {
              console.log(data.quoteResponse.error)
              return []
            }
            // console.log("trending stocks resData", resData)
            var resData = data.quoteResponse.result.map((item) => {
              return {
                symbol: item.symbol,
                name: item.shortName,
                price: item.regularMarketPrice,
                change: item.regularMarketChangePercent,
                dayRange: item.regularMarketDayRange,
              }
            })
            const update = {
              $set: {
                key: "trending-stocks",
                data: {
                  updated: new Date(),
                  data: resData,
                },
              },
            }
            otherCollection.updateOne({ key: "trending-stocks" }, update)
            return resData
          })
      })
  } else {
    return trending.data.data
  }
}

// const RES_EXAMPLE = [
//     {
//       symbol: 'NFLX',
//       name: 'Netflix, Inc.',
//       price: 371.29,
//       change: 9.2157955,
//       dayRange: '346.375 - 375.87'
//     },
//     {
//       symbol: 'AMAT',
//       name: 'Applied Materials, Inc.',
//       price: 129.92,
//       change: 3.3572006,
//       dayRange: '125.76 - 132.06'
//     },
//     {
//       symbol: 'CELH',
//       name: 'Celsius Holdings, Inc.',
//       price: 133.38,
//       change: 0.18778637,
//       dayRange: '131.5 - 138.7999'
//     },
//     {
//       symbol: 'ENVB',
//       name: 'Enveric Biosciences, Inc.',
//       price: 3.59,
//       change: 136.96368,
//       dayRange: '2.02 - 4.4899'
//     },
//     {
//       symbol: 'PLTR',
//       name: 'Palantir Technologies Inc.',
//       price: 11.74,
//       change: 14.536583,
//       dayRange: '10.39 - 11.81'
//     },
//     {
//       symbol: 'BABA',
//       name: 'Alibaba Group Holding Limited',
//       price: 85.77,
//       change: -5.414649,
//       dayRange: '85.0 - 91.0'
//     },
//     {
//       symbol: 'AAPL',
//       name: 'Apple Inc.',
//       price: 175.05,
//       change: 1.366611,
//       dayRange: '172.58 - 175.24'
//     },
//     {
//       symbol: 'MGRM',
//       name: 'Monogram Orthopaedics Inc. Common Stock',
//       price: 11.75,
//       change: 62.068962,
//       dayRange: '10.15 - 13.86'
//     },
//     {
//       symbol: 'NVDA',
//       name: 'NVIDIA Corporation',
//       price: 316.78,
//       change: 4.9705086,
//       dayRange: '303.2 - 318.28'
//     },
//     {
//       symbol: 'DIS',
//       name: 'Walt Disney Company (The)',
//       price: 93.76,
//       change: 1.0671613,
//       dayRange: '92.46 - 94.24'
//     },
//     {
//       symbol: 'GRAB',
//       name: 'Grab Holdings Limited',
//       price: 2.745,
//       change: -14.751556,
//       dayRange: '2.67 - 3.13'
//     },
//     {
//       symbol: 'FTCH',
//       name: 'Farfetch Limited',
//       price: 4.34,
//       change: 6.372555,
//       dayRange: '4.125 - 4.41'
//     },
//     {
//       symbol: 'AAT',
//       name: 'American Assets Trust, Inc.',
//       price: 18.84,
//       change: 0.58729637,
//       dayRange: '18.44 - 18.89'
//     },
//     {
//       symbol: 'META',
//       name: 'Meta Platforms, Inc.',
//       price: 246.85,
//       change: 1.8001136,
//       dayRange: '241.19 - 247.085'
//     },
//     {
//       symbol: 'ROST',
//       name: 'Ross Stores, Inc.',
//       price: 105.38,
//       change: 1.5319359,
//       dayRange: '102.28 - 105.81'
//     },
//     {
//       symbol: 'LIFX',
//       name: 'LIFE360 INC. NPV CDI 3:1',
//       price: 4.75,
//       change: 29.78142,
//       dayRange: '4.39 - 4.785'
//     },
//     {
//       symbol: 'ARKO',
//       name: 'ARKO Corp.',
//       price: 7.43,
//       change: 3.0513146,
//       dayRange: '7.19 - 7.45'
//     },
//     {
//       symbol: 'AFRM',
//       name: 'Affirm Holdings, Inc.',
//       price: 14.69,
//       change: 11.626138,
//       dayRange: '13.22 - 14.74'
//     },
//     {
//       symbol: 'NQ=F',
//       name: 'Nasdaq 100 Jun 23',
//       price: 13940.25,
//       change: 0.3328775,
//       dayRange: '13899.0 - 13960.25'
//     },
//     {
//       symbol: 'MSFT',
//       name: 'Microsoft Corporation',
//       price: 318.52,
//       change: 1.4394869,
//       dayRange: '313.72 - 319.04'
//     }
//   ]
