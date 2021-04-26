const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const cors = require("cors");
const {
  addUser,
  getUser,
  addUsersTrip,
  removeUserTrip,
  addUsersTripTask,
  getPlacesByType,
  addPlaceOfInterest,
  updateActivity,
  removeActivity,
  deleteUserAccount,
  removeNearbyPlace,
} = require("./handlers");

app.use(cors());
app.use(morgan("tiny"));
// Need this even though it's deprecated:
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Backend server is working :)");
});

app.get("/currentUser/:email", getUser);
app.post("/signup", addUser);
app.post("/addtrip", addUsersTrip);
app.delete("/remove", removeUserTrip);
app.post("/addtask", addUsersTripTask);
app.get("/getplaces/:lat/:lng/:type", getPlacesByType);
app.post("/addplace", addPlaceOfInterest);
app.put("/updateActivity", updateActivity);
app.delete("/removeActivity", removeActivity);
app.delete("/deleteAccount", deleteUserAccount);
app.delete("/removeNearbyPlace", removeNearbyPlace);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
