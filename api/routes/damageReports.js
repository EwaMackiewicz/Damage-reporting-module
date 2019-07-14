const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('ajax-request');

const DamageReport = require('../models/damageReport');

const clientDataAddress = 'http://51.145.158.146:4040';

router.get('/', (req, res, next) => {
    DamageReport.find()
    .select("clientId description _id")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            damageReports: docs.map(doc => {
                return {
                    clientId: doc.clientId,
                    description: doc.description,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/damageReports/' + doc._id
                    }
                };
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    request(clientDataAddress + '/client/' + req.body.clientId + '/insurances/HOME', (err1, res1, body1) => {
        let responseBody = JSON.parse(body1);

        if (responseBody.code === 200) {
            const damageReport = new DamageReport({
                _id: new mongoose.Types.ObjectId(),
                clientId: req.body.clientId,
                description: req.body.description
            });

            damageReport
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "Damage report created successfully",
                    createdDamageReport: {
                        clientId: result.clientId,
                        description: result.description,
                        _id: result.id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/damageReports/' + result._id
                        }
                    }
                });

                request({
                    url: clientDataAddress + '/client/' + req.body.clientId + '/damage/HOME',
                    method: 'POST',
                    data: {
                        clientId: damageReport.clientId,
                        description: damageReport.description
                    }
                  }, (err2, res2, body2) => {
                    console.log(JSON.parse(body2));
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }
    });
});

router.get('/:damageReportId', (req, res, next) => {
    const id = req.params.damageReportId; 
    DamageReport.findById(id)
    .select('clientId description _id')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                damageReport: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/damageReports'
                }
            });
        } else {
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:damageReportId', (req, res, next) => {
    const id = req.params.damageReportId;
    DamageReport.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Report deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/damageReports',
                body: { clientId: 'String', description: 'String'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;