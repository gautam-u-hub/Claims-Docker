const nodemailer = require("nodemailer");

const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.ETHEREALEMAIL,
            pass: process.env.ETHEREALPASSWORD
        }
    })

    const mailOptions = {
        from: "gautam@gmail.com",
        to: options.email,
        subject: options.subject,
        text:options.message,
    }


    await transporter.sendMail(mailOptions);


}


module.exports = sendEmail;


