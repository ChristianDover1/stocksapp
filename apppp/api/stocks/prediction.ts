var url = require("url")
import { authenticated } from "src/api/authenticated"

import { NextApiRequest, NextApiResponse } from "next"

export default authenticated(async function getStocks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    var prediction = url.parse(req.url, true).query.prediction
    await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${prediction}&apikey=${process.env.ALPHAVANTAGE_API}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        res.send({ predictions: data["bestMatches"] })
        res.status(201)
      })
  }
})

const RES_EXAMPLE = {
  predictions: [
    {
      "1. symbol": "FORD",
      "2. name": "Forward Industries Inc",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "1.0000",
    },
    {
      "1. symbol": "FOVSY",
      "2. name": "Ford Otomotiv",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "0.4706",
    },
    {
      "1. symbol": "F-P-D",
      "2. name": "Ford Motor Company 6.500 Notes due August 15",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "0.4444",
    },
    {
      "1. symbol": "F",
      "2. name": "Ford Motor Company",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "0.4000",
    },
    {
      "1. symbol": "0P4F.LON",
      "2. name": "Ford Motor Company",
      "3. type": "Equity",
      "4. region": "United Kingdom",
      "5. marketOpen": "08:00",
      "6. marketClose": "16:30",
      "7. timezone": "UTC+01",
      "8. currency": "USD",
      "9. matchScore": "0.3636",
    },
    {
      "1. symbol": "FDMO34.SAO",
      "2. name": "Ford Motor Company",
      "3. type": "Equity",
      "4. region": "Brazil/Sao Paolo",
      "5. marketOpen": "10:00",
      "6. marketClose": "17:30",
      "7. timezone": "UTC-03",
      "8. currency": "BRL",
      "9. matchScore": "0.3636",
    },
    {
      "1. symbol": "FMC1.DEX",
      "2. name": "Ford Motor Company",
      "3. type": "Equity",
      "4. region": "XETRA",
      "5. marketOpen": "08:00",
      "6. marketClose": "20:00",
      "7. timezone": "UTC+02",
      "8. currency": "EUR",
      "9. matchScore": "0.3636",
    },
    {
      "1. symbol": "FMC1.FRK",
      "2. name": "Ford Motor Company",
      "3. type": "Equity",
      "4. region": "Frankfurt",
      "5. marketOpen": "08:00",
      "6. marketClose": "20:00",
      "7. timezone": "UTC+02",
      "8. currency": "EUR",
      "9. matchScore": "0.3636",
    },
    {
      "1. symbol": "F-P-C",
      "2. name": "Ford Motor Company 6% Note",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "0.2667",
    },
    {
      "1. symbol": "F-P-B",
      "2. name": "Ford Motor Company 620 Notes due June 1 2059",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "0.2222",
    },
  ],
}
