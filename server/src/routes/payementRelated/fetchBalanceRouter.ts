import { Router } from "express";
import { getWalletBalance } from "../../controllers/PayementRelated/fetchBalance";
import { createCheckoutOrder, getKeydetials, paymentVerification } from "../../controllers/PayementRelated/combined";
import { isAmountSufficient } from "../../middlewares/isAmountSufficient";

const payementRouter = Router();

payementRouter.get('/balance',getWalletBalance);
payementRouter.get('/getKey',getKeydetials);
payementRouter.post('/checkout',createCheckoutOrder);
// payementRouter.post('/paymentverification',paymentVerification);

export default payementRouter;