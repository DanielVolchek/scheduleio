import { SendMessage } from "./textapiwrapper";
import { Credentials, Schedule, ScheduleEntry } from "./types";

let paused = false;
let onTask = 0;
export const setSchedule = (credentials: Credentials, schedule: Schedule) => {
	const keys = Object.keys(schedule);
	console.log("Starting schedule...");
	let task = schedule[keys[onTask]];
	console.log();
	let startTime = Date.now();
	const timeout = setInterval(() => {
		if (onTask === keys.length) {
			console.log("Full schedule completed");
			console.log("Thank you for using scheduleio");
			clearTimeout(timeout);
			return;
		}
		task.time = Math.max(task.time - 1000, 0);
		if (task.time === 0) {
			console.log(
				"finished task after",
				Math.round((Date.now() - startTime) / 1000),
				"s"
			);
			startTime = Date.now();
			onTask++;
			SendMessage(`${keys[onTask]}: ${task.body}`, credentials);
			task = schedule[keys[onTask]];
		}
	}, 1000);
};
