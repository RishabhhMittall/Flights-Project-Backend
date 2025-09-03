const { StatusCodes } = require('http-status-codes');
const { compareTime } = require('../utils/helpers/date-time-helpers');
const { Op } = require('sequelize');

const { FlightRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { response } = require('express');


const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
         if (compareTime(data.departureTime, data.arrivalTime)) {
            throw new AppError('Departure time must be before arrival time', StatusCodes.BAD_REQUEST);
        }
        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {
        console.error(error);
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

async function getAllFlights(query) {
    let customFilter = {};
    let sortFilter = [];
    const startingTripTime = " 00:00:00";
    const endingTripTime = " 23:59:59";

    //tripes=MUM-DEL
    if(query.trips) {
        [departureAirportId, arrivalAirportId] = query.trips.split("-");
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
        //ToDo add a check if they are not same
    }
    if(query.price) {
        [minPrice, maxPrice] = query.price.split("-");

        customFilter.price = {
            [Op.between]: [minPrice, (maxPrice == undefined) ? 20000:maxPrice]
        }
    }
    if(query.travellers) {
        customFilter.totalSeats = {
            [Op.gte]: query.travellers  //avialble number of seats should greater than or equal to
        }
    }
    if(query.tripDate) {
        customFilter.departureTime = {
            [Op.between]: [
                query.tripDate + startingTripTime,
                query.tripDate + endingTripTime
    ]
        }
    }
    if(query.sort) {
        const params = query.sort.split(',');
        const sortFilters = params.map((param) => param.split('_'));
        sortFilter = sortFilters
    }
    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    }
    catch(error) {
        throw new AppError('Cannot fetch data of all the flights' , StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlight(id) {
     try {
        const flight = await flightRepository.get(id);
        return flight;
    }
    catch(error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('The flight you requested is not present', error.statusCode)
        }
        throw new AppError('Cannot fetch data of the flight' , StatusCodes.INTERNAL_SERVER_ERROR);
    }
} 

async function updateSeats(data) {
    try {
        const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats, data.dec);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError('Cannot update data of the flight' , StatusCodes.INTERNAL_SERVER_ERROR);
        
    }
}


module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats,
};
