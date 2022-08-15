import { startCLI } from "./CLI";
import { runSchedule } from "./scheduleactions";

const { credentials, schedule } = startCLI();
runSchedule(credentials, schedule);
// SendMessage("immediately", credentials);
// setTimeout(() => SendMessage("30 Seconds after running", credentials), 30000);
