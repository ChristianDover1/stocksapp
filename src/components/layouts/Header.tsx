import Link from "next/link"
import classes from "./Header.module.css"
import Image from "next/image"
import { Redirect } from "next"

function Header(props) {
  function handleLogOut() {
    fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    window.location.href = "/"
  }
  return (
    <div className={classes.header}>
      <Link href="/" passHref legacyBehavior>
        <Image
          priority={true}
          src="/header/logo.png"
          alt=""
          height={100}
          width={250}
          className={classes.logo}
        />
      </Link>
      <div className={classes.topnav}>
        <Link href="/" className={classes.navItem}>
          Home
        </Link>
        <Link href="/stocks" className={classes.navItem}>
          Stocks
        </Link>
        <Link href="/about" className={classes.navItem}>
          About
        </Link>
        {props.user && props.user.length > 0 && (
          <div className={`${classes.navItem} ${classes.dropDown}`}>
            <span className={classes.userName}>{props.user}</span>
            <span className={classes.loggedInIcon}>
              <Image
                priority={true}
                src="/images/signed-in.png"
                alt=""
                height={15}
                width={15}
              />
            </span>
            <div className={`${classes.dropDownMenu} ${classes.informationGrid}`}>
              <div>
                <div className={classes.dropDownHeading}>Stocks</div>
                <div className={classes.dropDownLinks}>
                  <Link href="/stocks">
                    My Stocks
                  </Link>
                  <br />
                </div>
              </div>
              <div>
                <div className={classes.dropDownHeading}>Account</div>
                <div className={classes.dropDownLinks}>
                  <Link href={"/user/".concat(props.user)}>
                    Account Settings
                  </Link>
                  <Link href="/" onClick={handleLogOut}>
                    Sign Out
                  </Link>
                  <br />
                </div>
              </div>
            </div>
          </div>
        )}

        {(props.user && props.user.length != 0) || (
          <Link href="/login" className={classes.navItem}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header
