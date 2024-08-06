import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const emissionSchema = new Schema({
    month: {type: String, required: true},
    year: {type: String, required: true},
    region: {type: String, required: true},
    electricity: {type: Number, required: true},
    gas: {type: String, required: true},
    gasusage: {type: Number, required: true},
    woodName: {type: String, required: true},
    wood: {type: Number, required: true},
    priv_name_a: {type: String, required: true},
    priv_old_a: {type: Number, required: true},
    priv_fuel_a: {type: String, required: true},
    priv_mileage_a: {type: Number, required: true},
    priv_dist_a: {type: Number, required: true},
    priv_name_b: {type: String, required: true},
    priv_old_b: {type: Number, required: true},
    priv_fuel_b: {type: String, required: true},
    priv_mileage_b: {type: Number, required: true},
    priv_dist_b: {type: Number, required: true},
    waste: {type: Number, required: true},
    meal: {type: String, required: true},
    meals: {type: Number, required: true},
    renewable: {type: String, required: true},
    renewunit: {type: Number, required: true},
    totalemission: {type: Number, required: true},
    user: {type: String, required: true}
}, {timestamps: {createdAt: 'createdAt'}})

const Emission = model('Emission', emissionSchema)
export default Emission
