const express = require("express")
const router = express.Router()
const CryptoJS = require("crypto-js")
const { dynamoClient } = require("../dynamodb")

const TABLE_NAME = process.env.TABLE_NAME

// It's necessary for take input succesfully with express.
router.use(express.json())

router.post("/", (req, res) => {
    // const data = req.body
    const { body: data } = req

    // "hashedPassword" declaration here because it must be out of if scope's.
    let hashedPassword

    // Password lenght must be greater than 6.
    if (data.password.toString().length >= 6) {
        hashedPassword = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.hex)
    } else {
        res.status(403).send("Minimum length of password is 6 character!")
    }

    const params = {
        TableName: TABLE_NAME,
        Item: {
            email: data.email,
            username: data.username,
            password: hashedPassword,
        },

        // Put items if email is not exists
        ConditionExpression: "attribute_not_exists(email)",
    }

    dynamoClient.put(params, (err) => {
        if (err) {
            res.status(403).send("Another account is using the same email.")
        } else {
            res.status(200).send("Registration succesful!")
        }
    })
})

module.exports = router
