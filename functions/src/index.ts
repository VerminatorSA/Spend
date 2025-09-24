
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as nodemailer from "nodemailer";

const GMAIL_USER = defineSecret("GMAIL_USER");
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD");

export const sendEmail = onCall(
  {
    region: "us-central1",
    secrets: [GMAIL_USER, GMAIL_APP_PASSWORD],
  },
  async (req) => {
    const data = req.data || {};
    const to = data.to;
    const subject = data.subject;
    const text = data.text;
    const from = GMAIL_USER.value();
    const replyTo = from;

    if (!to || !subject || !text) {
      throw new HttpsError(
        "invalid-argument",
        "to, subject, and text are required."
      );
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: GMAIL_USER.value(),
          pass: GMAIL_APP_PASSWORD.value(),
        },
      });

      await transporter.sendMail({
        to,
        from,
        replyTo,
        subject,
        text,
      });

      logger.info("Email sent", {to, subject, from});
      return {ok: true};
    } catch (e: unknown) {
      const message =
        e && typeof e === "object" && "message" in e ?
          String((e as {message: unknown}).message) :
          "unknown";
      logger.error("Email send failed", {message});
      throw new HttpsError("internal", "Failed to send email.");
    }
  }
);
