import Image from "next/image"
import classes from "./StockNews.module.css"

export default function StockNews(props) {
  return <>
    <div className={classes.newsContainer}>
      <a className={classes.anchor} href={props.url} target="_blank" rel="noreferrer">
        <div className={classes.container}>
          <Image
            priority={true}
            className={classes.newsImage}
            src={props.image_url}
            height={200}
            width={Math.floor((props.image_width / props.image_height) * 200)}
            alt="News Article"
          />
          <div className={classes.details}>
            <h2 className={classes.leftAlign}>{props.title}</h2>
            <p className={classes.leftAlign}>{props.description}</p>
            <p>
              <i>{props.source}</i>
            </p>
            <p>{new Date(props.published_at).toDateString()} UTC</p>
          </div>
        </div>
      </a>
    </div>
    <hr className={classes.hLine}></hr>
  </>;
}
