const fs = require('fs');
const path = require('path');

function logPerformanceResults(data) {
  const logFilePath = path.join(__dirname, 'day 1-perf.json');
  let existingData = [];
  if (fs.existsSync(logFilePath)) {
    existingData = JSON.parse(fs.readFileSync(logFilePath, 'utf8'));
  }
  existingData.push(data);

  fs.writeFileSync(logFilePath, JSON.stringify(existingData, null, 2), 'utf8');
  console.log('Performance data logged');
}
function readFileBuffer(filePath) {
  const start = performance.now();
  const memoryBefore = process.memoryUsage().heapUsed;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file with Buffer:', err);
      return;
    }

    const end = performance.now();
    const memoryAfter = process.memoryUsage().heapUsed;
    const timeTaken = end - start;
    const memoryUsed = (memoryAfter - memoryBefore) / 1024 / 1024;

    console.log(`Buffer read: ${timeTaken.toFixed(3)}ms`);
    console.log(`Memory used: ${memoryUsed.toFixed(3)}MB`);
    const performanceData = {
      method: 'fs.readFile (Buffer)',
      timeTaken: timeTaken.toFixed(3),  // time format in ms
      memoryUsed: memoryUsed.toFixed(3), // memory format in mb
    };

    logPerformanceResults(performanceData);
  });
}
filePath = path.join(__dirname,'50mbfile.txt');
console.log('Benchmarking fs.readFile (Buffer)...');
readFileBuffer(filePath);