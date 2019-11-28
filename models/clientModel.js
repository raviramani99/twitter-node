/*
FileName : clientModel.js
Date : 6th May 2019
Description : This file consist of model fields
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({

    clientType: { type: String },
    carInfo: { type: Object },
    personalInfo: { type: Object },
    employment: { type: Object },
    creditInfo: { type: Object },
    refrence: { type: Object },
    vehicalDescription: { type: Object },
    vehicalOptions: { type: Object },
    payments: { type: Object },
    warranty: { type: Object },
    tradeIn: { type: Object },
    clientIds: { type: Object },
    notes: { type: String },

    //For Lease Client
    leaseTerms: { type: Object },
    leasePayments: { type: Object },
    leaseCostDisclosure: { type: Object },
    amountDueOnDelivery: { type: Object },
    leaseTypes: { type: Object },

    //For Finance Client
    financingTerms: { type: Object },

    createdAt: { type: Date, default: Date.now() },
    deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Client', clientSchema);