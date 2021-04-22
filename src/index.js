
const cp = require('child_process');
const chokidar = require('chokidar')

class NodeRun {
    exitProcess = false;
    nodeProcess;

    constructor() {
        if(process.argv.length !== 3){
            console.error( `Expected 2 arguments, but received ${process.argv.length - 1} arguments`);
        }else{
            this.init();
        }
    }

    init = async () => {
        await this.start();
        this.watchFiles();
    }

    start = () => {
        this.nodeProcess = cp.spawn('node', [process.argv[2]], {stdio:['pipe', process.stdout]})

        // process.stdin.pipe(this.nodeProcess.stdin)
        // used only when you want to take input for your file

        this.nodeProcess.on('close', () => {
            process.stdin.resume();
            this.print(`Process closed for ${process.argv[2]}`)
        })

        return this.nodeProcess;
    }

    watchFiles= () => {
        let timeout;
        chokidar.watch(process.argv[2], {ignored: '**/node_modules/*', ignoreInitial:true})
            .on('change', async (event, path) => {
                if(!timeout){
                    this.reload('file changed');
                    timeout = setTimeout(() => timeout = null, 1000)
                }
            })
    }

    reload = async (chngMsg) => {
        this.print(`${chngMsg} detected, restarting process..`);
        this.start();
    }


    print = (msg) => {
        return console.log(`[NODERUN] ${msg}`)
    }
}

exports.default = new NodeRun();