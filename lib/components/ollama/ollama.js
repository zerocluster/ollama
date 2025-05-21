import childProcess from "node:child_process";

export default class Whisper {
    #app;
    #config;
    #ollama;

    constructor ( app, config ) {
        this.#app = app;
        this.#config = config;
    }

    // properties
    get app () {
        return this.#app;
    }

    get config () {
        return this.#config;
    }

    // public
    async init () {
        return result( 200 );
    }

    async start () {

        // start ollama
        this.#ollama = childProcess.spawn( "ollama", [ "serve" ], {
            "env": {
                ...process.env,
                "OLLAMA_MODELS": this.app.env.dataDir + "/ollama/models",
            },
            "stdio": [ "ignore", "inherit", "inherit" ],
        } );

        this.#ollama.on( "exit", ( code, signal ) => process.destroy( { code } ) );

        return result( 200 );
    }

    async destroy () {
        this.#ollama?.kill();

        return result( 200 );
    }
}
