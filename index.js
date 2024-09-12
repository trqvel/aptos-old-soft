// const fs = require('fs').promises;
const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');

const {
  threads_counter: threadCount_
} = require("./config").General;


// const loadFile = async (fileName) => {
//   const fileContent = await fs.readFile(path.join(__dirname, fileName), 'utf-8');
//   return fileContent.split('\n').filter(line => line.trim() !== '');
// };

const loadArgentWallets = async () => {
  try {
    const mmKeys = fs.readFileSync(`./data/mm_keys.txt`, "utf8")
        .split("\n")
        .map(row => row.trim())
        .filter(row => row !== "");

    const pontemKeys = fs.readFileSync(`./data/aptos_keys.txt`, "utf-8")
        .split("\n")
        .map(row => row.trim())
        .filter(row => row !== "");

    const okecx = fs.readFileSync(`./data/okx_addresses.txt`, "utf-8")
        .split("\n")
        .map(row => row.trim())
        .filter(row => row !== "");

    return { mmKeys, pontemKeys, okecx };
  } catch (err) {
    console.error(`Error while loading wallet data: ${err.message}`);
    throw err;
  }
};
function createWorker(mmKey, pontemKey, okecx, addressIndex) {
  return new Promise((resolve, reject) => {

    const worker = new Worker('./utils/workers.js', {
      workerData: { mmKey, pontemKey, okecx, addressIndex }
      
    });
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

const main = async () => {
  let addressIndex = 0;
  const values = await loadArgentWallets()
  const mmKeys = values.mmKeys
  const pontemKeys = values.pontemKeys
  const okecx = values.okecx
  const threadCount = threadCount_
  
  const groups = [];
  for (let i = 0; i < mmKeys.length; i += threadCount) {
    groups.push(mmKeys.slice(i, i + threadCount));
  }

  for (const group of groups) {
    const promises = [];
    
    for (const mmKey of group) {
      const pontemKey = pontemKeys.shift();
      const okecxKey = okecx.shift();
      promises.push(createWorker(mmKey, pontemKey, okecxKey, addressIndex));

      addressIndex++;
    }
    try {
      await Promise.all(promises);
      // process.exit(0);
    } catch (error) {
      console.error("Ошибка в главной функции:", error);
    }
    
    
    process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled Rejection at:', promise, 'reason:', reason);

      });
  }
};

main().catch(console.error);