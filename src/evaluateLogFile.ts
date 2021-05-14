import { deviceType } from "./types";
import { getRating } from "./Utils";


export function evaluateLogFile(logContentsStr:string) {
    
    const logContents = logContentsStr.split("\n");

    const firstLine = logContents[0].split(" ");
    let sample = [];
    let currentDevice:deviceType|undefined;
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
            currentDevice = currentRow[0] as deviceType;
        }
        else{
            sample.push(currentRow[currentRow.length-1]);
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
