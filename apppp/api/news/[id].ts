import { authenticated } from "src/api/authenticated"
import { v2 as cloudinary } from "cloudinary"

import { NextApiRequest, NextApiResponse } from "next"

export default authenticated(async function getStockDetails(req: NextApiRequest, res: NextApiResponse) {
  var id = req.url.split("/")[3]
  const detailsPromise = fetch(
    `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${id}&apikey=${process.env.ALPHAVANTAGE_API}`
  ).then((response) => response.json())
  var newsData = await fetch(
    `https://api.marketaux.com/v1/news/all?symbols=${id}&api_token=${process.env.MARKETAUX_TOKEN}&filter_entities=true&group_similar=true&language=en&min_match_score=50`
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
  const detailsData = await detailsPromise
  const updatedNewsData = await Promise.all(newsPromise)
  res.status(200).send({ news: updatedNewsData, details: detailsData })
})

// const RES_EXAMPLE = {
//   news: [
//     {
//       uuid: 'be02782e-b877-4456-a55e-5f79d0f44351',
//       title: 'When Should You Buy Alphabet Inc. (NASDAQ:GOOGL)?',
//       description: 'Alphabet Inc. ( NASDAQ:GOOGL ) received a lot of attention from a substantial price increase on the NASDAQGS over the...',
//       keywords: '',
//       snippet: 'Alphabet Inc. (NASDAQ:GOOGL) received a lot of attention from a substantial price increase on the NASDAQGS over the last few months. As a large-cap stock with h...',
//       url: 'https://finance.yahoo.com/news/buy-alphabet-inc-nasdaq-googl-130022227.html?.tsrc=rss',
//       image_url: 'http://res.cloudinary.com/dz1nbnuva/image/upload/v1687190540/be02782e-b877-4456-a55e-5f79d0f44351.jpg',
//       language: 'en',
//       published_at: '2023-06-18T13:00:22.000000Z',
//       source: 'finance.yahoo.com',
//       relevance_score: null,
//       entities: [Array],
//       similar: [],
//       image_width: 1194,
//       image_height: 432
//     },
//     {
//       uuid: '824c81a5-540c-49bf-895a-35183479a137',
//       title: 'Alphabet Inc. (GOOG) Outpaces Stock Market Gains: What You Should Know',
//       description: 'In the latest trading session, Alphabet Inc. (GOOG) closed at $124.35, marking a +1.2% move from the previous day.',
//       keywords: 'stock, stocks, investment, investment advice, investing, online trading, online investment, online stock trading,
// stock market, financial, financial planning, quote, quotes, stock quotes',
//       snippet: 'This page has not been authorized, sponsored, or otherwise approved or endorsed by the companies represented herein. Each of the company logos represented herei...',
//       url: 'https://www.zacks.com/stock/news/2107264/alphabet-inc-goog-outpaces-stock-market-gains-what-you-should-know?cid=CS-ZC-FT-tale_of_the_tape|yseop_template_6-2107264',
//       image_url: 'http://res.cloudinary.com/dz1nbnuva/image/upload/v1687071912/824c81a5-540c-49bf-895a-35183479a137.jpg',
//       language: 'en',
//       published_at: '2023-06-12T21:45:20.000000Z',
//       source: 'zacks.com',
//       relevance_score: null,
//       entities: [Array],
//       similar: [],
//       image_width: 900,
//       image_height: 600
//     },
//     {
//       uuid: 'f2514197-57f9-499c-bbb2-bd735436abac',
//       title: 'Lifshitz Law PLLC Announces Investigations of Rite Aid Corp (NYSE: RAD), Tupperware Brands Corp (NYSE: TUP), United Natural Foods, Inc. (NYSE: UNFI), and Alphabet Inc. (NASDAQ: GOOG)',
//       description: 'NEW YORK, June  09, 2023  (GLOBE NEWSWIRE) --     Rite Aid Corp (NYSE: RAD)    Lifshitz Law PLLC announces investigation into possible securities laws...',
//       keywords: 'Lifshitz Law Firm, P.C., Class Action',
//       snippet: 'NEW YORK, June 09, 2023 (GLOBE NEWSWIRE) --\n' +
//         '\n' +
//         'Rite Aid Corp (NYSE: RAD)\n' +
//         '\n' +
//         'Lifshitz Law PLLC announces investigation into possible securities laws violations and/o...',
//       url: 'https://www.globenewswire.com/news-release/2023/06/09/2685774/0/en/Lifshitz-Law-PLLC-Announces-Investigations-of-Rite-Aid-Corp-NYSE-RAD-Tupperware-Brands-Corp-NYSE-TUP-United-Natural-Foods-Inc-NYSE-UNFI-and-Alphabet-Inc-NASDAQ-GOOG.html',
//       image_url: 'http://res.cloudinary.com/dz1nbnuva/image/upload/v1687071912/f2514197-57f9-499c-bbb2-bd735436abac.ico',
//       language: 'en',
//       published_at: '2023-06-09T19:28:00.000000Z',
//       source: 'globenewswire.com',
//       relevance_score: null,
//       entities: [Array],
//       similar: [],
//       image_width: 16,
//       image_height: 16
//     }
//   ],
//   details: {
//     Symbol: 'GOOG',
//     AssetType: 'Common Stock',
//     Name: 'Alphabet Inc Class C',
//     Description: "Alphabet Inc. is an American multinational conglomerate headquartered in Mountain View, California. It was created through a restructuring of Google on October 2, 2015, and became the parent company of Google and several former Google subsidiaries. The two co-founders of Google remained as controlling shareholders, board members, and employees at Alphabet. Alphabet is the
// world's fourth-largest technology company by revenue and one of the world's most valuable companies.",
//     CIK: '1652044',
//     Exchange: 'NASDAQ',
//     Currency: 'USD',
//     Country: 'USA',
//     Sector: 'TECHNOLOGY',
//     Industry: 'SERVICES-COMPUTER PROGRAMMING, DATA PROCESSING, ETC.',
//     Address: '1600 AMPHITHEATRE PARKWAY, MOUNTAIN VIEW, CA, US',
//     FiscalYearEnd: 'December',
//     LatestQuarter: '2023-03-31',
//     MarketCapitalization: '1571443180000',
//     EBITDA: '87495999000',
//     PERatio: '27.63',
//     PEGRatio: '1.344',
//     BookValue: '20.51',
//     DividendPerShare: '0',
//     DividendYield: '0',
//     EPS: '4.49',
//     RevenuePerShareTTM: '21.96',
//     ProfitMargin: '0.206',
//     OperatingMarginTTM: '0.254',
//     ReturnOnAssetsTTM: '0.124',
//     ReturnOnEquityTTM: '0.228',
//     RevenueTTM: '284612002000',
//     GrossProfitTTM: '156633000000',
//     DilutedEPSTTM: '4.49',
//     QuarterlyEarningsGrowthYOY: '-0.047',
//     QuarterlyRevenueGrowthYOY: '0.026',
//     AnalystTargetPrice: '129.44',
//     TrailingPE: '27.63',
//     ForwardPE: '17.83',
//     PriceToSalesRatioTTM: '4.179',
//     PriceToBookRatio: '4.864',
//     EVToRevenue: '4.057',
//     EVToEBITDA: '12.16',
//     Beta: '1.092',
//     '52WeekHigh': '129.55',
//     '52WeekLow': '83.45',
//     '50DayMovingAverage': '115.39',
//     '200DayMovingAverage': '101.9',
//     SharesOutstanding: '5874000000',
//     DividendDate: 'None',
//     ExDividendDate: 'None'
//   }
// }
