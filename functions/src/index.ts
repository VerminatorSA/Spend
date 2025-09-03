
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as nodemailer from "nodemailer";
import {setGlobalOptions} from "firebase-functions";

const GMAIL_USER = defineSecret("GMAIL_USER");
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD");

setGlobalOptions({ maxInstances: 10 });

export const sendEmail = onCall(
  {
    region: "us-central1",
    secrets: [GMAIL_USER, GMAIL_APP_PASSWORD],
  },
  async (req) => {
    if (!req.auth) {
      throw new HttpsError("unauthenticated", "Sign in required to send emails.");
    }

    const data = req.data || {};
    const to = data.to;
    const subject = data.subject;
    const text = data.text;
    
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
        from: GMAIL_USER.value(),
        to,
        subject,
        text,
      });

      logger.info("Email sent", {to, subject, from: GMAIL_USER.value()});
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
