const config = require("./config/config")

const express = require("express")
const cors = require("cors")
const session = require("express-session")
const redis = require("redis")
const RedisStore = require("connect-redis")(session)

const redisClient = redis.createClient({
  legacyMode: true,
  url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`,
})
redisClient.connect().catch(console.error)

const connectDB = require("./config/connectDB")

const morgan = require("morgan")
const app = express()

// Routers
const PostRouter = require("./routes/PostRouter")
const UserRouter = require("./routes/UserRouter")
const { REDIS_PORT } = require("./config/config")

// mongodb connection
connectDB()

// trust the nginx proxy headers
app.enable("trust proxy", 1)
app.use(cors())
app.use(express.json())
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: config.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 3,
    },
  })
)
app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error("oh no session lost!")) // handle error
  }
  next() // otherwise continue
})
const PORT = process.env.PORT || 5050
const ENVIRONMENT = process.env.NODE_ENV

app.get("/api/v1", (req, res, next) => {
  res.send(`<h1>API is Working!</h1>`)
  console.log("------- It Ran!! -------")
})
app.use("/api/v1/post", PostRouter)
app.use("/api/v1/user", UserRouter)

app.listen(PORT, () => {
  console.log(
    `App is listening on port: ${PORT} in ${ENVIRONMENT} environment at http://localhost:${PORT}`
  )
})
