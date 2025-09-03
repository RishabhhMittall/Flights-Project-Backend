const { Sequelize } = require('sequelize');
const CrudRepository = require('./crud-repository');

const {Flight, Airplane, Airport, City} = require('../models');
const db = require('../models');

const { addRowLockOnFLights } = require('./queries')

class FlightRepository extends CrudRepository {
    constructor() {
        super(Flight);

    }

    async getAllFlights(filter, sort) {
        const response = await this.model.findAll({
            where:filter,
            order:sort,
            include: [{
                model: Airplane,
                required: true,
                as: 'airplaneDetail'
            },
            {
                model:Airport,
                required:true,
                as: 'departureAirport',
                on: {
                    col1: Sequelize.where(Sequelize.col("Flight.departureAirportId"), "=", Sequelize.col("departureAirport.code"))
                },
                include: {
                    model: City,
                    required: true
                }
            },
            {
                model:Airport,
                required:true,
                as: 'arrivalAirport',
                on: {
                    col1: Sequelize.where(Sequelize.col("Flight.arrivalAirportId"), "=", Sequelize.col("arrivalAirport.code"))
                },
                include: {
                    model: City,
                    required: true
                }
            },
        ]
        });
        return response;

    }

    async updateRemainingSeats(flightId, seats, dec = true){
        const transaction = await db.sequelize.transaction();

       try {
         await db.sequelize.query(addRowLockOnFLights(flightId));

        const flight = await Flight.findByPk(flightId); 

        // USE 0 or 1 for decrement (dec)
        if(+dec) {
            // because of transaction the query will be executed inside one whole transaction if faced any error - then rollback automatically
            await flight.decrement('totalSeats', {by:seats}, {transaction: transaction});
        }
        else {
            await flight.increment('totalSeats', {by: seats}, {transaction: transaction})
        }
        await transaction.commit();
        return flight;
       } 
       catch (error) {
            await transaction.rollback();
            throw error;
       }
    }

}



module.exports = FlightRepository;