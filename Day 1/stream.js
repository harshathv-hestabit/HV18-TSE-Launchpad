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

function readFileStream(filePath) {
  const start = performance.now();
  const memoryBefore = process.memoryUsage().heapUsed;

  let totalBytesRead = 0;
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  stream.on('data', (chunk) => {
    totalBytesRead += chunk.length;
  });

  stream.on('end', () => {
    const end = performance.now();
    const memoryAfter = process.memoryUsage().heapUsed;
    const timeTaken = end - start;
    const memoryUsed = (memoryAfter - memoryBefore) / 1024 / 1024;

    console.log(`Stream read: ${timeTaken.toFixed(3)}ms`);
    console.log(`Memory used: ${memoryUsed.toFixed(3)}MB`);

    const performanceData = {
      method: 'fs.createReadStream (Stream)',
      timeTaken: timeTaken.toFixed(3),
      memoryUsed: memoryUsed.toFixed(3),
      timestamp: new Date().toISOString()
    };
    logPerformanceResults(performanceData);
  });

  stream.on('error', (err) => {
    console.error('Error reading file with Stream:', err);
  });
}

filePath = path.join(__dirname,'50mbfile.txt');

console.log('Benchmarking fs.createReadStream (Stream)...');
readFileStream(filePath);