import express from "express";
import { getAllUsers, newUser, getUser, deleteUser } from "../controllers/userController.js";
import { andminOnly } from "../middlewares/auth.js";

const app = express.Router();

// route -/api/v1/user/new
app.post("/new", newUser)

// route -/api/v1/user/all
app.get("/all", andminOnly, getAllUsers) 

//---------------------------------------------------------------------
// // route -/api/v1/user/dynamicID
// app.get("/:id", getUser) 
// // route -/api/v1/user/dynamicID-delete
// app.delete("/:id", deleteUser)  chaining is below 👇
//---------------------------------------------------------------------

//Route -/api/v1/users/dynamicID
app.route("/:id").get(getUser).delete( andminOnly, deleteUser)

export default app;