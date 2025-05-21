import childProcess from "node:child_process";
import fetch from "#core/fetch";

// DOCS: https://github.com/ollama/ollama/blob/main/docs/api.md

const MODELS = new Set( [

    //
    "qwen3:4b",
] );

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

    get models () {
        return MODELS;
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

        this.#ollama.once( "exit", this.#onExit.bind( this ) );

        return result( 200 );
    }

    async destroy () {
        if ( this.#ollama ) {
            return new Promise( resolve => {
                this.#ollama.once( "exit", code => {
                    resolve( result( 200 ) );
                } );

                this.#ollama.kill();
            } );
        }
        else {
            return result( 200 );
        }
    }

    async getVersion () {
        return this.#doRequest( "version" );
    }

    async getInstalledModels () {
        return this.#doRequest( "tags" );
    }

    async getLoadedModels () {
        return this.#doRequest( "ps" );
    }

    async getModelInfo ( model, { verbose } = {} ) {
        return this.#doRequest( "show", {
            model,
            verbose,
        } );
    }

    async installModel ( model, { stream = false } = {} ) {
        return this.#doRequest( "pull", {
            model,
            "stream": false,
        } );
    }

    async deleteModel ( model ) {
        return this.#doRequest(
            "delete",
            {
                model,
            },
            "DELETE"
        );
    }

    async getChatCompletion ( { model, messages, stream = false, ...options } = {} ) {
        return this.#doRequest( "chat", {
            model,
            messages,
            "stream": false,
            ...options,
        } );
    }

    async getCompletion ( { model, prompt, stream = false, ...options } = {} ) {
        return this.#doRequest( "generate", {
            model,
            prompt,
            "stream": false,
            ...options,
        } );
    }

    async getEmbedding ( { model, input, ...options } = {} ) {
        return this.#doRequest( "embed", {
            model,
            input,
            ...options,
        } );
    }

    // private
    #onExit ( code, signal ) {
        this.#ollama = null;

        process.destroy( { code } );
    }

    // XXX add stream support
    async #doRequest ( path, body, method ) {
        const url = `http://127.0.0.1:11434/api/${ path }`;

        const res = await fetch( url, {
            "method": method || ( body
                ? "POST"
                : "GET" ),
            "headersTimeout": 0,
            "body": body
                ? JSON.stringify( body )
                : undefined,
        } );

        if ( !res.ok ) return res;

        const data = await res.json();

        return result( 200, data );
    }
}
