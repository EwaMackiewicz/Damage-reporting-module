const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DamageReport = require('../models/damageReport');
const Decision = require('../models/decision');

const clientDataAddress = 'http://51.145.158.146:4040';

router.get('/', (req, res, next) => {
    decision.find()
    .select('damageReport isAccepted _id')
    .populate('damageReport', '_id')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            decisions: docs.map(doc => {
                return {
                    _id: doc._id,
                    damageReport: doc.damageReport,
                    isAccepted: doc.isAccepted,
                    substantiation: doc.substantiation,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/decisions/' + doc._id
                    }
                };
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    DamageReport.findById(req.body.damageReportId)
    .then(damageReport => {
        if (!damageReport) {
            return res.status(404).json({
                message: 'damageReport not found'
            });
        }
        const decision = new Decision({
            _id: mongoose.Types.ObjectId(),
            isAccepted: req.body.isAccepted,
            damageReport: req.body.damageReportId,
            substantiation: req.body.substantiation
        });
        return decision.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({ // 201 - resource created
            message: 'decision stored',
            createdObject: {
                _id: result._id,
                damageReport: result.damageReport,
                isAccepted: result.isAccepted,
                substantiation: result.substantiation
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/decisions/' + result._id
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

router.get('/:decisionId', (req, res, next) => {
    Decision.findById(req.params.decisionId)
    .populate('damageReport', '_id')
    .exec()
    .then(decision => {
        if (!decision) {
            return res.status(404).json({
                message: "decision not found"
            });
        }
        res.status(200).json({
            decision: decision,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/decisions/'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:decisionId', (req, res, next) => {
    Decision.remove({ _id: req.params.decisionId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Decision deleted",
            request: {
                type: "POST",
                url: 'http://localhost:3000/decisions',
                body: { damageReport: "ID", isAccepted: "Boolean", substantiation: "String"}
            }
        });
    }); 
});

module.exports = router;