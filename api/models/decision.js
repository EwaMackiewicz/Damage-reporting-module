const mongoose = require('mongoose');

const decisionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    damageReport: { type: mongoose.Schema.Types.ObjectId, ref: 'Damage Report', required: true },
    isAccepted: { type: Boolean, required: true },
    substantiation: { type: String, default: ' ' }
},{
    timestamps: true
});

module.exports = mongoose.model('Decision Report', decisionSchema);