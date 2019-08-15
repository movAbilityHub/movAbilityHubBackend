const router = require("express").Router();

const passport = require("passport");

const Request = require("../../models/requests");

const validateStoreRequest = require("../../validation/storeRequest");
const validateViewOpenRequest = require("../../validation/viewOpenRequest");
const validateViewClosedRequest = require("../../validation/viewClosedRequest");
const validateRequestActionByAirline = require("../../validation/requestActionByAirline");
const validateRequestActionByAirport = require("../../validation/requestActionByAirport");

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
        countryCode: req.body.countryCode
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

  Request.findOne({
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

  Request.findOne({
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

  if (req.body.airlineResponse === true) {
    Request.findOneAndUpdate(
      {
        id: req.body.id
      },
      { $set: { airlineResponse: true, status: true } },
      { new: true },
      (err, request) => {
        if (err) return res.status(500).send(err);
        return res.status(200);
      }
    );
  } else {
    Request.findOne({ id: req.body.id })
      .then(request => {
        if (request.aiportResponse === false) {
          Request.findOneAndUpdate(
            {
              id: req.body.id
            },
            { $set: { status: false } },
            { new: true },
            (err, request) => {
              if (err) return res.status(500).send(err);
              return res.status(200);
            }
          );
        } else {
          return res.status(200);
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

  if (req.body.airportResponse === true) {
    Request.findOneAndUpdate(
      {
        id: req.body.id
      },
      { $set: { airportResponse: true, status: true } },
      { new: true },
      (err, request) => {
        if (err) return res.status(500).send(err);
        return res.status(200);
      }
    );
  } else {
    Request.findOne({ id: req.body.id })
      .then(request => {
        if (request.airlineResponse === false) {
          Request.findOneAndUpdate(
            {
              id: req.body.id
            },
            { $set: { status: false } },
            { new: true },
            (err, request) => {
              if (err) return res.status(500).send(err);
              return res.status(200);
            }
          );
        } else {
          return res.status(200);
        }
      })
      .catch(err => res.status(500).send(err));
  }
});

module.exports = router;
