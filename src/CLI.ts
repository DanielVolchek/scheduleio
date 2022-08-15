// todo
// clean up code add comments add variable names put everything in better relative positions
// todo
// add string validation for sid length auth length phone number length (? not sure how bcs of area codes)

// types imports
import {
	FileTypes,
	Time,
	Credentials,
	ModularResponse,
	Schedule,
} from "./types";

// enum for modular loading
import fs from "fs";
import { exit } from "process";
import path from "path";

const prompt = require("prompt-sync")({ sigint: true });

// twilio credentials

// check existence of previous file of name
// if file exists attempt to load and process it
// Loads or sets file based on enum type
const setModifiers = (
	FileType: FileTypes
): {
	FILE_NAME: string;
	typeName: string;
} => {
	let temp = { FILE_NAME: "", typeName: "" };
	if (FileType === FileTypes.TwilioCreds) {
		temp.FILE_NAME = "creds.json";
		temp.typeName = "credentials";
	} else if (FileType === FileTypes.Schedule) {
		temp.FILE_NAME = selectScheduleFile(FileType);
		temp.typeName = "schedule";
	}
	return temp;
};

const getFileOfType = (FileType: FileTypes) => {
	// modular params
	const { FILE_NAME, typeName } = setModifiers(FileType);
	let fileObj;

	console.log("Setting " + typeName + "...");
	// returns null if previous file not found
	fileObj = checkForPreviousFile(FileType, FILE_NAME);

	if (fileObj) {
		// if user opts to load default files
		if (getValidResponse(typeName)) {
			return fileObj;
		}
	} else {
		console.log("No previous " + typeName + "found");
	}

	fileObj = setFromUserInput(FileType);
	return writeFile(FileType, FILE_NAME, fileObj);
};

const getFullPath = (FileType: FileTypes, FILE_NAME: string) => {
	let add = "";
	if (FileType === FileTypes.Schedule) {
		add = "schedules";
	}
	return path.join(__dirname, "..", add, FILE_NAME);
};
// read file and return modular type
const selectScheduleFile = (FileType: FileTypes) => {
	const schedules_path = getFullPath(FileType, "");
	if (
		fs.existsSync(schedules_path) &&
		fs.lstatSync(schedules_path).isDirectory()
	) {
		return chooseScheduleFile(schedules_path);
	} else {
		fs.mkdirSync(schedules_path);
		return "default.json";
	}
};
const checkForPreviousFile = (
	FileType: FileTypes,
	file_name: string
): ModularResponse => {
	// if file exist
	// todo think about how to pass directory path in a clean manner
	// as is we are not getting the right path name because we are not checking directory schedules
	// maybe check datatype, maybe send full path instead of file_name and modify in calling function
	if (fs.existsSync(getFullPath(FileType, file_name))) {
		return processFile(FileType, file_name);
	}
	// else
	return null;
};

const chooseScheduleFile = (schedule_path: string): string => {
	const fileNameValid = (file_name: string) => {
		// todo
		return true;
	};

	let dir_contents;
	try {
		dir_contents = fs.readdirSync(schedule_path);
	} catch (err: any) {
		console.log("Could not read directory " + schedule_path);
		console.log("Exiting");
		exit(1);
	}
	let chosenFile;
	let success = false;
	console.log("Choose schedule to load: ");
	while (!success) {
		dir_contents.forEach((file: string, index: number) => {
			console.log(`${index + 1}: ${file}`);
		});
		console.log(dir_contents.length + 1 + ": New File");
		chosenFile = prompt("File (1-" + (dir_contents.length + 1) + "):");
		const num = parseInt(chosenFile);
		if (!isNaN(num)) {
			if (num > 0 && num < dir_contents.length + 1) {
				return dir_contents[num - 1];
			} else if (num === dir_contents.length + 1) {
				let newFileName = prompt("Enter new file name: ");
				while (!fileNameValid(newFileName)) {
					newFileName = prompt("Enter valid file name: ");
				}
				if (newFileName.slice(".json".length) !== ".json") {
					newFileName += ".json";
				}
				return newFileName;
			}
		}
	}
	return "";
};

// modular file io
// check if user wants to load or modify their given file
const getValidResponse = (modifier: string) => {
	const responseValid = (response: string | null) => {
		return (
			response === "l" ||
			response === "load" ||
			response === "m" ||
			response === "modify"
		);
	};
	console.log(
		"Found previous " + modifier + "! Would you like to load or modify? "
	);
	let response: string | null = "";
	do {
		response = prompt("Enter l(oad)/m(odify): ");
		if (response === "l" || response === "load") {
			return true;
		}
	} while (!responseValid(response));
	return false;
};

// wrapper to get objects containing user input of specific type
const setFromUserInput = (FileType: FileTypes): ModularResponse => {
	if (FileType === FileTypes.TwilioCreds) {
		return setTwilioCredentials();
	} else if (FileType === FileTypes.Schedule) {
		return setSchedule();
	} else {
		return null;
	}
};

const processFile = (
	FileType: FileTypes,
	file_name: string
): ModularResponse => {
	try {
		return JSON.parse(
			fs.readFileSync(getFullPath(FileType, file_name), "utf-8")
		);
	} catch (error: any) {
		console.log("An exception occured while loading file " + file_name);
		console.log(error);
		console.log("Please fix file permissions or delete file to regenerate");
		exit(1);
	}
};

// write file to system and return modular type
const writeFile = (
	FileType: FileTypes,
	file_name: string,
	data: ModularResponse
): ModularResponse => {
	try {
		fs.writeFileSync(
			getFullPath(FileType, file_name),
			JSON.stringify(data),
			"utf-8"
		);
		return data;
	} catch (error: any) {
		console.log("An exception occured while writing file " + file_name);
		console.log(error);
		console.log("Please fix file permissions or delete file to regenerate");
		exit(1);
	}
};

// user input for credentials
const setTwilioCredentials = (): Credentials => {
	const SID = prompt("Enter Twilio SID: ");
	const AUTH = prompt("Enter Twilio AUTH: ");
	const PHONE_NUM = prompt("Enter Twilio Phone Number: ");

	return { SID, AUTH, PHONE_NUM };
};

// user input for schedule
const setSchedule = (): Schedule => {
	// todo modify current schedule
	let continueAddingEntries: string | null = "";
	console.log("setting schedule");
	const schedule: Schedule = {};
	do {
		let title: string = prompt("Enter Title of Task: ");
		while (title === "") {
			title = prompt("Enter Title of Task: ");
		}
		let body: string = prompt("Enter Title of Task: ");
		while (body === "") {
			body = prompt("Enter Title of Task: ");
		}
		console.log("Enter time: ");
		let time: number = getTimeInMs();
		schedule[title] = { time, body };
		continueAddingEntries = prompt("continue entering tasks (y/n): ");
		while (continueAddingEntries !== "n" && continueAddingEntries !== "y") {
			continueAddingEntries = prompt("Enter y(es) or n(o) to continue: ");
		}
	} while (continueAddingEntries !== "n");
	return schedule;
};

const getTimeInMs = () => {
	const SECOND = 1000;
	const MINUTE = SECOND * 60;
	const HOUR = MINUTE * 60;

	let total = 0;
	let time: Time = {};
	while (
		time.hours == undefined ||
		time.minutes == undefined ||
		time.seconds == undefined
	) {
		let modifier = "";
		if (time.hours == undefined) {
			modifier = "hours";
		} else if (time.minutes == undefined) {
			modifier = "minutes";
		} else if (time.seconds == undefined) {
			modifier = "seconds";
		}
		let tempIn = prompt("Enter " + modifier + ": ");
		let tempNum = Math.floor(parseInt(tempIn));
		if (isNaN(tempNum) || tempNum < 0) {
			console.log("Caught exception in your input");
			console.log(
				"To set " + modifier + " please enter any nonnegative number"
			);
			continue;
		}
		time[modifier] = tempNum;
	}
	console.log(time);
	total = time.hours * HOUR + time.minutes * MINUTE + time.seconds * SECOND;
	return total;
};

// exported cli starter
export const startCLI = () => {
	console.log("Hey there! Welcome to Schedule.io");
	const credentials = getFileOfType(FileTypes.TwilioCreds) as Credentials;
	const schedule = getFileOfType(FileTypes.Schedule) as Schedule;

	return { credentials, schedule };
};
