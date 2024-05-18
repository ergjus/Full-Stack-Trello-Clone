import express from "express";
import MyUserController from "../controllers/MyUserController";
import {jwtCheck, jwtParse} from "../middleware/auth";
import {validateMyUserRequest} from "../middleware/validation";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);

// handles request to create new user
router.post("/", jwtCheck, MyUserController.createCurrentUser);

// handles request to update user
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);
/*
 * REUSABLE MIDDLEWARE CODE
 * jwtCheck - user is logged in and has valid access token
 * jwtParse - get user information, make sure user exists
 * validateMyUserRequest - validate the request body to make sure theres no fields missing
 * updateCurrentUser - update user based on fields in the request
 */

export default router;
