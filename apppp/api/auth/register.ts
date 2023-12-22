import { MongoClient, ServerApiVersion } from "mongodb"
import { hash } from "bcrypt"
import getUser from "src/api/getUser"
import { setLoginJWTHeader } from "./login"

import { NextApiRequest, NextApiResponse } from "next"

async function registerCall(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body
    const { name, email, password } = data
    const user = await getUser(email)
    if (user === undefined) {
      const client = await MongoClient.connect(process.env.MONGODB_URI)
      const usersCollection = client.db("StocksApp").collection("users")

      hash(password, 12, async function (err, hash) {
        const user = { name: name, email: email, admin: false, password: hash, stocks: ["GOOG", "AAPL", "IBM"] }
        const result = await usersCollection.insertOne(user)
        setLoginJWTHeader(res, { _id: result.insertedId, ...user })
        client.close()
        res.status(201).send({ message: "User Inserted" })
      })
    } else {
      res.status(409).send({ message: "User already exists" })
    }
  } else {
    res.status(405).send({ message: "We only support POST" })
  }
}
export default registerCall
