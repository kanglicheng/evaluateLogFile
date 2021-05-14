import { deviceType } from "./types";


// uncorrected sample standard deviation formula 
function getSD(sample:number[], mean:number){
    let totalDelta = 0 
    for(let i = 0; i < sample.length; i++){
        const deltaSq = (sample[i] - mean)**2;
        totalDelta += deltaSq;
    }
    return Math.sqrt(totalDelta/sample.length);

}

function getMean(readings:number[]){
    
    const readingsSum = readings.reduce((a, b) => a +b, 0);
    return readingsSum/readings.length;
}

const getThermometerLabel = (sample:number[], referenceData:string[]):string =>{
    const mean = getMean(sample);
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

const getHumidityLabel = (sample:number[], referenceData:string[]): string =>{
    const referenceHumidity = parseFloat(referenceData[1]);
        const lowerBound = referenceHumidity - 0.01 * referenceHumidity;
        const upperBound = referenceHumidity + 0.01 * referenceHumidity;
        for(let i = 0; i < sample.length; i++){
            const reading = sample[i]
            if(reading > upperBound || reading < lowerBound){
                return "discard";
            }
        }
        return "keep";
}

const getMonoxideLabel = (sample:number[], referenceData:string[]):string =>{
    const referenceMonoxide = parseFloat(referenceData[2]);
    const lowerBound = referenceMonoxide - 3;
    const upperBound = referenceMonoxide + 3;
    for(let i = 0; i < sample.length; i++){
        const reading = sample[i]
        if(reading > upperBound || reading < lowerBound){
            return "discard";
        }
    }
    return "keep";
}


const deviceCheckers:Record<deviceType, (a: number[], b: string[])=>string> = {
        "thermometer":getThermometerLabel, 
        "humidity": getHumidityLabel, 
        "monoxide": getMonoxideLabel, 
}


export function getRating(deviceType:deviceType, sample:string[], referenceData:string[]):string|undefined {
    
    const numberSample:number[] = sample.map((reading)=>{
        return parseFloat(reading)
    })

    const deviceLabeler = deviceCheckers[deviceType];

    return deviceLabeler(numberSample, referenceData);

}
