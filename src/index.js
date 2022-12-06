require("dotenv").config()
const app = require("express")()

const registerRoute = require("./routes/register")
app.use("/register", registerRoute)

const loginRoute = require("./routes/login")
app.use("/login", loginRoute)

const changePasswordRoute = require("./routes/changepassword")
app.use("/changepassword", changePasswordRoute)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`API listening on ${port}`)
})
