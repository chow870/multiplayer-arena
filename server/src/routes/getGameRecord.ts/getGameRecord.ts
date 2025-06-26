import { Router } from "express";

import { getUserGameRecords } from "../../controllers/GamesRelatedController/getuserGameRecords";

const getGameRecordsRouter = Router();

getGameRecordsRouter.get('/',getUserGameRecords);

export default getGameRecordsRouter;