function getSD(sample:string[], mean:number){
    let totalDelta = 0 
    for(let i = 0; i < sample.length; i++){
        const deltaSq = (parseFloat(sample[i]) - mean)**2;
        totalDelta += deltaSq;
    }
    return Math.sqrt(totalDelta/sample.length);


}


function getRating(device:string, sample:string[], referenceData:string[]):string|undefined {
    

    if(device === "thermometer"){
        const sampleSum = sample.reduce((a, b) => a +parseFloat(b), 0);
        const mean = sampleSum/sample.length; 
        const stdDev = getSD(sample, mean);
        if (Math.abs(mean-parseFloat(referenceData[0])) <=0.5 ){
            if(stdDev < 3){
                return "ultra precise"
            }
            else if(stdDev < 5){
                return "very precise"
            }
        }
        return "precise";
    }

    if(device === "humidity"){
        const referenceHumidity = parseFloat(referenceData[1]);
        const lowerBound = referenceHumidity - 0.01 * referenceHumidity;
        const upperBound = referenceHumidity + 0.01 * referenceHumidity;
        for(let i = 0; i < sample.length; i++){
            const reading = parseFloat(sample[i])
            if(reading > upperBound || reading < lowerBound){
                return "discard";
            }
        }
        return "keep";
    }

    if(device === "monoxide"){
        const referenceMonoxide = parseFloat(referenceData[2]);
        const lowerBound = referenceMonoxide - 3;
        const upperBound = referenceMonoxide + 3;
        for(let i = 0; i < sample.length; i++){
            const reading = parseFloat(sample[i])
            if(reading > upperBound || reading < lowerBound){
                return "discard";
            }
        }
        return "keep";
        
    }

}


export function evaluateLogFile(logContentsStr:string) {
    
    const logContents = logContentsStr.split("\n");

    const firstLine = logContents[0].split(" ");
    let runningSum:number = 0;
    let count:number = 0;
    let sample = [];
    let currentDevice:string|undefined;
    let currentDeviceName:string|undefined;

    const map = new Map<string, string>();

    const devices = new Set(["thermometer", "humidity", "monoxide"]);

    const referenceData = firstLine.slice(1, firstLine.length); 

    for (let i = 1; i < logContents.length; i++){
        const currentRow = logContents[i].split(" ");

        if (devices.has(currentRow[0])){
            if(currentDevice && currentDeviceName){
                const rating = getRating(currentDevice, sample,  referenceData);
                if(rating){
                     map.set(currentDeviceName, rating); 
                }
               
            }
            sample = [];
            currentDeviceName = currentRow[1];
            currentDevice = currentRow[0];
            count = 0;
            runningSum = 0 ; 
        }
        else{
            sample.push(currentRow[currentRow.length-1]);
            runningSum += parseFloat(currentRow[currentRow.length - 1]);
            count++; 
        }

    }
    if(currentDevice && currentDeviceName){
        const rating = getRating(currentDevice, sample, referenceData);
        if(rating){
            map.set(currentDeviceName, rating); 
        }
       
    }
    let result: Record<string, string> = {};
    map.forEach((value, key)=>result[key]=value);
    return result;
}


evaluateLogFile("reference 70.0 45.0 6\nthermometer temp-1\n2007-04-05T22:00 72.4\n2007-04-05T22:01 76.0\n2007-04-05T22:02 79.1\n2007-04-05T22:03 75.6\n2007-04-05T22:04 71.2\n2007-04-05T22:05 71.4\n2007-04-05T22:06 69.2\n2007-04-05T22:07 65.2\n2007-04-05T22:08 62.8\n2007-04-05T22:09 61.4\n2007-04-05T22:10 64.0\n2007-04-05T22:11 67.5\n2007-04-05T22:12 69.4\nthermometer temp-2\n2007-04-05T22:01 69.5\n2007-04-05T22:02 70.1\n2007-04-05T22:03 71.3\n2007-04-05T22:04 71.5\n2007-04-05T22:05 69.8\nhumidity hum-1\n2007-04-05T22:04 45.2\n2007-04-05T22:05 45.3\n2007-04-05T22:06 45.1\nhumidity hum-2\n2007-04-05T22:04 44.4\n2007-04-05T22:05 43.9\n2007-04-05T22:06 44.9\n2007-04-05T22:07 43.8\n2007-04-05T22:08 42.1\nmonoxide mon-1\n2007-04-05T22:04 5\n2007-04-05T22:05 7\n2007-04-05T22:06 9\nmonoxide mon-2\n2007-04-05T22:04 2\n2007-04-05T22:05 4\n2007-04-05T22:06 10\n2007-04-05T22:07 8\n2007-04-05T22:08 6")