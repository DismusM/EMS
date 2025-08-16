const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const WASM_URL = 'https://sql.js.org/dist/sql-wasm.wasm';
const WASM_PATH = path.join(process.cwd(), 'public', 'sql-wasm', 'sql-wasm.wasm');
const DB_DIR = path.join(process.cwd(), 'data');

async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

async function setup() {
  try {
    // Create public/sql-wasm directory if it doesn't exist
    await mkdir(path.dirname(WASM_PATH), { recursive: true });
    
    // Download the WebAssembly file if it doesn't exist
    if (!fs.existsSync(WASM_PATH)) {
      console.log('🌐 Downloading SQL.js WebAssembly file...');
      await downloadFile(WASM_URL, WASM_PATH);
      console.log('✅ SQL.js WebAssembly file downloaded');
    } else {
      console.log('✅ SQL.js WebAssembly file already exists');
    }

    // Create data directory if it doesn't exist
    await mkdir(DB_DIR, { recursive: true });
    console.log('✅ Database directory ready');

    console.log('\n✨ Setup completed successfully!');
    console.log(`- WebAssembly file: ${WASM_PATH}`);
    console.log(`- Database directory: ${DB_DIR}`);
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
}

// Run the setup
setup();
