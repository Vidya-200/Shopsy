const Router = require("express").Router();


router.post("/send-email", async (req, res) => {
    const { email, subject, text } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.Email_User,
            to: email,
            subject: subject,
            text: text,
        });
        res.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

module.exports = router;