const express = require("express")
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

const PORT = process.env.PORT || 5050
const ENVIRONMENT = process.env.NODE_ENV
app.use(express.json())
app.get("/", (req, res, next) => {
  res.send(`<h1>API is Working!</h1>`)
})
app.use("/post", PostRouter)
app.use("/user", UserRouter)

app.listen(PORT, () => {
  console.log(
    `App is listening on port: ${PORT} in ${ENVIRONMENT} environment at http://localhost:${PORT}`
  )
})
