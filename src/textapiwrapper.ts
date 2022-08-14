import twilio from "twilio";
import { Credentials, ScheduleEntry } from "./types";
import { Schedule } from "./types";
// wrapper to use with whatever text messaging API you want

let messageClient;
const setMessageReminder = (schedule: Schedule, auth: Credentials) => {};

export const SendMessage = (body: string, auth: Credentials) => {
	const client: twilio.Twilio = require("twilio")(auth.SID, auth.AUTH);

	client.messages
		.create({
			// todo
			body: body,
			to: "+14253651444", // Text this number
			from: auth.PHONE_NUM, // From a valid Twilio number
		})
		.then((msg) => console.log(msg.sid))
		.catch((error: any) => {
			console.log("Error occurred: ");
			console.log(error);
		});
};
