// server/src/routes/authRoutes.ts
import { Router } from "express"
import { getUserFriendships } from "../../controllers/DisplayFriends/displayFriends"


const DisplayFriendsRouter = Router()

DisplayFriendsRouter.get("/", getUserFriendships)

export default DisplayFriendsRouter