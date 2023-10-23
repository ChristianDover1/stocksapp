import { authenticated } from "src/api/authenticated"

import { NextApiRequest, NextApiResponse } from "next"

export default authenticated(async function getStocks(req: NextApiRequest, res: NextApiResponse) {
  var id = req.url.split("/")[3]
  // var range = req.url.substring(req.url.lastIndexOf("range=") + 6)
  var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${id}&interval=5min&apikey=${process.env.ALPHAVANTAGE_API}`
  // switch (range){
  // case "week":
  //   url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${id}&apikey=${process.env.ALPHAVANTAGE_API}`
  //   break
  // case "month":
  //   url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&outputsize=compact&symbol=${id}&interval=5min&apikey=${process.env.ALPHAVANTAGE_API}`
  //   break
  // }
  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      res.send(data)
      res.status(201)
    })
})
