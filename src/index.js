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

class Noderun {

    exitProcess = false;
    startProcess = null;

    constructor(){
        if(process.argv.length !== 3){
            console.error( `Expected 2 arguments, but received ${process.argv.length - 1} arguments`);
        }else{
            this.init();
        }
    }

    init = async () => {
        this.startProcess = await this.start();
        // this.watchForReload();
    }

    start = () => {
        this.startProcess = cp.spawn('node', [process.argv[2]], {stdio:['pipe', process.stdout]})
        // start process for writing commands 'node file.js' as a C.l
        this.print('process running...')
        this.exitProcess = false;
        // since the pipe in simple terms take data and return data, this will make the process
        // create a listener (manually by us//kind of) that will wait for an input from console
        // and show to child process, which handles the 'node file' which as well takes in that input..
        // meaning the child process is expecting to take in another input.
        process.stdin.pipe(this.startProcess.stdin)
        // Good to pipe in data from the console(General Process) to that process we created i.e
        // "node filename.js" it could be me taking in data from prompt to affect that file, 
        // so that a user must atleast write to the console before it exits, 
        // like "what's your name" and input "harrison"
        // which is good as a user can also write ctrl+c to break without complications,
        // coz that also writes from console to the process we created, meaning we are stopping that,
        // and also it will stop the general process.

        process.stdin.on('close', () => {
            process.stdin.unpipe(this.startProcess.stdin)
            // process.stdin.resume() //?????
            // answer: This part "resume" is immportant because at some point we will call a 
            // reload function, and that reload function show rather just continue with the 
            // process "the terminal" and all that, and still even if we dont call the reload,
            // the resume doesn't affect it.
        })
        // This listens when we manually stop the process, by
        // Ctrl+c, when we do that, we pop back to how things were like default.
        // Not necessary for the function, but it is important.
        // and also this will get triggered when all child processes gets closed.
        // which will be startProcess in this case.

        this.startProcess.on('error', (err) => {
            this.print(`failed to start process for ${process.argv[2]}`);
            this.exitProcess = true;
        })

        this.startProcess.on('close', () => {
            this.exitProcess = true;
            this.print(`process has closed for ${process.argv[2]}`);
        })
        // This process closes because my file is complete, or my program rather
        // from the filename.js is complete.
        // Also once this process closes which it will as file/program ends,
        // our main process will exit as well, coz there was never a main process
        // without the child process, so once the child process closes as that is the only "process"
        // it ends.

        return this.startProcess
    }

    watchForReload = () => {
        chokidar.watch(process.argv[2], {ignored: '**/node_modules/*', ignoredInitial: true})
            .on('change', async (event, path) => {
            await this.reload('file changed');
        })
    }

    reload = async (chngMsg) => {
        this.print(`${chngMsg} detected, restarting process..`);
        // await this.stopProcess();
        this.startProcess = this.start();
        console.log(this.exitProcess)
    }

    stopProcess = async () => {
        if (this.exitProcess == 'true') return true;
        return new Promise((resolve, reject) => {
            this.start.kill()
            const key = setInterval(() => {
                if(this.exitPromise){
                    clearInterval(key);
                    resolve(true);
                }
            }, 500)
        })
    }

    print = (msg) => {
        console.log(`[NODERUN] ${msg}`)
    }
}


exports.default = new Noderun();