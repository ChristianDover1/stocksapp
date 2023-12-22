import "styles/globals.css"
import Header from "src/components/layouts/Header"
import Footer from "src/components/layouts/Footer"
import { NextPageContext } from "next"
import cookie from "cookie"
import { useEffect, useState } from "react"
function MyApp({ Component, pageProps }) {
  const [cookieName, setCookieName] = useState("")
  useEffect(() => {
    try {
      setCookieName(JSON.parse(cookie.parse(document.cookie).data).name)
    } catch {
      setCookieName("")
    }
  }, [])
  return (
    <>
      <Header user={cookieName} />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default MyApp
