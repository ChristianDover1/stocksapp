import cookie from "js-cookie"

export default async function authFetch(url, options) {
  // if(cookie.get("data") === undefined){
  //   window.location.href = "/login"
  // }
  const response = await fetch(url, options)
  const data = await response.json()
  return data
}
