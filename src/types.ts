// type defs

export type Credentials = {
	SID: string | undefined;
	AUTH: string | undefined;
	PHONE_NUM: string | undefined;
};

// schedule entries
export type ScheduleEntry = {
	time: number;
	body?: string;
	type?: string;
};
export type Schedule = {
	[title: string]: ScheduleEntry;
};

// typed function returns of modular loading
export type ModularResponse = Credentials | Schedule | null;

export type Time = {
	[key: string]: number | undefined;
	["hours"]?: number;
	["minutes"]?: number;
	["seconds"]?: number;
};

export enum FileTypes {
	TwilioCreds,
	Schedule,
}
