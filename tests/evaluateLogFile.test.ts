import { evaluateLogFile } from "../src/evaluateLogFile";

const sampleInput = "reference 70.0 45.0 6\nthermometer temp-1\n2007-04-05T22:00 72.4\n2007-04-05T22:01 76.0\n2007-04-05T22:02 79.1\n2007-04-05T22:03 75.6\n2007-04-05T22:04 71.2\n2007-04-05T22:05 71.4\n2007-04-05T22:06 69.2\n2007-04-05T22:07 65.2\n2007-04-05T22:08 62.8\n2007-04-05T22:09 61.4\n2007-04-05T22:10 64.0\n2007-04-05T22:11 67.5\n2007-04-05T22:12 69.4\nthermometer temp-2\n2007-04-05T22:01 69.5\n2007-04-05T22:02 70.1\n2007-04-05T22:03 71.3\n2007-04-05T22:04 71.5\n2007-04-05T22:05 69.8\nhumidity hum-1\n2007-04-05T22:04 45.2\n2007-04-05T22:05 45.3\n2007-04-05T22:06 45.1\nhumidity hum-2\n2007-04-05T22:04 44.4\n2007-04-05T22:05 43.9\n2007-04-05T22:06 44.9\n2007-04-05T22:07 43.8\n2007-04-05T22:08 42.1\nmonoxide mon-1\n2007-04-05T22:04 5\n2007-04-05T22:05 7\n2007-04-05T22:06 9\nmonoxide mon-2\n2007-04-05T22:04 2\n2007-04-05T22:05 4\n2007-04-05T22:06 10\n2007-04-05T22:07 8\n2007-04-05T22:08 6"

const sampleOutput = {
    'temp-1': 'precise',
    'temp-2': 'ultra precise',
    'hum-1': 'keep',
    'hum-2': 'discard',
    'mon-1': "keep",
    'mon-2': 'discard'
    }

describe('evaluateLogFile tests', ()=>{
    it("handles basic inputs", ()=>{
        const result = evaluateLogFile(sampleInput);
        expect(result).toEqual(sampleOutput);
    })
    
})