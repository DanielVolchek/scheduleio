import { sendMessage } from "./textapiwrapper";
import { Credentials, Schedule, ScheduleEntry } from "./types";

export const runSchedule = async (
	credentials: Credentials,
	schedule: Schedule
) => {
	console.log();
	for (const [key, value] of Object.entries(schedule)) {
		console.log("Running task " + key);
		await new Promise((resolve) => setTimeout(resolve, value.time));
		await sendMessage(value.body, credentials)
			.then(() => console.log("sent message succesfully"))
			.catch((error) => {
				console.log("Failed to send message");
				console.error(error);
			});
		console.log("Finished task " + key);
		console.log();
	}
};

// let paused = false;
// let onTask = 0;
// export const setSchedule = (credentials: Credentials, schedule: Schedule) => {
// 	const keys = Object.keys(schedule);
// 	console.log("Starting schedule...");
// 	let task = schedule[keys[onTask]];
// 	console.log("Starting Task", keys[onTask]);
// 	let startTime = Date.now();
// 	const timeout = setInterval(() => {
// 		if (onTask === keys.length) {
// 			return;
// 		}
// 		task.time = Math.max(task.time - 1000, 0);
// 		if (task.time === 0) {
// 			console.log(
// 				"Finished Task",
// 				keys[onTask],
// 				"after",
// 				Math.round((Date.now() - startTime) / 1000),
// 				"s"
// 			);
// 			startTime = Date.now();
// 			SendMessage(`${keys[onTask]}: ${task.body}`, credentials);
// 			task = schedule[keys[onTask]];
// 			onTask++;
// 			if (onTask === keys.length) {
// 				console.log("Full schedule completed");
// 				console.log("Thank you for using scheduleio");
// 				clearTimeout(timeout);
// 				return;
// 			} else {
// 				console.log("Starting Task", keys[onTask]);
// 			}
// 		}
// 	}, 1000);
// };
