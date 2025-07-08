import { Router } from "express";
import { getWalletBalance } from "../../controllers/PayementRelated/fetchBalance";
import { createCheckoutOrder, getKeyDetails } from "../../controllers/PayementRelated/combined";
import { isAmountSufficient } from "../../middlewares/isAmountSufficient";

const payementRouter = Router();

payementRouter.get('/balance',getWalletBalance);
payementRouter.get('/getKey',getKeyDetails);
payementRouter.post('/checkout',createCheckoutOrder);
// payementRouter.post('/paymentverification',paymentVerification);

export default payementRouter;