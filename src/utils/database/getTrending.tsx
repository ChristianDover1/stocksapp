var url = require('url');
// import {url} from 'url'
import {MongoClient, ServerApiVersion } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { responseSymbol } from 'next/dist/server/web/spec-compliant/fetch-event';

export default async function getTrendingStocks(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const otherCollection = db.collection('other');
    const trending = await otherCollection.findOne({key:"trending"})
    var a :any = new Date
    if (a - trending.updated > 1800000){ // update trending stocks if it has been more than 24 hours since last update 86,400,000 = 1 day
    // if (true){ // update trending stocks if it has been more than 24 hours since last update 86,400,000 = 1 day
        console.log("RUNNING UPDATE TRENDING")
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
                fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickers.join(',')}`,{method:"GET"})
                .then((response) => {return response.json()})
                .then((data) => {
                    if(data.quoteResponse.error) throw data.quoteResponse.error
                    var resData = data.quoteResponse.result.map((item) => {
                        return {symbol:item.symbol, name:item.shortName, price:item.regularMarketPrice, change:item.regularMarketChangePercent, dayRange:item.regularMarketDayRange}
                    })
                    console.log("test",resData)
                        // var resData = YAHOO_RES_EXAMPLE
                        const update1 = {
                            "$set": {
                                "updated": new Date
                            }
                        };
                        const update2 = {
                            "$set": {
                                "data": resData
                            }
                        };
                            otherCollection.updateOne({"key":"trending"},update1)
                            otherCollection.updateOne({"key":"trending"},update2)
                            res.status(201)
                            res.send({stocks:resData})
                            // client.close()
                            return {trending:resData.stocks}
                //   const data = req.body;
                })
            })
                        //         // res.send(data)
                        
                        //                 // res.status(201).send({data:tickers})
        //             // if(data.quoteResponse.error) throw data.quoteResponse.error
        //             // var resData = data.quoteResponse.result.map((item) => {
        //             //     return {symbol:item.symbol, name:item.shortName, price:item.regularMarketPrice, change:item.regularMarketChangePercent, dayRange:item.regularMarketDayRange}
        //             // })
        //             // // res.send(data)
        //     })
        
    }
    // console.log(a - trending.updated)
    
    // var q = url.parse(req.url,true).query
    // res.send({message:"no stocks to fetch"})

    // var user = await getUser(req.body.email)
    // if (typeof(user) == "undefined"){
    //     res.status(400).send({message:"USER DOESN'T EXIST"}) // FIX
    //     return
    // }
    res.status(201)
    res.send({trending:trending.data})
    console.log("inside updateTrendingStocks",trending.data)
    // return trending.data
}

const YAHOO_RES_EXAMPLE = {
    "stocks": [
        {
            "symbol": "BTC-USD",
            "name": "Bitcoin USD",
            "price": 21980.361,
            "change": 7.7356777,
            "dayRange": "21592.543 - 22230.895"
        },
        {
            "symbol": "UPST",
            "name": "Upstart Holdings, Inc.",
            "price": 33.74,
            "change": 1.9643443,
            "dayRange": "32.12 - 34.4"
        },
        {
            "symbol": "TWTR",
            "name": "Twitter, Inc.",
            "price": 38.79,
            "change": 1.5179322,
            "dayRange": "38.32 - 39.51"
        },
        {
            "symbol": "LEVI",
            "name": "Levi Strauss & Co",
            "price": 16.41,
            "change": 3.860757,
            "dayRange": "15.85 - 16.43"
        },
        {
            "symbol": "AMC",
            "name": "AMC Entertainment Holdings, Inc",
            "price": 14.48,
            "change": 15.194908,
            "dayRange": "12.41 - 14.685"
        },
        {
            "symbol": "NVAX",
            "name": "Novavax, Inc.",
            "price": 73.14,
            "change": 15.10859,
            "dayRange": "62.54 - 73.56"
        },
        {
            "symbol": "AFRM",
            "name": "Affirm Holdings, Inc.",
            "price": 23.61,
            "change": 17.055035,
            "dayRange": "20.26 - 23.66"
        },
        {
            "symbol": "MARA",
            "name": "Marathon Digital Holdings, Inc.",
            "price": 7.01,
            "change": 24.070797,
            "dayRange": "5.71 - 7.09"
        },
        {
            "symbol": "AI",
            "name": "C3.ai, Inc.",
            "price": 19.57,
            "change": -1.21151,
            "dayRange": "19.45 - 20.76"
        },
        {
            "symbol": "ETH-USD",
            "name": "Ethereum USD",
            "price": 1249.4451,
            "change": 6.627208,
            "dayRange": "1233.052 - 1261.776"
        },
        {
            "symbol": "ANY",
            "name": "Sphere 3D Corp.",
            "price": 0.74,
            "change": 29.461157,
            "dayRange": "0.57 - 0.7892"
        },
        {
            "symbol": "GROV",
            "name": "Grove Collaborative Holdings, I",
            "price": 7.37,
            "change": 84.25,
            "dayRange": "4.2 - 7.92"
        },
        {
            "symbol": "BTC-CAD",
            "name": "Bitcoin CAD",
            "price": 28546.137,
            "change": 7.141746,
            "dayRange": "28014.986 - 28816.152"
        },
        {
            "symbol": "SOFI",
            "name": "SoFi Technologies, Inc.",
            "price": 6.26,
            "change": 6.101697,
            "dayRange": "5.85 - 6.28"
        },
        {
            "symbol": "CHPT",
            "name": "ChargePoint Holdings, Inc.",
            "price": 13.75,
            "change": 10.441769,
            "dayRange": "12.51 - 14.085"
        },
        {
            "symbol": "USEA",
            "price": 7.08,
            "change": 147.55246,
            "dayRange": "6.1606 - 8.8899"
        },
        {
            "symbol": "MSTR",
            "name": "MicroStrategy Incorporated",
            "price": 219.51,
            "change": 16.574612,
            "dayRange": "189.8203 - 220.52"
        },
        {
            "symbol": "SOLO",
            "name": "Electrameccanica Vehicles Corp.",
            "price": 1.64,
            "change": 20.588232,
            "dayRange": "1.39 - 1.65"
        },
        {
            "symbol": "SRG",
            "name": "Seritage Growth Properties",
            "price": 6.08,
            "change": 9.549544,
            "dayRange": "5.63 - 6.11"
        },
        {
            "symbol": "AVLR",
            "name": "Avalara, Inc.",
            "price": 85.63,
            "change": 16.44,
            "dayRange": "73.805 - 87.13"
        }
    ]
}

const RES_EXAMPLE = {
    "data": {
        "finance": {
            "result": [
                {
                    "count": 20,
                    "quotes": [
                        {
                            "symbol": "BTC-USD"
                        },
                        {
                            "symbol": "UPST"
                        },
                        {
                            "symbol": "TWTR"
                        },
                        {
                            "symbol": "LEVI"
                        },
                        {
                            "symbol": "AMC"
                        },
                        {
                            "symbol": "NVAX"
                        },
                        {
                            "symbol": "AFRM"
                        },
                        {
                            "symbol": "MARA"
                        },
                        {
                            "symbol": "AI"
                        },
                        {
                            "symbol": "ETH-USD"
                        },
                        {
                            "symbol": "ANY"
                        },
                        {
                            "symbol": "GROV"
                        },
                        {
                            "symbol": "BTC-CAD"
                        },
                        {
                            "symbol": "SOFI"
                        },
                        {
                            "symbol": "CHPT"
                        },
                        {
                            "symbol": "USEA"
                        },
                        {
                            "symbol": "MSTR"
                        },
                        {
                            "symbol": "SOLO"
                        },
                        {
                            "symbol": "SRG"
                        },
                        {
                            "symbol": "AVLR"
                        }
                    ],
                    "jobTimestamp": 1657246111649,
                    "startInterval": 202207080100
                }
            ],
            "error": null
        }
    }
}