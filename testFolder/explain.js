// const chokidar = require('chokidar');
// const cp = require('child_process');
// const treeKill = require('tree-kill');

// class Noderun {

//     exitProcess = false;
//     startProcess = null;

//     constructor(){
//         if(process.argv.length !== 3){
//             console.error( `Expected 2 arguments, but received ${process.argv.length - 1} arguments`);
//         }else{
//             this.init();
//         }
//     }

//     init = async () => {
//         this.startProcess = await this.start();
//         // this.watchForReload();
//     }

//     start = () => {
//         this.startProcess = cp.spawn('node', [process.argv[2]], {stdio:['pipe', process.stdout]})
//         // start process for writing commands 'node file.js' as a C.l
//         this.print('process running...')
//         this.exitProcess = false;
//         // since the pipe in simple terms take data and return data, this will make the process
//         // create a listener (manually by us//kind of) that will wait for an input from console
//         // and show to child process, which handles the 'node file' which as well takes in that input..
//         // meaning the child process is expecting to take in another input.
//         process.stdin.pipe(this.startProcess.stdin)
//         // Good to pipe in data from the console(General Process) to that process we created i.e
//         // "node filename.js" it could be me taking in data from prompt to affect that file, 
//         // so that a user must atleast write to the console before it exits, 
//         // like "what's your name" and input "harrison"
//         // which is good as a user can also write ctrl+c to break without complications,
//         // coz that also writes from console to the process we created, meaning we are stopping that,
//         // and also it will stop the general process.

//         // This listens when we manually stop the process, by
//         // Ctrl+c, when we do that, we pop back to how things were like default.
//         // Not necessary for the function, but it is important.
//         // and also this will get triggered when all child processes gets closed.
//         // which will be startProcess in this case.

//         this.startProcess.on('error', (err) => {
//             this.print(`failed to start process for ${process.argv[2]}`);
//             this.exitProcess = true;
//         })

//         this.startProcess.on('close', () => {
//             this.exitProcess = true;
//             // process.stdin.unpipe(this.startProcess.stdin)
//             // process.stdin.resume() //?????
//             this.print(`process has closed for ${process.argv[2]}`);
//         })
//         // This process closes because my file is complete, or my program rather
//         // from the filename.js is complete.
//         // Also once this process closes which it will as file/program ends,
//         // our main process will exit as well, coz there was never a main process
//         // without the child process, so once the child process closes as that is the only "process"
//         // it ends.

//         process.stdin.on('close', () => {
//             process.stdin.unpipe(this.startProcess.stdin)
//             // process.stdin.resume() //?????
//             // answer: This part "resume" is immportant because at some point we will call a 
//             // reload function, and that reload function show rather just continue with the 
//             // process "the terminal" and all that, and still even if we dont call the reload,
//             // the resume doesn't affect it.
//             // and moreover the moment we run "nodemon filename.js", we create this process.
//             // and this process ends when no other child process and others are done.s
//         })

//         return this.startProcess
//     }

//     watchForReload = () => {
//         chokidar.watch(process.argv[2], {ignored: '**/node_modules/*', ignoredInitial: true})
//             .on('change', async (event, path) => {
//             // await this.reload('file changed');
//             await this.start();
//         })
//     }

//     // reload = async (chngMsg) => {
//     //     this.print(`${chngMsg} detected, restarting process..`);
//     //     await this.stopProcess();
//     //     this.startProcess = this.start();
//     //     // return startProcess;
//     // }

//     // stopProcess = async () => {
//     //     if (this.exitProcess == 'true') return true;
//     //     return new Promise((resolve, reject) => {
//     //         treeKill(this.startProcess.pid, "SIGTERM", (err) => {
//     //             if(err) treeKill(this.startProcess.pid, "SIGKILL", () => {})
//     //         })
//     //         const key = setInterval(() => {
//     //             if(this.exitPromise){
//     //                 clearInterval(key);
//     //                 resolve(true);
//     //             }
//     //         }, 500)
//     //     })
//     // }

//     print = (msg) => {
//         return console.log(`[NODERUN] ${msg}`)
//     }
// }


// exports.default = new Noderun();