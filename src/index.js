// #!/usr/bin/env node

// // Essentials
// // 1) Start Process
// // 2) Check for file changes.
// // 3) stop process
// // 4) Reload process by starting process again

// const cp = require('child_process');
// const chokidar = require('chokidar');
// const path = require('path');

// class NodeRun {
//     constructor() {
//         // console.log(process.argv)
//         let exitProcess = false;
//         let startProcess;
//         const pathsToWatch = [
//             path.join(process.cwd(), "/**/*.js"),
//             path.join(process.cwd(), "/**/*.env"),
//             path.join(process.cwd(), "/**/*.json"),
//         ]

//         if(process.argv.length !== 3){
//             console.error( `Expected 2 arguments, but received ${process.argv.length - 1} arguments`);
//         }else{
//             this.init();
//         }
//     }

//     init = async () => {
//        this.startProcess = await this.start();
//        await this.watchForReload();
//     }

//     start = () => {
//         const startProcess = cp.spawn('node', [process.argv[2]], {stdio:['pipe', process.stdout]})
//         this.print('process running...')
//         // start process for writing commands 'node file.js' as a C.l
//         process.stdin.pipe(startProcess.stdin)
//         // since the pipe in simple terms take data and return data, this will make the process
//         // create a listener (manually by us//kind of) that will wait for an input from console
//         // and show to child process, which handles the 'node file' which as well takes in that input..
//         // meaning the child process is expecting to take in another input.
//         process.on('error', (err) => {
//             this.print(`failed to start process for ${process.argv[2]}`);
//         })
//         process.stdin.on('close', () => {
//             process.stdin.unpipe(startProcess.stdin)
//             process.stdin.resume();
//         })
//         startProcess.on('close', () => {
//             this.print(`closing process for ${process.argv[2]}`);
//             this.exitProcess = true;
//         })
//         return startProcess
//     }

//     print = (msg) => {
//         console.log(`[NODERUN] ${msg}`)
//     }

//     stopProcess = async () => {
//         if(this.exitProcess == true) return true;
//         return new Promise((resolve, reject) => {
//             this.startProcess.kill()
//             const key = setInterval(() => {
//                 if(this.exitPromise){
//                     clearInterval(key);
//                     resolve(true);
//                 }
//             }, 500)
//         })
//     }

//     watchForReload = () => {
//         chokidar.watch(this.pathsToWatch, 
//             {ignored: "**/node_modules/*", 
//             ignoreInitial:true}).on('all', async () => {
//                 await this.reload("file changed")
//             })
//     }

//     reload = async (chngMsg) => {
//         this.print(`${chngMsg} detected, restarting process..`);
//         await this.stopProcess();
//         this.startProcess = this.start();
//     }
// }



// exports.default = new NodeRun();

const cp = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

class Noderun {
    constructor(){

        const pathsToWatch = [
            path.join(process.cwd(), "/**/*.js"),
            path.join(process.cwd(), "/**/*.env"),
            path.join(process.cwd(), "/**/*.json"),
        ]

        if(process.argv.length !== 3){
            console.error( `Expected 2 arguments, but received ${process.argv.length - 1} arguments`);
        }else{
            this.init();
        }
    }

    init = async () => {
        this.start();
        this.watchForReload();
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
        // process.stdin.on('close', () => {
        //     process.stdin.unpipe(startProcess.stdin)
        //     process.stdin.resume();
        // })
        // startProcess.on('close', () => {
        //     this.print(`closing process for ${process.argv[2]}`);
        //     this.exitProcess = true;
        // })
        return startProcess
    }

    watchForReload = () => {
        // chokidar.FSWatch(this.pathsToWatch, 
        //     {ignored: "**/node_modules/*", 
        //     ignoreInitial:true}).on('all', () => {
        //         // await this.reload("file changed")
        //         console.log('file changed')
        //     })
        chokidar.watch('testFolder/testfile.js', {ignored: 'node_modules'})
            .on('change', async (event, path) => {
            console.log('chokidar change')
            await this.reload('file changed');
        })
    }

    reload = async (chngMsg) => {
        this.print(`${chngMsg} detected, restarting process..`);
        // await this.stopProcess();
        this.startProcess = this.start();
    }

    print = (msg) => {
        console.log(`[NODERUN] ${msg}`)
    }
}


exports.default = new Noderun();