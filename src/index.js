#!/usr/bin/env node

// Essentials
// 1) Start Process
// 2) Check for file changes.
// 3) stop process
// 4) Reload process by starting process again

const cp = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

class NodeRun {
    constructor() {
        // console.log(process.argv)
        let exitProcess = false;

        const pathsToWatch = [
            path.join(process.cwd(), 'testfile.js'),
            path.join(process.cwd(), 'printfile.js')
        ]

        if(process.argv.length !== 3){
            console.error( `Expected 2 arguments, but received ${process.argv.length - 1} arguments`);
        }else{
            this.init();
        }
    }

    init = async () => {
        await this.start();
    }

    start = () => {
        const startProcess = cp.spawn('node', [process.argv[2]], {stdio:['pipe', process.stdout]})
        this.print('process running...')
        // start process for writing commands 'node file.js' as a C.l
        process.stdin.pipe(startProcess.stdin)
        // since the pipe in simple terms take data and return data, this will make the process
        // create a listener (manually by us//kind of) that will wait for an input from console
        // and show to child process, which handles the 'node file' which as well takes in that input..
        // meaning the child process is expecting to take in another input.
        process.on('error', (err) => {
            this.print(`failed to start process for ${process.argv[2]}`);
        })
        process.on('close', () => {
            this.print(`closing process for ${process.argv[2]}`);
            this.exitProcess = true;
        })
        process.on('exit', () => {
            this.print('process terminated, exiting process..')
            this.exitProcess = true;
        })
        return startProcess
    }

    print = (msg) => {
        console.log(`[NODERUN] ${msg}`)
    }

    stopProcess = () => {
        if(this.exitProcess == true) return true;
        return new Promise((resolve, reject) => {
            this.start().kill();
        })
    }

    watchForReload = () => {
        chokidar.watch(this.pathsToWatch, {ignored: "node_modules"})
            .on('all', async () => {
                await this.reload()
            })
    }

    reload = () => {
        return this.start()
    }
}



exports.default = new NodeRun();