import { useState } from "react"
import classes from "styles/login.module.css"
import { NextPageContext } from "next"
const Login = () => {
  const [logEmail, setLogEmail] = useState("")
  const [logPassword, setLogPassword] = useState("")

  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")

  const [errRegister, setErrRegister] = useState("")
  const [errLogin, setErrLogin] = useState("")

  const loginHandler = async (event) => {
    event.preventDefault()
    const resp = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: logEmail, password: logPassword }),
    })
    if (resp.status === 404) {
      setErrLogin("* User does not exist or password incorrect")
    }
    if (resp.status === 201) {
      window.location.href = "/"
    }
  }

  const registerHandler = async (event) => {
    event.preventDefault()
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
    })
    if (res.status === 409) {
      setErrRegister("* Error making User or User already exists")
    }
    if (res.status === 201) {
      window.location.href = "/"
    }
  }
  const guestHandler = async (event) => {
    event.preventDefault()
    const resp = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "guest@gmail.com", password: "password" }),
    })
    if (resp.status === 201) {
      window.location.href = "/"
    }
  }

  return (
    <>
      <div className={classes.mainContainer}>
        <form className={classes.form} onSubmit={loginHandler}>
          <h1 className={classes.h1}>Log in</h1>
          {!errLogin || (
            <h4 className={classes.errorMessage}>
              <i>{errLogin}</i>
            </h4>
          )}
          <span className={classes.label}>
            <b>Email</b>
          </span>
          <input
            className={classes.input}
            value={logEmail}
            type="email"
            onChange={(event) => setLogEmail(event.target.value)}
          />
          <br />
          <span className={classes.label}>
            <b>Password</b>
          </span>
          <input
            className={classes.input}
            value={logPassword}
            type="password"
            onChange={(event) => setLogPassword(event.target.value)}
          />
          <br />
          <button className={classes.button} type="submit">
            Log in
          </button>
        </form>
        <h2 className={classes.h2}>
          <span className={classes.h2Span}>OR</span>
        </h2>
        <form className={classes.guestForm} onSubmit={guestHandler}>
          <button className={`${classes.button} ${classes.guestButton}`} type="submit">
            Sign In as Guest
          </button>
        </form>
        <form className={classes.form} onSubmit={registerHandler}>
          <h1 className={classes.h1}>Register</h1>
          {!errRegister || (
            <h4 className={classes.errorMessage}>
              <i>{errRegister}</i>
            </h4>
          )}
          <span className={classes.label}>
            <b>Name</b>
          </span>
          <input
            className={classes.input}
            autoComplete="off"
            value={regName}
            onChange={(event) => setRegName(event.target.value)}
          />
          <br />
          <span className={classes.label}>
            <b>Email</b>
          </span>
          <input
            className={classes.input}
            autoComplete="off"
            value={regEmail}
            onChange={(event) => setRegEmail(event.target.value)}
          />
          <br />
          <span className={classes.label}>
            <b>Password</b>
          </span>
          <input
            className={classes.input}
            autoComplete="off"
            value={regPassword}
            type="password"
            onChange={(event) => setRegPassword(event.target.value)}
          />
          <br />
          <button className={classes.button} type="submit">
            Register
          </button>
        </form>
      </div>
    </>
  )
}

Login.getInitialProps = async (ctx: NextPageContext) => {
  const cookie = ctx.req?.headers.cookie // get cookie
  return { cookie: cookie }
}

export default Login
