import { Router } from "express";
import { paymentVerification } from "../../controllers/PayementRelated/combined";


const ConfirmpayementRouter = Router();

ConfirmpayementRouter.post('/',paymentVerification);

export default ConfirmpayementRouter;