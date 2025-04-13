import { Router } from "express"
import { getAllUsersForFriendRequest } from "../../controllers/UserSearch/searchUser"
import acceptFriendRequest from "../../controllers/FriendRequest/acceptFriendRequest"
import BlockFriendRequest from "../../controllers/FriendRequest/blockFriendRequest"

const FriendRequestRouter = Router()

FriendRequestRouter.post("/accept", acceptFriendRequest)
FriendRequestRouter.post("/block", BlockFriendRequest)
export default FriendRequestRouter
// server/src/controllers/UserSearch/searchUser.ts