const fs = require('fs');
const readline = require('readline');

function readFileInChunks(filePath, chunkSize = 1000) {
  return new Promise((resolve, reject) => {
    const stream = readline.createInterface({
      input: fs.createReadStream(filePath),
      output: process.stdout,
      terminal: false
    });

    let chunk = [];
    const chunks = [];

    stream.on('line', (line) => {
      chunk.push(...line.split(/\s+/));
      if (chunk.length >= chunkSize) {
        chunks.push(chunk);
        chunk = [];
      }
    });

    stream.on('close', () => {
      if (chunk.length > 0) {
        chunks.push(chunk);
      }
      resolve(chunks);
    });

    stream.on('error', reject);
  });
}
