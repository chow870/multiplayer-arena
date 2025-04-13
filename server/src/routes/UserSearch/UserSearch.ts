import { Router } from "express"
import { getAllUsersForFriendRequest } from "../../controllers/UserSearch/searchUser"

const UserSearchRouter = Router()

UserSearchRouter.post("/", getAllUsersForFriendRequest)
export default UserSearchRouter
// server/src/controllers/UserSearch/searchUser.ts