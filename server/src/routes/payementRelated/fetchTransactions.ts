import { Router } from "express";
import { getWalletBalance } from "../../controllers/PayementRelated/fetchBalance";
import { createCheckoutOrder, getKeydetials, paymentVerification } from "../../controllers/PayementRelated/combined";
import { isAmountSufficient } from "../../middlewares/isAmountSufficient";
import { getUserTransactions } from "../../controllers/PayementRelated/fetchTransactions";

const getTransactionsRouter = Router();

getTransactionsRouter.get('/',getUserTransactions);

export default getTransactionsRouter;