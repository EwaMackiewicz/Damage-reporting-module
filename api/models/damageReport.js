const mongoose = require('mongoose');

const damageReportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clientId: { type: String, required: true },
    description: { type: String, required: true }
},{
    timestamps: true
});

module.exports = mongoose.model('Damage Report', damageReportSchema);