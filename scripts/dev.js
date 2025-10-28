const { spawn } = require('child_process');
const net = require('net');

const VITE_PORT = 5173;
const MAX_RETRIES = 30;

function checkPort(port, retries = 0) {
  return new Promise((resolve) => {
    const client = net.connect({ port }, () => {
      client.end();
      resolve(true);
    });

    client.on('error', () => {
      if (retries < MAX_RETRIES) {
        setTimeout(() => {
          resolve(checkPort(port, retries + 1));
        }, 1000);
      } else {
        resolve(false);
      }
    });
  });
}

async function startDev() {
  console.log('🚀 Starting Yaami development server...\n');

  // Start Vite
  console.log('📦 Starting Vite dev server...');
  const vite = spawn('npm', ['run', 'dev:renderer'], {
    stdio: 'inherit',
    shell: true
  });

  // Wait for Vite to be ready
  console.log('⏳ Waiting for Vite to start...');
  const isViteReady = await checkPort(VITE_PORT);

  if (isViteReady) {
    console.log('✅ Vite is ready!\n');
    console.log('🔌 Starting Electron...\n');

    // Start Electron
    const electron = spawn('npm', ['run', 'dev:electron'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    });

    // Handle cleanup
    process.on('SIGINT', () => {
      console.log('\n\n👋 Shutting down...');
      vite.kill();
      electron.kill();
      process.exit(0);
    });

    electron.on('exit', () => {
      vite.kill();
      process.exit(0);
    });
  } else {
    console.error('❌ Vite failed to start');
    vite.kill();
    process.exit(1);
  }
}

startDev();
