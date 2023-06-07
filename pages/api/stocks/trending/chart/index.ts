var url = require('url');
// import {url} from 'url'
import {MongoClient, ServerApiVersion } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function getTrendingCharts(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    res.status(201)
    res.send({trending:RES_EXAMPLE})
    return
    console.log("getTrendingCharts", process.env.MONGODB_URI)
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const otherCollection = db.collection('other');
    const trending = await otherCollection.findOne({key:"trending-charts"})
    var a :any = new Date
    if (a - trending.updated > 1800000){ // update trending stocks if it has been more than 24 hours since last update 86,400,000 = 1 day
        console.log("RUNNING UPDATE CHARTS")
        fetch(`https://yfapi.net/v1/finance/trending/us`,{
                method:"GET",
                headers:{
                        'x-api-key': process.env.YAHOOFINANCE_API
                    }
                })
        .then((response) => {return response.json()})
            .then((data) => {
                    // console.log(data)
                const tickers = data.finance.result[0].quotes.map((item) => {
                    return item.symbol
                })
                fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${tickers.join(',')}&interval=5min&apikey=${process.env.ALPHAVANTAGE_API}`,
                {method:"GET"})
                .then((response) => {return response.json()})
                .then((data) => {
                    if(data.quoteResponse.error) throw data.quoteResponse.error
                    var resData = data.quoteResponse.result.map((item) => {
                        return {symbol:item.symbol, name:item.shortName, price:item.regularMarketPrice, change:item.regularMarketChangePercent, dayRange:item.regularMarketDayRange}
                    })
                    console.log("test",resData)
                        const update = {
                            "$set": {
                                "key":"trending-stocks",
                                "data" : {
                                    "updated": new Date,
                                    "data": resData
                                }
                            }
                        };
                        otherCollection.updateOne({"key":"trending-charts"},update)
                        res.status(201)
                        res.send({stocks:resData})
                        // client.close()
                        return {trending:resData.stocks}
                //   const data = req.body;
                })
            })
        
    }
    res.status(201)
    res.send({trending:trending.data})
    console.log("inside updateTrendingStocks",trending.data)
}
const RES_EXAMPLE = {
    "data": [{
        "Meta Data": {
            "1. Information": "Intraday (5min) open, high, low, close prices and volume",
            "2. Symbol": "IBM",
            "3. Last Refreshed": "2023-04-10 19:55:00",
            "4. Interval": "5min",
            "5. Output Size": "Compact",
            "6. Time Zone": "US/Eastern"
        },
        "Time Series (5min)": {
            "2023-04-10 19:55:00": {
                "1. open": "131.0400",
                "2. high": "131.0400",
                "3. low": "131.0400",
                "4. close": "131.0400",
                "5. volume": "287"
            },
            "2023-04-10 19:50:00": {
                "1. open": "131.0400",
                "2. high": "131.0400",
                "3. low": "131.0400",
                "4. close": "131.0400",
                "5. volume": "200"
            },
            "2023-04-10 17:45:00": {
                "1. open": "131.0300",
                "2. high": "131.0300",
                "3. low": "131.0300",
                "4. close": "131.0300",
                "5. volume": "1048"
            },
            "2023-04-10 16:45:00": {
                "1. open": "131.0400",
                "2. high": "131.0400",
                "3. low": "131.0400",
                "4. close": "131.0400",
                "5. volume": "100"
            },
            "2023-04-10 16:10:00": {
                "1. open": "131.0300",
                "2. high": "131.0300",
                "3. low": "131.0300",
                "4. close": "131.0300",
                "5. volume": "1920"
            },
            "2023-04-10 16:05:00": {
                "1. open": "131.0300",
                "2. high": "131.0300",
                "3. low": "131.0300",
                "4. close": "131.0300",
                "5. volume": "105384"
            },
            "2023-04-10 16:00:00": {
                "1. open": "130.8500",
                "2. high": "131.0800",
                "3. low": "130.8500",
                "4. close": "131.0700",
                "5. volume": "146784"
            },
            "2023-04-10 15:55:00": {
                "1. open": "130.9800",
                "2. high": "130.9950",
                "3. low": "130.7950",
                "4. close": "130.8400",
                "5. volume": "85151"
            },
            "2023-04-10 15:50:00": {
                "1. open": "130.9650",
                "2. high": "131.0060",
                "3. low": "130.9100",
                "4. close": "130.9500",
                "5. volume": "46721"
            },
            "2023-04-10 15:45:00": {
                "1. open": "130.9500",
                "2. high": "131.0300",
                "3. low": "130.9450",
                "4. close": "130.9700",
                "5. volume": "29564"
            },
            "2023-04-10 15:40:00": {
                "1. open": "130.8550",
                "2. high": "130.9800",
                "3. low": "130.8450",
                "4. close": "130.9600",
                "5. volume": "26925"
            },
            "2023-04-10 15:35:00": {
                "1. open": "130.9300",
                "2. high": "130.9550",
                "3. low": "130.8300",
                "4. close": "130.8550",
                "5. volume": "32291"
            },
            "2023-04-10 15:30:00": {
                "1. open": "130.9300",
                "2. high": "130.9900",
                "3. low": "130.8800",
                "4. close": "130.9300",
                "5. volume": "40242"
            },
            "2023-04-10 15:25:00": {
                "1. open": "130.9700",
                "2. high": "131.0201",
                "3. low": "130.9201",
                "4. close": "130.9201",
                "5. volume": "38554"
            },
            "2023-04-10 15:20:00": {
                "1. open": "130.8900",
                "2. high": "130.9800",
                "3. low": "130.8750",
                "4. close": "130.9600",
                "5. volume": "27039"
            },
            "2023-04-10 15:15:00": {
                "1. open": "130.8542",
                "2. high": "130.9100",
                "3. low": "130.8200",
                "4. close": "130.8900",
                "5. volume": "29652"
            },
            "2023-04-10 15:10:00": {
                "1. open": "130.8400",
                "2. high": "130.8800",
                "3. low": "130.8100",
                "4. close": "130.8650",
                "5. volume": "20241"
            },
            "2023-04-10 15:05:00": {
                "1. open": "130.8100",
                "2. high": "130.9000",
                "3. low": "130.8100",
                "4. close": "130.8300",
                "5. volume": "25145"
            },
            "2023-04-10 15:00:00": {
                "1. open": "130.7300",
                "2. high": "130.8040",
                "3. low": "130.7300",
                "4. close": "130.8000",
                "5. volume": "16938"
            },
            "2023-04-10 14:55:00": {
                "1. open": "130.6700",
                "2. high": "130.7650",
                "3. low": "130.6550",
                "4. close": "130.7200",
                "5. volume": "13549"
            },
            "2023-04-10 14:50:00": {
                "1. open": "130.6300",
                "2. high": "130.6800",
                "3. low": "130.6300",
                "4. close": "130.6700",
                "5. volume": "12426"
            },
            "2023-04-10 14:45:00": {
                "1. open": "130.6800",
                "2. high": "130.6800",
                "3. low": "130.6250",
                "4. close": "130.6250",
                "5. volume": "9121"
            },
            "2023-04-10 14:40:00": {
                "1. open": "130.6200",
                "2. high": "130.6800",
                "3. low": "130.6200",
                "4. close": "130.6800",
                "5. volume": "6741"
            },
            "2023-04-10 14:35:00": {
                "1. open": "130.6700",
                "2. high": "130.7100",
                "3. low": "130.6100",
                "4. close": "130.6200",
                "5. volume": "16732"
            },
            "2023-04-10 14:30:00": {
                "1. open": "130.6800",
                "2. high": "130.6900",
                "3. low": "130.6300",
                "4. close": "130.6601",
                "5. volume": "10296"
            },
            "2023-04-10 14:25:00": {
                "1. open": "130.7500",
                "2. high": "130.7500",
                "3. low": "130.6796",
                "4. close": "130.7000",
                "5. volume": "12171"
            },
            "2023-04-10 14:20:00": {
                "1. open": "130.7900",
                "2. high": "130.8200",
                "3. low": "130.7400",
                "4. close": "130.7400",
                "5. volume": "17387"
            },
            "2023-04-10 14:15:00": {
                "1. open": "130.7600",
                "2. high": "130.8200",
                "3. low": "130.7500",
                "4. close": "130.7800",
                "5. volume": "18529"
            },
            "2023-04-10 14:10:00": {
                "1. open": "130.7700",
                "2. high": "130.8300",
                "3. low": "130.7600",
                "4. close": "130.7635",
                "5. volume": "12424"
            },
            "2023-04-10 14:05:00": {
                "1. open": "130.9200",
                "2. high": "130.9200",
                "3. low": "130.7500",
                "4. close": "130.7600",
                "5. volume": "11868"
            },
            "2023-04-10 14:00:00": {
                "1. open": "130.9500",
                "2. high": "130.9700",
                "3. low": "130.8800",
                "4. close": "130.9100",
                "5. volume": "16760"
            },
            "2023-04-10 13:55:00": {
                "1. open": "130.9700",
                "2. high": "131.0200",
                "3. low": "130.9400",
                "4. close": "130.9700",
                "5. volume": "30533"
            },
            "2023-04-10 13:50:00": {
                "1. open": "130.8450",
                "2. high": "131.0200",
                "3. low": "130.8450",
                "4. close": "130.9684",
                "5. volume": "28033"
            },
            "2023-04-10 13:45:00": {
                "1. open": "130.7350",
                "2. high": "130.8425",
                "3. low": "130.7000",
                "4. close": "130.8425",
                "5. volume": "32635"
            },
            "2023-04-10 13:40:00": {
                "1. open": "130.8300",
                "2. high": "130.8400",
                "3. low": "130.7700",
                "4. close": "130.7700",
                "5. volume": "15306"
            },
            "2023-04-10 13:35:00": {
                "1. open": "130.6900",
                "2. high": "130.8100",
                "3. low": "130.6900",
                "4. close": "130.8000",
                "5. volume": "22888"
            },
            "2023-04-10 13:30:00": {
                "1. open": "130.7400",
                "2. high": "130.7800",
                "3. low": "130.6900",
                "4. close": "130.6900",
                "5. volume": "15215"
            },
            "2023-04-10 13:25:00": {
                "1. open": "130.7300",
                "2. high": "130.7950",
                "3. low": "130.7000",
                "4. close": "130.7300",
                "5. volume": "13085"
            },
            "2023-04-10 13:20:00": {
                "1. open": "130.6800",
                "2. high": "130.7700",
                "3. low": "130.6600",
                "4. close": "130.7300",
                "5. volume": "12998"
            },
            "2023-04-10 13:15:00": {
                "1. open": "130.6350",
                "2. high": "130.6900",
                "3. low": "130.6200",
                "4. close": "130.6700",
                "5. volume": "11543"
            },
            "2023-04-10 13:10:00": {
                "1. open": "130.5900",
                "2. high": "130.6800",
                "3. low": "130.5500",
                "4. close": "130.6500",
                "5. volume": "18513"
            },
            "2023-04-10 13:05:00": {
                "1. open": "130.6600",
                "2. high": "130.6900",
                "3. low": "130.5900",
                "4. close": "130.5900",
                "5. volume": "18414"
            },
            "2023-04-10 13:00:00": {
                "1. open": "130.5801",
                "2. high": "130.6900",
                "3. low": "130.5700",
                "4. close": "130.6700",
                "5. volume": "14690"
            },
            "2023-04-10 12:55:00": {
                "1. open": "130.5100",
                "2. high": "130.6000",
                "3. low": "130.5100",
                "4. close": "130.5800",
                "5. volume": "7400"
            },
            "2023-04-10 12:50:00": {
                "1. open": "130.6200",
                "2. high": "130.6300",
                "3. low": "130.5100",
                "4. close": "130.5100",
                "5. volume": "10904"
            },
            "2023-04-10 12:45:00": {
                "1. open": "130.5900",
                "2. high": "130.6400",
                "3. low": "130.5500",
                "4. close": "130.5800",
                "5. volume": "13033"
            },
            "2023-04-10 12:40:00": {
                "1. open": "130.4350",
                "2. high": "130.6100",
                "3. low": "130.4300",
                "4. close": "130.5900",
                "5. volume": "20954"
            },
            "2023-04-10 12:35:00": {
                "1. open": "130.3400",
                "2. high": "130.4600",
                "3. low": "130.3400",
                "4. close": "130.4200",
                "5. volume": "16869"
            },
            "2023-04-10 12:30:00": {
                "1. open": "130.3347",
                "2. high": "130.3400",
                "3. low": "130.3000",
                "4. close": "130.3000",
                "5. volume": "12700"
            },
            "2023-04-10 12:25:00": {
                "1. open": "130.2500",
                "2. high": "130.3699",
                "3. low": "130.2500",
                "4. close": "130.3450",
                "5. volume": "14943"
            },
            "2023-04-10 12:20:00": {
                "1. open": "130.2100",
                "2. high": "130.2800",
                "3. low": "130.2100",
                "4. close": "130.2300",
                "5. volume": "18183"
            },
            "2023-04-10 12:15:00": {
                "1. open": "130.1600",
                "2. high": "130.2088",
                "3. low": "130.1400",
                "4. close": "130.2088",
                "5. volume": "12975"
            },
            "2023-04-10 12:10:00": {
                "1. open": "130.1750",
                "2. high": "130.1750",
                "3. low": "130.0600",
                "4. close": "130.1500",
                "5. volume": "18918"
            },
            "2023-04-10 12:05:00": {
                "1. open": "130.1700",
                "2. high": "130.2500",
                "3. low": "130.1500",
                "4. close": "130.1800",
                "5. volume": "23303"
            },
            "2023-04-10 12:00:00": {
                "1. open": "130.2450",
                "2. high": "130.2500",
                "3. low": "130.1050",
                "4. close": "130.1771",
                "5. volume": "25356"
            },
            "2023-04-10 11:55:00": {
                "1. open": "130.3200",
                "2. high": "130.3500",
                "3. low": "130.2300",
                "4. close": "130.2585",
                "5. volume": "21949"
            },
            "2023-04-10 11:50:00": {
                "1. open": "130.2400",
                "2. high": "130.3300",
                "3. low": "130.2200",
                "4. close": "130.3200",
                "5. volume": "24584"
            },
            "2023-04-10 11:45:00": {
                "1. open": "130.1800",
                "2. high": "130.3300",
                "3. low": "130.1800",
                "4. close": "130.2400",
                "5. volume": "33352"
            },
            "2023-04-10 11:40:00": {
                "1. open": "130.1500",
                "2. high": "130.2000",
                "3. low": "130.1185",
                "4. close": "130.1900",
                "5. volume": "25026"
            },
            "2023-04-10 11:35:00": {
                "1. open": "130.0791",
                "2. high": "130.1700",
                "3. low": "130.0791",
                "4. close": "130.1450",
                "5. volume": "28547"
            },
            "2023-04-10 11:30:00": {
                "1. open": "129.9000",
                "2. high": "130.0200",
                "3. low": "129.8900",
                "4. close": "130.0200",
                "5. volume": "24917"
            },
            "2023-04-10 11:25:00": {
                "1. open": "129.9600",
                "2. high": "130.0100",
                "3. low": "129.8800",
                "4. close": "129.8831",
                "5. volume": "23882"
            },
            "2023-04-10 11:20:00": {
                "1. open": "130.0400",
                "2. high": "130.0600",
                "3. low": "129.9600",
                "4. close": "129.9600",
                "5. volume": "24529"
            },
            "2023-04-10 11:15:00": {
                "1. open": "129.9700",
                "2. high": "130.0800",
                "3. low": "129.9700",
                "4. close": "130.0400",
                "5. volume": "11520"
            },
            "2023-04-10 11:10:00": {
                "1. open": "129.9600",
                "2. high": "129.9970",
                "3. low": "129.9500",
                "4. close": "129.9700",
                "5. volume": "16005"
            },
            "2023-04-10 11:05:00": {
                "1. open": "129.9200",
                "2. high": "130.0500",
                "3. low": "129.9144",
                "4. close": "129.9600",
                "5. volume": "23260"
            },
            "2023-04-10 11:00:00": {
                "1. open": "130.0400",
                "2. high": "130.0460",
                "3. low": "129.9200",
                "4. close": "129.9200",
                "5. volume": "16656"
            },
            "2023-04-10 10:55:00": {
                "1. open": "130.0300",
                "2. high": "130.0400",
                "3. low": "129.9700",
                "4. close": "130.0300",
                "5. volume": "24462"
            },
            "2023-04-10 10:50:00": {
                "1. open": "130.1100",
                "2. high": "130.1100",
                "3. low": "129.9800",
                "4. close": "130.0500",
                "5. volume": "23291"
            },
            "2023-04-10 10:45:00": {
                "1. open": "130.0200",
                "2. high": "130.1200",
                "3. low": "129.9900",
                "4. close": "130.1200",
                "5. volume": "15501"
            },
            "2023-04-10 10:40:00": {
                "1. open": "130.0800",
                "2. high": "130.1050",
                "3. low": "129.9600",
                "4. close": "130.0050",
                "5. volume": "19972"
            },
            "2023-04-10 10:35:00": {
                "1. open": "129.9800",
                "2. high": "130.1200",
                "3. low": "129.9700",
                "4. close": "130.1000",
                "5. volume": "17997"
            },
            "2023-04-10 10:30:00": {
                "1. open": "129.8600",
                "2. high": "130.0100",
                "3. low": "129.8300",
                "4. close": "129.9601",
                "5. volume": "15030"
            },
            "2023-04-10 10:25:00": {
                "1. open": "129.9600",
                "2. high": "129.9800",
                "3. low": "129.8400",
                "4. close": "129.8450",
                "5. volume": "28823"
            },
            "2023-04-10 10:20:00": {
                "1. open": "130.1400",
                "2. high": "130.1800",
                "3. low": "129.9800",
                "4. close": "129.9800",
                "5. volume": "22440"
            },
            "2023-04-10 10:15:00": {
                "1. open": "130.3000",
                "2. high": "130.3500",
                "3. low": "130.1400",
                "4. close": "130.1500",
                "5. volume": "45443"
            },
            "2023-04-10 10:10:00": {
                "1. open": "130.1800",
                "2. high": "130.2825",
                "3. low": "130.1094",
                "4. close": "130.2800",
                "5. volume": "21782"
            },
            "2023-04-10 10:05:00": {
                "1. open": "129.7750",
                "2. high": "130.2000",
                "3. low": "129.7750",
                "4. close": "130.1800",
                "5. volume": "27547"
            },
            "2023-04-10 10:00:00": {
                "1. open": "129.8300",
                "2. high": "129.8400",
                "3. low": "129.6200",
                "4. close": "129.7800",
                "5. volume": "35101"
            },
            "2023-04-10 09:55:00": {
                "1. open": "129.8300",
                "2. high": "129.8442",
                "3. low": "129.7348",
                "4. close": "129.8100",
                "5. volume": "32532"
            },
            "2023-04-10 09:50:00": {
                "1. open": "129.9000",
                "2. high": "129.9700",
                "3. low": "129.8000",
                "4. close": "129.8200",
                "5. volume": "33774"
            },
            "2023-04-10 09:45:00": {
                "1. open": "130.0000",
                "2. high": "130.0200",
                "3. low": "129.8800",
                "4. close": "129.8800",
                "5. volume": "23187"
            },
            "2023-04-10 09:40:00": {
                "1. open": "129.6300",
                "2. high": "130.0000",
                "3. low": "129.6300",
                "4. close": "129.9300",
                "5. volume": "24164"
            },
            "2023-04-10 09:35:00": {
                "1. open": "129.8300",
                "2. high": "129.8300",
                "3. low": "129.2400",
                "4. close": "129.6000",
                "5. volume": "134887"
            },
            "2023-04-10 09:30:00": {
                "1. open": "130.0100",
                "2. high": "130.0100",
                "3. low": "130.0000",
                "4. close": "130.0000",
                "5. volume": "675"
            },
            "2023-04-10 08:55:00": {
                "1. open": "130.2600",
                "2. high": "130.2600",
                "3. low": "130.0400",
                "4. close": "130.0400",
                "5. volume": "1038"
            },
            "2023-04-10 08:10:00": {
                "1. open": "130.3300",
                "2. high": "130.3300",
                "3. low": "130.3300",
                "4. close": "130.3300",
                "5. volume": "204"
            },
            "2023-04-10 08:05:00": {
                "1. open": "130.8800",
                "2. high": "130.8800",
                "3. low": "130.4400",
                "4. close": "130.4400",
                "5. volume": "791"
            },
            "2023-04-10 07:30:00": {
                "1. open": "130.7900",
                "2. high": "130.7900",
                "3. low": "130.7900",
                "4. close": "130.7900",
                "5. volume": "210"
            },
            "2023-04-10 07:25:00": {
                "1. open": "130.7800",
                "2. high": "130.7800",
                "3. low": "130.7800",
                "4. close": "130.7800",
                "5. volume": "210"
            },
            "2023-04-06 20:00:00": {
                "1. open": "130.5000",
                "2. high": "130.5000",
                "3. low": "130.5000",
                "4. close": "130.5000",
                "5. volume": "100"
            },
            "2023-04-06 19:10:00": {
                "1. open": "130.4400",
                "2. high": "130.4400",
                "3. low": "130.4400",
                "4. close": "130.4400",
                "5. volume": "100"
            },
            "2023-04-06 17:25:00": {
                "1. open": "130.4800",
                "2. high": "130.4800",
                "3. low": "130.4800",
                "4. close": "130.4800",
                "5. volume": "500"
            },
            "2023-04-06 17:20:00": {
                "1. open": "130.5300",
                "2. high": "130.5300",
                "3. low": "130.4800",
                "4. close": "130.4800",
                "5. volume": "785"
            },
            "2023-04-06 17:10:00": {
                "1. open": "130.5100",
                "2. high": "130.5100",
                "3. low": "130.5100",
                "4. close": "130.5100",
                "5. volume": "501"
            },
            "2023-04-06 16:40:00": {
                "1. open": "130.7000",
                "2. high": "130.7000",
                "3. low": "130.7000",
                "4. close": "130.7000",
                "5. volume": "100"
            },
            "2023-04-06 16:15:00": {
                "1. open": "130.5000",
                "2. high": "130.5000",
                "3. low": "130.5000",
                "4. close": "130.5000",
                "5. volume": "2968"
            },
            "2023-04-06 16:10:00": {
                "1. open": "130.4100",
                "2. high": "130.5000",
                "3. low": "130.4100",
                "4. close": "130.5000",
                "5. volume": "8352"
            },
            "2023-04-06 16:05:00": {
                "1. open": "130.5000",
                "2. high": "130.5000",
                "3. low": "130.5000",
                "4. close": "130.5000",
                "5. volume": "76990"
            },
            "2023-04-06 16:00:00": {
                "1. open": "130.4100",
                "2. high": "130.5200",
                "3. low": "130.3150",
                "4. close": "130.5100",
                "5. volume": "195664"
            }
        }
    }]}