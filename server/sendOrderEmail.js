const nodemailer = require("nodemailer");

const sendOrderEmail = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email_User,
        pass: process.env.Email_Password,
      },
    });

    const itemsHTML = order.items.map(item => `
      <tr>
        <td>${item.product}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `).join("");

    const mailOptions = {
      from: process.env.Email_User,
      to: order.customer.email,
      subject: "Order Confirmation",
      html: `
        <h2>Order Confirmation</h2>
        <p>Hi ${order.customer.firstName},</p>
        <p>Your order has been placed successfully.</p>

        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
          ${itemsHTML}
        </table>

        <h3>Total: ₹${order.total}</h3>
        <p>Payment Method: ${order.paymentMethod}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

  } catch (error) {
    console.log("Email Error:", error);
    throw error;
  }
};

module.exports = sendOrderEmail; 

// require('dotenv').config();
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.Email_User,
//     pass: process.env.Email_Password,
//   },
// });


// const mailOptions = {
//     from: process.env.Email_User,
//     to: process.env.Email_User,
//     subject: 'Test Email from Shopsy',
//     text: 'This is a test email sent from the Shopsy application.',
// };


// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error('Error sending email:', error);
//     } else {
//     console.log('Email sent successfully:', info.response);
//     }
// });





