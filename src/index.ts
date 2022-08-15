import { startCLI } from "./CLI";
import { setSchedule } from "./scheduleactions";
import { SendMessage } from "./textapiwrapper";

const { credentials, schedule } = startCLI();

setSchedule(credentials, schedule);
// SendMessage("immediately", credentials);
// setTimeout(() => SendMessage("30 Seconds after running", credentials), 30000);
