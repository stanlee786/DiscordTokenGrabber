const memoryjs = require("memoryjs");
const chalk = require("chalk");

const processName = "Discord.exe";
const processes = memoryjs.getProcesses();

let procID = 0;
let found = false;

for (let i = 0; i < processes.length; i++) {
    if (processes[i].szExeFile == processName) {
        if (found == false) {
            console.log("succesfully found " + chalk.cyan(processes[i].szExeFile) + " with pID " + chalk.cyan(processes[i].th32ProcessID))
            procID = processes[i].th32ProcessID;
            found = true;
        };
    };
};

//Handle
console.log("getting process handle and base adres...");
const processObject = memoryjs.openProcess(procID);
console.log("succesfully retrieved handle " + chalk.cyan(processObject.handle) + " and base adres " + chalk.cyan(processObject.modBaseAddr));
