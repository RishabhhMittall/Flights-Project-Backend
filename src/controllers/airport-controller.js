const { StatusCodes } = require("http-status-codes");
const { AirportSerivce } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

/**
 * POST: /airports
 * req-body {name: 'IGI', cityId: 5, code: 'DEL'}
 */

async function createAirport(req, res) {
  try {
    const airport = await AirportSerivce.createAirport({
      name: req.body.name,
      code: req.body.code,
      address: req.body.address,
      cityId: req.body.cityId,
    });

    SuccessResponse.data = airport;
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
 * GET: /airports
 * req-body {}
 */

async function getAirports(req, res) {
    try {
      const airports = await AirportSerivce.getAirports();
      SuccessResponse.data = airports;
      return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
      ErrorResponse.error = error;
      return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
}

/**
 * GET: /airport/:id
 * req-body {}
 */

async function getAirport(req, res) {
    try {
      const airport = await AirportSerivce.getAirport(req.params.id);
      SuccessResponse.data = airport;
      return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
      ErrorResponse.error = error;
      return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
}

/**
 * DELETE: /airport/:id
 * req-body {}
 */
async function destroyAirport(req, res) {
    try {
      const airport = await AirportSerivce.destroyAirport(req.params.id);
      SuccessResponse.data = airport;
      return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
      ErrorResponse.error = error;
      return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
}

/**
 * PATCH: /airplanes/:id
 * req-body { capacity: 250 }
 */
async function modifyAirport(req, res) {
    try {
      const updatedAirport = await AirportSerivce.modifyAirport(req.params.id, {
        name: req.body.name,
        code: req.body.code,
        address: req.body.address,
        cityId: req.body.cityId,
      });

      SuccessResponse.data = updatedAirport;
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


module.exports = {
  createAirport,
  getAirports,
  getAirport,
  destroyAirport,
  modifyAirport
};
