import { v2 as cloudinary } from "cloudinary"
import { MongoClient } from "mongodb"

import { NextApiRequest, NextApiResponse } from "next"

const SIX_HOURS = 21600000

export default async function getStockDetails(req: NextApiRequest, res: NextApiResponse) {
  const client = await MongoClient.connect(process.env.MONGODB_URI)

  const db = client.db()
  const otherCollection = db.collection("other")
  const trending = await otherCollection.findOne({ key: "trending-news" })
  var currentTime: any = new Date()

  // refresh trending news if older than 6 hours
  if (currentTime - trending.data.updated > SIX_HOURS) {
    var newsData = await fetch(
      `https://api.marketaux.com/v1/news/all?exchanges=NYSE%2CNASDAQ&language=en&api_token=${process.env.MARKETAUX_TOKEN}`
    ).then((response) => response.json())
    newsData = newsData.data
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    })

    const newsPromise = newsData.map((item) => {
      return cloudinary.uploader
        .upload(item.image_url, { public_id: item.uuid, tags: "express_sample" })
        .then(function (data) {
          return { ...item, image_url: data.url, image_width: data.width, image_height: data.height }
        })
    })
    newsData = await Promise.all(newsPromise)
    const update1 = {
      $set: {
        key: "trending-news",
        data: {
          updated: new Date(),
          data: newsData,
        },
      },
    }

    otherCollection.updateOne({ key: "trending-news" }, update1)
    res.status(200).send({ news: newsData })
    return
  } else {
    res.status(200).send({ news: trending.data.data })
  }
}

// const EXAMPLE_RES = {
//   news: [
//     {
//       uuid: "65fb090d-5819-46fd-80b4-f1448ea401b6",
//       title: "5 big analyst picks & cuts: ASML, Applied Materials slashed By Investing.com",
//       description: "5 big analyst picks & cuts: ASML, Applied Materials slashed",
//       keywords: "",
//       snippet:
//         "Published Jun 19, 2023 07:43AM ET\n" +
//         "\n" +
//         "© Reuters.\n" +
//         "\n" +
//         "AMAT -0.84% Add to/Remove from Watchlist WST +0.62% Add to/Remove from Watchlist ASML -2.28% Add to/Remove from ...",
//       url: "https://www.investing.com/news/stock-market-news/5-big-analyst-picks--cuts-asml-and-applied-materials-slashed-to-neutral-3108156",
//       image_url:
//         "http://res.cloudinary.com/dz1nbnuva/image/upload/v1687200855/65fb090d-5819-46fd-80b4-f1448ea401b6.jpg",
//       language: "en",
//       published_at: "2023-06-19T11:43:06.000000Z",
//       source: "investing.com",
//       relevance_score: null,
//       entities: [Array],
//       similar: [],
//       image_width: 800,
//       image_height: 533,
//     },
//     {
//       uuid: "158f39b0-582d-4a72-9511-37fea9e9ba3a",
//       title: "4 big analyst cuts: Applied Materials downgraded as Semicaps overbought on AI hype By Investing.com",
//       description: "4 big analyst cuts: Applied Materials downgraded as Semicaps overbought on AI hype",
//       keywords: "",
//       snippet:
//         "Published Jun 15, 2023 06:59AM ET\n" +
//         "\n" +
//         "© Reuters\n" +
//         "\n" +
//         "AMAT -0.44% Add to/Remove from Watchlist ZION -5.74% Add to/Remove from Watchlist RWT -0.76% Add to/Remove from W...",
//       url: "https://www.investing.com/news/stock-market-news/4-big-analyst-cuts-applied-materials-downgraded-as-semicaps-overbought-on-ai-hype-3106136",
//       image_url:
//         "http://res.cloudinary.com/dz1nbnuva/image/upload/v1687200855/158f39b0-582d-4a72-9511-37fea9e9ba3a.jpg",
//       language: "en",
//       published_at: "2023-06-15T10:59:48.000000Z",
//       source: "investing.com",
//       relevance_score: null,
//       entities: [Array],
//       similar: [],
//       image_width: 800,
//       image_height: 526,
//     },
//     {
//       uuid: "f8f22498-a47e-46ae-aa1b-4f42f931cf32",
//       title: "Applied Materials Inc. stock underperforms Wednesday when compared to competitors",
//       description:
//         "Shares of Applied Materials Inc. dropped 0.44% to $141.17 Wednesday, on what proved to be an all-around mixed trading session for the stock market, with the...",
//       keywords:
//         "article_normal, Semiconductors, Industrial Electronics, Industrial Goods, Technology, Financial Performance, Share Price Movement/Disruptions, Corporate/Industrial News, Content Types, Factiva Filters, C&E Exclusion Filter, C&E Industry News Filter, Applied Materials Inc., US:AMAT, financial performance",
//       snippet:
//         "Shares of Applied Materials Inc. AMAT dropped 0.44% to $141.17 Wednesday, on what proved to be an all-around mixed trading session for the stock market, with th...",
//       url: "https://www.marketwatch.com/data-news/applied-materials-inc-stock-underperforms-wednesday-when-compared-to-competitors-4d13df5e-a15b985cf894",
//       image_url:
//         "http://res.cloudinary.com/dz1nbnuva/image/upload/v1687200855/f8f22498-a47e-46ae-aa1b-4f42f931cf32.jpg",
//       language: "en",
//       published_at: "2023-06-14T21:39:00.000000Z",
//       source: "marketwatch.com",
//       relevance_score: null,
//       entities: [Array],
//       similar: [],
//       image_width: 1280,
//       image_height: 640,
//     },
//   ],
// }
