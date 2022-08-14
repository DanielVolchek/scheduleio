import { Schedule } from "./types";

export const setSchedule = (schedule: Schedule) => {
	for (const c of Object.keys(schedule)) {
		console.log("title is:", c);
	}
};
