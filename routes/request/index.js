const router = require("express").Router();

const passport = require("passport");

const Request = require("../../models/requests");
const StaffOthers = require("../../models/staffOthers");

const validateStoreRequest = require("../../validation/storeRequest");
const validateViewOpenRequest = require("../../validation/viewOpenRequest");
const validateViewClosedRequest = require("../../validation/viewClosedRequest");
const validateRequestActionByAirline = require("../../validation/requestActionByAirline");
const validateRequestActionByAirport = require("../../validation/requestActionByAirport");
const validateCancelRequest = require("../../validation/cancelRequest");
const validateFetchRequestForStaff = require("../../validation/fetchRequestForStaff");

router.post("/storeRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateStoreRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.json({ errors: errors });
  }

  Request.findOne({ ticketNumber: req.body.ticketNumber }).then(request => {
    if (request) {
      return res.json({
        errors: { alreadyExists: "Request for this ticket already exists" }
      });
    } else {
      const newRequest = new Request({
        passportNumber: req.body.passportNumber,
        ticketNumber: req.body.ticketNumber,
        travelTime: req.body.travelTime,
        travelDate: req.body.travelDate,
        flightNumber: req.body.flightNumber,
        origin: req.body.origin,
        destination: req.body.destination,
        requestedBy: req.body.requestedBy,
        requesterID: req.body.requesterID,
        disability: req.body.disability,
        age: req.body.age,
        service: req.body.service,
        requestedFor: req.body.requestedFor,
        phoneNumber: req.body.phoneNumber,
        transitDestination: req.body.transitDestination,
        transitDestinationCode: req.body.transitDestinationCode,
        transitAirline: req.body.transitAirline,
        transitAirlineCode: req.body.transitAirlineCode,
        destinationCode: req.body.destinationCode,
        originCode: req.body.originCode,
        airline: req.body.airline,
        airlineCode: req.body.airlineCode
      });

      newRequest
        .save()
        .then(request =>
          res
            .status(201)
            .json({ message: { success: "Request raised successfully" } })
        )
        .catch(err => res.status(500).send(err));
    }
  });
});

router.post("/viewOpenRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateViewOpenRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  Request.find({
    requesterID: req.body.requesterID,
    closedByPassenger: false
  })
    .then(request => {
      if (request) {
        return res.status(200).json({ request: request, success: true });
      }
    })
    .catch(err => res.status(400).send(err));
});

router.post("/viewClosedRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateViewClosedRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  Request.find({
    requesterID: req.body.requesterID,
    closedByPassenger: true
  })
    .then(request => {
      if (request) {
        return res.status(200).json({ request: request, success: true });
      }
    })
    .catch(err => res.status(400).send(err));
});

router.post("/performActionByAirline", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRequestActionByAirline(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  if (req.body.airlineResponse === "true") {
    Request.findByIdAndUpdate(
      req.body.id,
      { $set: { airlineResponse: req.body.airlineResponse } },
      { new: true },
      (err, request) => {
        if (err) return res.status(400).send(err);
        const response = {
          message: "Request " + request.id + " approved"
        };
        return res.status(200).send({ response: response });
      }
    );
  } else {
    Request.findById(req.body.id)
      .then(request => {
        if (
          request.destinationAiportResponse === "false" &&
          request.departureAiportResponse === "false"
        ) {
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
              if (err) return res.status(400).send(err);
              const response = {
                message: "Request " + request.id + " denied"
              };
              return res.status(200).send({ response: response });
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
              if (err) return res.status(400).send(err);
              const response = {
                message: "Request " + request.id + " denied"
              };
              return res.status(200).send({ response: response });
            }
          );
        }
      })
      .catch(err => res.status(400).send(err));
  }
});

router.post("/performActionByAirport", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRequestActionByAirport(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  if (req.body.airportResponse === "true") {
    if (req.body.responseBy === "departureAirport") {
      Request.findByIdAndUpdate(
        req.body.id,
        { $set: { departureAirportResponse: req.body.airportResponse } },
        { new: true },
        (err, request) => {
          if (err) return res.status(400).send(err);
          const response = {
            message: "Request " + request.id + " approved"
          };
          return res.status(200).send({ response: response });
        }
      );
    } else if (req.body.responseBy === "destinationAirport") {
      Request.findByIdAndUpdate(
        req.body.id,
        { $set: { destinationAirportResponse: req.body.airportResponse } },
        { new: true },
        (err, request) => {
          if (err) return res.status(400).send(err);
          const response = {
            message: "Request " + request.id + " approved"
          };
          return res.status(200).send({ response: response });
        }
      );
    }
  } else {
    Request.findById(req.body.id)
      .then(request => {
        if (
          request.departureAirlineResponse === "false" &&
          request.destinationAirlineResponse === "false"
        ) {
          if (req.body.responseBy === "departureAirport") {
            Request.findByIdAndUpdate(
              req.body.id,
              {
                $set: {
                  departureAirportResponse: req.body.airportResponse,
                  status: false
                }
              },
              { new: true },
              (err, request) => {
                if (err) return res.status(400).send(err);
                const response = {
                  message: "Request " + request.id + " denied"
                };
                return res.status(200).send({ response: response });
              }
            );
          } else if (req.body.responseBy === "destinationAirport") {
            Request.findByIdAndUpdate(
              req.body.id,
              {
                $set: {
                  destinationAirportResponse: req.body.airportResponse,
                  status: false
                }
              },
              { new: true },
              (err, request) => {
                if (err) return res.status(400).send(err);
                const response = {
                  message: "Request " + request.id + " denied"
                };
                return res.status(200).send({ response: response });
              }
            );
          }
        } else {
          if (req.body.responseBy === "departureAirport") {
            Request.findByIdAndUpdate(
              req.body.id,
              {
                $set: {
                  departureAirportResponse: req.body.airportResponse
                }
              },
              { new: true },
              (err, request) => {
                if (err) return res.status(400).send(err);
                const response = {
                  message: "Request " + request.id + " denied"
                };
                return res.status(200).send({ response: response });
              }
            );
          } else if (req.body.responseBy === "destinationAirport") {
            Request.findByIdAndUpdate(
              req.body.id,
              {
                $set: {
                  destinationAirportResponse: req.body.airportResponse
                }
              },
              { new: true },
              (err, request) => {
                if (err) return res.status(400).send(err);
                const response = {
                  message: "Request " + request.id + " denied"
                };
                return res.status(200).send({ response: response });
              }
            );
          }
        }
      })
      .catch(err => res.status(400).send(err));
  }
});

router.post("/cancelRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateCancelRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  Request.findByIdAndRemove(req.body.id, (err, request) => {
    if (err) return res.status(400).send(err);
    const response = {
      message: "Request " + request.id + " successfully deleted"
    };
    return res.status(200).send({ response: response, success: true });
  });
});

router.post("/closeRequest", (req, res) => {
  // Form validation

  const { errors, isValid } = validateCancelRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.body.closedBy === "airline") {
    Request.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          closedByAirline: true
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
  } else if (req.body.closedBy === "departureAirport") {
    Request.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          closedByDepartureAirport: true
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
  } else if (req.body.closedBy === "destinationAirport") {
    Request.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          closedByDestinationAirport: true
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
  }
});

router.get("/fetchRegisteredAirport", (req, res) => {
  StaffOthers.find(
    { userType: "airport", approved: true },
    "organisationName code",
    (err, airports) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json({ airports: airports });
    }
  );
});

router.get("/fetchRegisteredAirline", (req, res) => {
  StaffOthers.find(
    { userType: "airline", approved: true },
    "organisationName code",
    (err, airlines) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json({ airlines: airlines });
    }
  );
});

router.post("/fetchRequestForAirport", (req, res) => {
  // Form validation

  const { errors, isValid } = validateFetchRequestForStaff(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  Request.find(
    {
      $or: [
        {
          originCode: req.body.code,
          closedByDepartureAirport: req.body.closed
        },
        {
          destinationCode: req.body.code,
          closedByDestinationAirport: req.body.closed
        }
      ]
    },
    (err, request) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ request: request, success: true });
    }
  );
});

router.post("/fetchRequestForAirline", (req, res) => {
  // Form validation

  const { errors, isValid } = validateFetchRequestForStaff(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  Request.find(
    { airlineCode: req.body.code, closedByAirline: req.body.closed },
    (err, request) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ request: request, success: true });
    }
  );
});

router.post("/closeRequestByPassenger", (req, res) => {
  // Form validation

  const { errors, isValid } = validateCancelRequest(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  Request.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        closedByPassenger: true
      }
    },
    { new: true },
    (err, request) => {
      if (err) return res.status(400).send(err);
      const response = {
        message: "Request " + request.id + " successfully closed"
      };
      return res.status(200).send({ response: response, success: true });
    }
  );
});

module.exports = router;
