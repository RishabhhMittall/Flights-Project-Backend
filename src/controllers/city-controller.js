const { StatusCodes } = require("http-status-codes");
const { CityService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

/**
 * GET: /cities
 */
async function getAllCities(req, res) {
  try {
    const cities = await CityService.getAllCities();
    SuccessResponse.data = cities;
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}


/**
 * POST: /cities
 * req-body {name: 'London'}
 */

async function createCity(req, res) {
  try {
    const city = await CityService.createCity({
      name: req.body.name
    });

    SuccessResponse.data = city;
    return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);
  } 
  catch (error) {
    ErrorResponse.error = error;
    return res
            .status(error.statusCode)
            .json(ErrorResponse);
  }
}

/**
 * PATCH: /cities/:id
 * req-body { name: 'NewName' }
 */
async function updateCity(req, res) {
  try {
    const city = await CityService.updateCity(req.params.id, {
      name: req.body.name
    });

    SuccessResponse.data = city;
    return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
  } 
  catch (error) {
    ErrorResponse.error = error;
    return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
  }
}

/**
 * DELETE: /cities/:id
 */
async function deleteCity(req, res) {
  try {
    const result = await CityService.deleteCity(req.params.id);

    SuccessResponse.data = result;
    return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
  } 
  catch (error) {
    ErrorResponse.error = error;
    return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
  }
}

module.exports = {
    getAllCities,
    createCity,
    updateCity,
    deleteCity,
}