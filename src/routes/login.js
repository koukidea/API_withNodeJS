const express = require("express")
const router = express.Router()
const CryptoJS = require("crypto-js")
const { dynamoClient } = require("../dynamodb")

const TABLE_NAME = process.env.TABLE_NAME

// It's necessary for take input succesfully with express.
router.use(express.json())

router.post("/", (req, res) => {
    const { body: data } = req

    // Password hashing with crypto-js
    const hashedPassword = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.hex)

    const params = {
        TableName: TABLE_NAME,
        Key: {
            email: data.email,
        },

        // Get password of account linked to email, if email is exists.
        ConditionExpression: "attribute_exists(email)",
    }

    dynamoClient.get(params, (err, data) => {
        if (err) {
            res.status(404).send("E-mail can not found!")
        } else {
            if (data.Item.password == hashedPassword) {
                res.status(200).send("Login Successful!")
            } else {
                res.status(403).send("Wrong password!")
            }
        }
    })
})

module.exports = router
