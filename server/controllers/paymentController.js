import { instance } from "../index.js";

const createOrder = async (req, res) => {
  try {
    const order = await instance.orders.create({
      amount: Number(req.body.amount * 100),
      currency: "INR",
    });

    return res.status(200).json({
      message: "Order Created",
      order,
    });
  } catch (error) {
    console.error(error);
  }
};

export { createOrder };
