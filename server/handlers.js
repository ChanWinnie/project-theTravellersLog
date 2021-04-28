const { MongoClient } = require("mongodb");

require("dotenv").config();

const request = require("request-promise");

const { MONGO_URI } = process.env;

const { GOOGLE_MAP_API_KEY } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbName = "travellers-db";

// Add a user as a document in mongodb
const addUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();

    const db = client.db(dbName);

    const result = await db.collection("users").insertOne(req.body);

    res.status(201).json({ status: 201, data: result });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

// Retrieve a user by email
const getUser = async (req, res) => {
  const email = req.params.email;

  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db(dbName);

    db.collection("users").findOne({ "user.email": email }, (err, result) => {
      result
        ? res.status(200).json({ status: 200, email, data: result })
        : res.status(404).json({ status: 404, email, data: "User Not Found" });
      client.close();
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

// Add a trip object to the trips array in the user document
const addUsersTrip = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { userEmail, tripValues } = req.body;

  try {
    await client.connect();
    const db = client.db();

    const query = { "user.email": userEmail };
    const newValues = { $addToSet: { trips: { $each: [tripValues] } } };

    const result = await db.collection("users").updateOne(query, newValues);

    res
      .status(201)
      .json({ status: 201, data: result, message: "New trip added" });
  } catch (err) {
    //console.log(err.stack);
    res.status(500).json({ status: 500, message: "Trip already exists" });
  } finally {
    client.close();
  }
};

// Delete a trip object from the trips array in the user document
const removeUserTrip = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { tripName, userEmail } = req.body;

  try {
    await client.connect();

    const db = client.db();

    const query = { "user.email": userEmail };
    const operation = { $pull: { trips: { name: tripName } } };

    const result = await db.collection("users").updateOne(query, operation);

    res
      .status(204)
      .json({ status: 204, data: result, message: "Trip removed" });
  } catch (err) {
    // console.log(err.stack);
    res
      .status(500)
      .json({ status: 500, message: "Error: unable to remove trip" });
  } finally {
    client.close();
  }
};

// Add an activity to the users document
const addUsersTripTask = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { userEmail, activityValues } = req.body;

  try {
    await client.connect();
    const db = client.db();

    const query = { "user.email": userEmail };
    const newValues = {
      $push: { activities: { $each: [activityValues] } },
    };

    const result = await db.collection("users").updateOne(query, newValues);

    res.status(201).json({ status: 201, data: result, message: "Updated" });
  } catch (err) {
    //console.log(err.stack);
    res.status(500).json({ status: 500, message: "Existing trip" });
  } finally {
    client.close();
  }
};

const updateActivity = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { userEmail, newActivityValues } = req.body;

  try {
    await client.connect();
    const db = client.db();

    const query = {
      "user.email": userEmail,
      "activities.where": newActivityValues.where,
      "activities.timeOfDay": newActivityValues.timeOfDay,
      "activities.day": newActivityValues.day,
      "activities.name": newActivityValues.name,
    };

    const newValues = {
      $set: {
        "activities.$.notes": newActivityValues.notes,
        "activities.$.when": newActivityValues.when,
      },
    };

    const result = await db.collection("users").updateOne(query, newValues);

    res
      .status(204)
      .json({ status: 204, data: result, message: "Updated activity" });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: "Activity not updated" });
  } finally {
    client.close();
  }
};

const removeActivity = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { userEmail, newActivityValues } = req.body;
  console.log(userEmail, newActivityValues);
  try {
    await client.connect();
    const db = client.db();

    const query = { "user.email": userEmail };
    const newValues = {
      $pull: {
        activities: {
          where: newActivityValues.where,
          timeOfDay: newActivityValues.timeOfDay,
          day: newActivityValues.day,
          name: newActivityValues.name,
        },
      },
    };

    const result = await db.collection("users").updateOne(query, newValues);

    res
      .status(204)
      .json({ status: 204, data: result, message: "Activity removed" });
  } catch (err) {
    //console.log(err.stack);
    res
      .status(500)
      .json({ status: 500, message: "Error: unable to remove activity" });
  } finally {
    client.close();
  }
};

// Given coordinates and a type, get an array of nearby places matching the type
const getPlacesByType = (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;
  const type = req.params.type;

  request(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&key=${GOOGLE_MAP_API_KEY}`
  )
    .then((response) => JSON.parse(response))
    .then((response) => {
      console.log(response);
      res.status(200).json({ status: 200, message: response });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  addUser,
  getUser,
  addUsersTrip,
  removeUserTrip,
  addUsersTripTask,
  updateActivity,
  removeActivity,
  getPlacesByType,
};
