const express = require("express");
const router = express.Router();
const OrderController = require('../controllers/OrderController')
const {authUserMiddleware} = require('../middleware/authMiddleware')

router.post('/create', OrderController.createOrder)
router.get('/get-all-order/:id', OrderController.getDetailsAllOrder)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:id', OrderController.cancelOrderDetails)
router.get('/get-all-order', OrderController.getAllOrders)

module.exports = router