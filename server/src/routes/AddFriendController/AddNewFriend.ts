import { Router } from "express"

import { signupController } from "../../controllers/SignupController/signupController"
import addNewFriend from "../../controllers/AddFriendController/AddNewFriend"



const AddFriendRouter = Router()

AddFriendRouter.post("/", addNewFriend)

export default AddFriendRouter

