import Emission from '../models/EmissionModel.js'
import User from '../models/UserModel.js'
import { CourierClient } from '@trycourier/courier'

const courier = new CourierClient({ authorizationToken: process.env.COURIER_AUTH_KEY})

export async function createEmission(req, res) {
    try {
        const {month, year, area, electricity, gas, gasusage, woodname, wood, priv_name_a, priv_old_a, priv_fuel_a, priv_mileage_a, priv_dist_a, priv_name_b, priv_old_b, priv_fuel_b, priv_mileage_b, priv_dist_b, waste, meal, meals, renewable, renewunit} = req.body
        const email = req.user.email

        const checkEmission = await Emission.findOne({
            user: email,
            month: month,
            year: year
        })

        const user = await User.findOne({email})

        if (checkEmission)
            return res.status(400).send('Emission data for this month and year already exists')

        let adjustedElectricity = electricity;
        if (renewable === "yes") {
            adjustedElectricity -= renewunit;
        }
        const electricityEmission = adjustedElectricity * 0.82;

        let gasEmission = 0;
        if (gas === "gas-pipeline") {
            gasEmission = gasusage * 22.73;
        } else if (gas === "gas-cylinder") {
            gasEmission = gasusage * 100;
        }

        const woodEmission = wood * 1.6 * 4;

        var v1 = priv_dist_a/priv_mileage_a;
        if (priv_fuel_a === 'petrol')
            v1 = v1*2.2
        else
            v1 = v1*2.6

        var v2 = priv_dist_b/priv_mileage_b;
        if (priv_fuel_b === 'petrol')
            v2 = v2*2.2
        else
            v2 = v2*2.6

        const travelEmission = v1 + v2;

        const wasteEmission = waste * 1.49 * 4;

        let mealEmission = 0;
        if (meal === "vegetarian") {
            mealEmission = meals * 1.75 * 30;
        } else if (meal === "non-vegetarian") {
            mealEmission = meals * 3.5 * 30;
        }

        // Total carbon footprint
        const totalFootprint = electricityEmission + gasEmission + woodEmission + travelEmission + wasteEmission + mealEmission;

        const emission = new Emission({
            month,
            year,
            region: area,
            electricity: electricityEmission,
            gas,
            gasusage: gasEmission,
            wood: woodEmission,
            priv: travelEmission,
            waste: wasteEmission,
            meal,
            meals: mealEmission,
            renewable,
            renewunit,
            totalemission: totalFootprint,
            user: email,
            priv_name_a, priv_old_a, priv_fuel_a, priv_mileage_a, priv_dist_a, priv_name_b, priv_old_b, priv_fuel_b, priv_mileage_b, priv_dist_b,
            woodName: woodname
        })
        await emission.save()

        const { requestId } = await courier.send({
            message: {
                to: {
                    email: email,
                },
                template: "CKZGVMPJM04BJ5KSK48F49F5SHVN",
                data: {
                      Name: user.name,
                      month,
                      year,
                      area,
                      electricityEmission,
                      gas,
                      gasEmission,
                      woodname,
                      wood,
                      namea: priv_name_a,
                      olda: priv_old_a,
                      fuela: priv_fuel_a,
                      dista: priv_dist_a,
                      nameb: priv_name_b,
                      oldb: priv_old_b,
                      fuelb: priv_fuel_b,
                      distb: priv_dist_b,
                      tarvelEmission: travelEmission,
                      meal,
                      mealEmission,
                      wasteans: "wasteans",
                      wasteEmission,
                      renewable,
                      renewunit,
                      totalFootprint,
                      woodEmission
                    },
            },
        })
        
        res.status(201).send("Created Successfully")
    }
    catch (err) {
        res.status(500).send(`error: ${err}`)
    }
}

export async function getEmission(req, res) {
    try {
        //const email = req.body.email
        const {month, year} = req.body
        const email = req.user.email

        const emission = await Emission.findOne({
            user: email,
            month: month,
            year: year
        })
        res.status(200).json(emission)
    }
    catch (err) {
        res.status(500).send("Error finding the emission")
    }
}

export async function getALlEmissions(req, res) {
    try {
        const emissions = await Emission.find({})
        res.status(200).json(emissions)
    }
    catch (err) {
        res.status(500).send("Error finding emissions")
    }
}

export async function getLast12Emissions(req, res) {
    try {
        const email = req.user.email
        const emissions = await Emission.find({user: email}).sort({createdAt: -1}).limit(12).exec()

        res.status(200).send(emissions)
    }
    catch (err) {
        res.status(500).send(`error: ${err}`)
    }
}
