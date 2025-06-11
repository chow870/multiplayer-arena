import { Router } from "express";
import { getWalletBalance } from "../../controllers/PayementRelated/fetchBalance";
import { createCheckoutOrder, getKeydetials, paymentVerification } from "../../controllers/PayementRelated/combined";
import { isAmountSufficient } from "../../middlewares/isAmountSufficient";

const ConfirmpayementRouter = Router();

ConfirmpayementRouter.post('/',paymentVerification);

export default ConfirmpayementRouter;