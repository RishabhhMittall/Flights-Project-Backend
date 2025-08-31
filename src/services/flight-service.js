const { StatusCodes } = require('http-status-codes');

const { FlightRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { response } = require('express');


const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
        if(new Date(data.departureTime) >= new Date(data.arrivalTime)) {
            throw new AppError('Departure time must be before arrival time', StatusCodes.BAD_REQUEST);
        }
        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach(err => {
                explanation.push(err.message);
            });
            throw new AppError(explanation , StatusCodes.BAD_REQUEST);
        }
        // If error is an AppError, propagate it
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Cannot create a new Flight object' , StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createFlight,
};
