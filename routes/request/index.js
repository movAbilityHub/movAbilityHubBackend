const router = require("express").Router();

const passport = require("passport");

const Request = require("../../models/requests");

const validateStoreRequest = require("../../validation/storeRequest");
const validateViewOpenRequest = require("../../validation/viewOpenRequest");
const validateViewClosedRequest = require("../../validation/viewClosedRequest");
const validateRequestActionByAirline = require("../../validation/requestActionByAirline");
const validateRequestActionByAirport = require("../../validation/requestActionByAirport");
const validateCancelRequest = require("../../validation/cancelRequest");

router.post("/storeRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateStoreRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Request.findOne({ ticketNumber: req.body.ticketNumber }).then(request => {
    if (request) {
      return res
        .status(400)
        .json({ alreadyExists: "Request for this ticket already exists" });
    } else {
      const newRequest = new Request({
        passportNumber: req.body.passportNumber,
        ticketNumber: req.body.ticketNumber,
        travelDate: req.body.travelDate,
        travelTime: req.body.travelTime,
        flightNumber: req.body.flightNumber,
        origin: req.body.origin,
        destination: req.body.destination,
        requestedBy: req.body.requestedBy,
        requesterID: req.body.requesterID,
        disability: req.body.disability,
        age: req.body.age,
        service: req.body.origin,
        requestedFor: req.body.requestedFor,
        phoneNumber: req.body.phoneNumber,
        countryCode: req.body.countryCode,
        transitDestination: req.body.transitDestination
      });

      newRequest
        .save()
        .then(request => res.status(201))
        .catch(err => res.status(500).send(err));
    }
  });
});

router.post("/viewOpenRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateViewOpenRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Request.find({
    requesterID: req.body.requesterID,
    status: req.body.status
  })
    .then(request => {
      if (request) {
        return res.status(200).json({ request: request });
      }
    })
    .catch(err => res.status(500).send(err));
});

router.post("/viewClosedRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateViewClosedRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Request.find({
    requesterID: req.body.requesterID,
    closed: req.body.closed
  })
    .then(request => {
      if (request) {
        return res.status(200).json({ request: request });
      }
    })
    .catch(err => res.status(500).send(err));
});

router.post("/performActionByAirline", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRequestActionByAirline(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.body.airlineResponse === "true") {
    Request.findByIdAndUpdate(
      req.body.id,
      { $set: { airlineResponse: req.body.airlineResponse } },
      { new: true },
      (err, request) => {
        if (err) return res.status(500).send(err);
        return res.status(200);
      }
    );
  } else {
    Request.findById(req.body.id)
      .then(request => {
        if (request.aiportResponse === "false") {
          Request.findByIdAndUpdate(
            req.body.id,
            {
              $set: {
                airlineResponse: req.body.airlineResponse,
                status: false
              }
            },
            { new: true },
            (err, request) => {
              if (err) return res.status(500).send(err);
              return res.status(200);
            }
          );
        } else {
          Request.findByIdAndUpdate(
            req.body.id,
            {
              $set: {
                airlineResponse: req.body.airlineResponse
              }
            },
            { new: true },
            (err, request) => {
              if (err) return res.status(500).send(err);
              return res.status(200);
            }
          );
        }
      })
      .catch(err => res.status(500).send(err));
  }
});

router.post("/performActionByAirport", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRequestActionByAirport(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.body.airportResponse === "true") {
    Request.findByIdAndUpdate(
      req.body.id,
      { $set: { airportResponse: req.body.airportResponse } },
      { new: true },
      (err, request) => {
        if (err) return res.status(500).send(err);
        return res.status(200);
      }
    );
  } else {
    Request.findById(req.body.id)
      .then(request => {
        if (request.airlineResponse === "false") {
          Request.findByIdAndUpdate(
            req.body.id,
            {
              $set: {
                airportResponse: req.body.airportResponse,
                status: false
              }
            },
            { new: true },
            (err, request) => {
              if (err) return res.status(500).send(err);
              return res.status(200);
            }
          );
        } else {
          Request.findByIdAndUpdate(
            req.body.id,
            {
              $set: {
                airportResponse: req.body.airportResponse
              }
            },
            { new: true },
            (err, request) => {
              if (err) return res.status(500).send(err);
              return res.status(200);
            }
          );
        }
      })
      .catch(err => res.status(500).send(err));
  }
});

router.post("/cancelRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateCancelRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Request.findByIdAndRemove(req.body.id, (err, request) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Request successfully deleted",
      id: request._id
    };
    return res.status(200).send({ response: response });
  });
});

router.post("/closeRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateCancelRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Request.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        closed: true
      }
    },
    { new: true },
    (err, request) => {
      if (err) return res.status(500).send(err);
      const response = {
        message: "Request successfully closed",
        id: request._id
      };
      return res.status(200).send({ response: response });
    }
  );
});

module.exports = router;
