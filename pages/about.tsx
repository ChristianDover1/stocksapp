import classes from "styles/about.module.css"
import StockNews from "src/components/stocks/StockNews"

export default function About() {
  return (
    <div className={classes.mainContainer}>
      <h1>Made by Christian Dover</h1>
      <p>
        This is a Demo website for entertainment purposes only. This website uses free api&#39;s for the equity markets.
        Data is often one day old or more.
      </p>
      <p>
        /stocks/id Would have loaded all the data in for all date selectors at once but could not due to free api
        limitations
      </p>
      <p>/stocks/id Because of free Api limitiations only daily graphs are supported</p>
      <h2>
        Api&apos;s Used:
        <br />
      </h2>
      <ul>
        <li>
          <a target="_blank" rel="noreferrer" href="https://cloud.mongodb.com">
            Atlas (with MongoDB)
          </a>
        </li>
        <br />
        <li>
          <a target="_blank" rel="noreferrer" href="https://cloudinary.com/">
            Cloudinary (image hosting)
          </a>
        </li>
        <br />
        <br />
      </ul>
      <h3>Equity Api&apos;s</h3>
      <ul>
        <li>
          <a target="_blank" rel="noreferrer" href="https://www.alphavantage.co/">
            Alpha Vantage
          </a>
        </li>
        <br />
        <li>
          <a target="_blank" rel="noreferrer" href="https://www.marketaux.com">
            Marketaux (news)
          </a>
        </li>
        <br />
        <li>
          <a target="_blank" rel="noreferrer" href="https://developer.yahoo.com/api/">
            Yahoo Finance
          </a>
        </li>
        <br />
      </ul>
      <h2>
        App&apos;s Used:
        <br />
      </h2>
    </div>
  )
}
