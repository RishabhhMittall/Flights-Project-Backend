const {StatusCodes} = require('http-status-codes');

const { CityRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { response } = require('express');


const cityRepository = new CityRepository();

async function getAllCities() {
  try {
    const cities = await cityRepository.getAll();
    return cities;
  } catch (error) {
    throw new AppError('Cannot fetch cities', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function createCity(data) {
     try {
        const city = await cityRepository.create(data);
        return city;
    } catch (error) {
        console.log(error)

        if(error.name === 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach(err => {
                explanation.push(err.message);
            });
            console.log(explanation)

            throw new AppError(explanation , StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new City object' , StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateCity(id, data) {
     try {
        const city = await cityRepository.update(id, data);
        if (!city) {
            throw new AppError('City not found', StatusCodes.NOT_FOUND);
        }
        return city;
    } catch (error) {
        throw new AppError('Cannot update City', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteCity(id) {
     try {
        const result = await cityRepository.destroy(id);
        if (!result) {
            throw new AppError('City not found', StatusCodes.NOT_FOUND);
        }
        return { message: "City deleted successfully", id };
    } catch (error) {
        throw new AppError('Cannot delete City', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}   


module.exports = {
    getAllCities,
    createCity,
    updateCity,
    deleteCity,
}
