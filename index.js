import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import { createInterface } from 'readline';
import cfonts from 'cfonts';
import yargs from 'yargs';
import chalk from 'chalk'; 

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, version } = require(join(__dirname, './package.json'));
const rl = createInterface(process.stdin, process.stdout);

const log = {
  info: (msg) => console.log(`${chalk.cyan('<b>[INFO]</b>')} ${chalk.white(msg)}`),
  success: (msg) => console.log(`${chalk.green('<b>[READY]</b>')} ${chalk.bold(msg)}`),
  error: (msg) => console.log(`${chalk.red('<b>[ERROR]</b>')} ${chalk.redBright(msg)}`),
  system: (msg) => console.log(`${chalk.magenta('<b>[SYSTEM]</b>')} ${chalk.grey(msg)}`)
};

const displayBanner = () => {
  console.clear();
  cfonts.say('AXTRAL|WIZARD', {
    font: 'slick',
    align: 'left',
    gradient: ['blue', 'cyan', 'blue'],
    transitionGradient: true,
  });
  console.log(chalk.gray(`» System: ${name} | Release: v${version}`));
  console.log(chalk.gray(`» Kernel: Node ${process.version}\n`));
  console.log(chalk.yellow('—'.repeat(40)));
};

let isRunning = false;

async function boot(script) {
  if (isRunning) return;
  isRunning = true;

  const scriptPath = join(__dirname, script);
  const args = [scriptPath, ...process.argv.slice(2)];

  log.system(`Initializing process: ${script}`);
  
  setupMaster({
    exec: scriptPath,
    args: process.argv.slice(2),
  });

  let pInstance = fork();

  pInstance.on('message', (data) => {
    const timestamp = new Date().toLocaleTimeString();
    log.info(`Signal received [${timestamp}] -> ${JSON.stringify(data)}`);
    
    if (data === 'reset') {
      log.system('Rebooting sub-process...');
      pInstance.kill();
      isRunning = false;
      boot(script);
    }
  });

  pInstance.on('exit', (code) => {
    isRunning = false;
    log.error(`Process terminated with exit code: ${code}`);

    if (code !== 0) {
      log.system('Watchdog active: monitoring file changes for auto-restart...');
      watchFile(scriptPath, () => {
        unwatchFile(scriptPath);
        log.success('Source changed. Hot-reloading...');
        boot(script);
      });
    }
  });

  if (!yargs(process.argv.slice(2)).parse().test) {
    rl.removeAllListeners('line');
    rl.on('line', (line) => {
      pInstance.send(line.trim());
    });
  }
}

displayBanner();
boot('main.js');