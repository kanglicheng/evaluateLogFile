Prompt: Create a JavaScript library that exports the following function: evaluateLogFile(logContentsStr) { }. The parameter
logContentsStr will simply be the logfile contents read in from a text file.

Additional considerations: 1) Handling changes to log file format. Currently, the functions assume the log format to be consistent. To handle
different log formats, I'd implement a function that would re-format the given log into an agreed upon "standard log format" and pass that
re-formatted log to the evaluateLogFile function. To handle additional device types, I'd create a new file dedicated to holding all the
device labeler implementations and add the implementation as a <device, labelerFn> apir to the deviceCheckers map. Finally, to handle large log files,
the current approach will probably have memory problems. Reading the log file in chunks and then combining the result would be the most immediate solution 
but other methodologies to handling massive datasets should be considered. 

Commands: "npm test" will run the tests. 
