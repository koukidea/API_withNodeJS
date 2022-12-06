const express = require("express")
const router = express.Router()
const CryptoJS = require("crypto-js")
const { dynamoClient } = require("../dynamodb")

const TABLE_NAME = process.env.TABLE_NAME

// It's necessary for take input succesfully with express.
router.use(express.json())

// HTTP Method is Patch because we want to update a portion of the resource.
router.patch("/", (req, res) => {
    const { body: data } = req

    // Old and New passwords hashing with crypto-js.
    const hashedOldPassword = CryptoJS.SHA256(data.oldPassword).toString(CryptoJS.enc.hex)
    const hashedNewPassword = CryptoJS.SHA256(data.newPassword).toString(CryptoJS.enc.hex)

    const params = {
        TableName: TABLE_NAME,

        Key: {
            email: data.email,
        },

        // If password of account linked to email, is equal to input of oldPassword
        // set of the password of account linked to email, to input of newPassword
        UpdateExpression: "set password = :new",
        ConditionExpression: "password = :old, attribute_exists(email)",

        // Do some assignment for the expressions above
        ExpressionAttributeValues: {
            ":old": hashedOldPassword,
            ":new": hashedNewPassword,
        },
    }

    dynamoClient.update(params, (err) => {
        if (err) res.status(403).send("Wrong old password! or E-mail does not exists!")
        else res.status(200).send("Password changed succesfully!")
    })
})

module.exports = router
