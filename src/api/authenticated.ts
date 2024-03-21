import { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import { verify } from "jsonwebtoken"

export const authenticated = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.cookies.auth) {
    res.status(401).json({ message: "sorry you are not authenticated" })
    res.end()
    return
  }
  await verify(req.cookies.auth!, process.env.SECRET, async function (err, decoded) {
    if (err) throw err
    if (decoded) {
      if (Object.keys(req.body).length === 0) {
        req.body = { email: decoded.email }
      } else {
        req.body["email"] = decoded.email
      }
      return await fn(req, res)
    }
    res.status(401).json({ message: "You are not authenticated" })
  })
}
