const process = require("node:process");
const memoryjs = require("memoryjs");

module.exports = class Functions {
    async findProcess(processName, processes) {
        for (let i = 0; i < processes.length; i++) {
            if (processes[i].szExeFile == processName) {
                return processes[i].th32ProcessID;
            }
        }

        return null;
    }

    async findToken(processObject) {
        let addr = 0;

        const firstCheck = new RegExp(/[a-zA-Z0-9]{24}\.[a-zA-Z0-9-_]{6}\.[a-zA-Z0-9-_]{38}/g);
        const secondCheck = new RegExp(/[a-zA-Z0-9]{26}\.[a-zA-Z0-9-_]{6}\.[a-zA-Z0-9-_]{38}/g);
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                const query = memoryjs.virtualQueryEx(processObject.handle, addr);
                const string = memoryjs.readBuffer(processObject.handle, addr, query.RegionSize).toString();

                const fToken = firstCheck.exec(string);
                const sToken = secondCheck.exec(string);
        
                if (fToken) {
                    return fToken[0];    
                } else if (sToken) {
                    return sToken[0];
                }
        
                addr = query.BaseAddress + query.RegionSize;
            } catch (err) {
                return process.exit();
            }
        }
    }
}