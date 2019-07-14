const express = require('express');
const router = express.Router();
const request = require('ajax-request');

router.get('/', (req, res, next) => {
    request('http://localhost:4040/client/client-1234-io/insurances/HOME', (err, res1, body) => {
        let responseBody = JSON.parse(body);

        if (responseBody.code === 200) {
            res.status(200).json(responseBody);
        }
    });
});

module.exports = router;