
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
    const html = data.html;
    
    // The 'from' address should always be the authenticated GMAIL_USER
    const from = GMAIL_USER.value();
    // The 'replyTo' can be the person sending the invite, if available.
    const replyTo = req.auth.token.email || GMAIL_USER.value();

    if (!to || !subject || (!text && !html)) {
      throw new HttpsError(
        "invalid-argument",
        "to, subject, and text or html are required."
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
        html,
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
