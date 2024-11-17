import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to, // recipient
    from: "verify@cashquiver.com", // verified SendGrid sender
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("response body", error.response.body);
      console.error("response headers", error.response.headers);
      throw new Error(error.message);
    }
  }
};
