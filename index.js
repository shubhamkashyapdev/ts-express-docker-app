const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const mongoCred = require("./config/config")
const app = express()
const PostRouter = require("./routes/PostRouter")
const UserRouter = require("./routes/UserRouter")
const mongoSRV = `mongodb://${mongoCred.MONGO_USERNAME}:${mongoCred.MONGO_PASSWORD}@${mongoCred.MONGO_IP_ADDRESS}:${mongoCred.MONGO_PORT}?authSource=admin`

mongoose
  .connect(mongoSRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB")
  })
  .catch((err) => {
    console.log(`MongoDB Connection Failed: ${err.message}`)
  })
// trust the nginx proxy headers
app.enable("trust proxy")
app.use(cors())

const PORT = process.env.PORT || 5050
const ENVIRONMENT = process.env.NODE_ENV
app.use(express.json())
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
