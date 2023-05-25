//https://api.marketaux.com/v1/entity/trending/aggregation

import { MONGOUSERNAME,MONGOPASSWORD, ALPHAVANTAGEAPI,MARKETAUXTOKEN, CLOUDINARYCONFIG } from '../../../../src/api/secret';
import { v2 as cloudinary } from 'cloudinary'
import { MongoClient } from 'mongodb';

const SIX_HOURS = 21600000

export default async function getStockDetails(req,res) {
  const client = await MongoClient.connect(`mongodb+srv://${MONGOUSERNAME}:${MONGOPASSWORD}@cluster0.yksmj.mongodb.net/StocksApp?retryWrites=true&w=majority`);
    const db = client.db();
    const otherCollection = db.collection('other');
    const trending = await otherCollection.findOne({key:"trending-news"})
    var currentTime :any = new Date
    console.log("trending",trending.data.updated, currentTime - trending.data.updated)
    if (currentTime - trending.data.updated > SIX_HOURS){

    console.log("UPDATING NEWS")
    var newsData = await fetch(`https://api.marketaux.com/v1/news/all?exchanges=NYSE%2CNASDAQ&api_token=${MARKETAUXTOKEN}`,).then(response => response.json())
    newsData = newsData.data
    console.log("newsData len",newsData.length)
    cloudinary.config(CLOUDINARYCONFIG)
    for (var i = 0; i < newsData.length; i++){
        await cloudinary.uploader.upload(newsData[i].image_url, {public_id: newsData[i].uuid,tags: 'express_sample'})
          .then(function (data) {
            newsData[i] = {...newsData[i],image_url:data.url,image_width:data.width,image_height:data.height}
          })
    }
    const update1 = {
      "$set": {
          "key":"trending-news",
          "data" : {
              "updated": new Date,
              "data": newsData
          }
      }
    };
          otherCollection.updateOne({"key":"trending-news"},update1)
    console.log("about to send")
    res.status(200).send({news:newsData})
    return
  }
  else{
    console.log("NOT UPDATING NEWS")
    res.status(200).send({news:trending.data.data})
  }
}