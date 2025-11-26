import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(formData: {
  antispam: string;
  name: string;
  email: string;
  company: string;
  satisfaction: number;
  message: string;
}) {
  const currentDate = new Date().toISOString();
  const current = currentDate.split("T")[0] + " " + currentDate.split("T")[1];
  const mailOptions = {
    from: process.env.SMTP_USER, // Your Gmail address
    to: process.env.RECEIVER_EMAIL, // The email address to receive the feedback
    subject: `User Feedback Form: ${formData.name} (${current})`, // Adding the date to the subject
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">New User Feedback Form Submission</h2>
          
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Company:</strong> ${formData.company}</p>
          <p><strong>Satisfaction:</strong> ${"★".repeat(
            formData.satisfaction
          )}${"☆".repeat(5 - formData.satisfaction)}</p>
          
          <h3>Message:</h3>
          <p>${formData.message || "No message provided."}</p>
          
          <hr style="border: 1px solid #ddd;">
          <p style="color: #888;">This feedback was submitted on ${new Date().toLocaleString()}.</p>
        </body>
      </html>
    `, // Send the form data in a styled HTML email body
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
