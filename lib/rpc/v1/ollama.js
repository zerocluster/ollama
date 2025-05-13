import fetch from "#core/fetch";

// DOCS: https://github.com/ollama/ollama/blob/main/docs/api.md

export default Super =>
    class extends Super {

        // public
        async [ "API_version" ] ( ctx ) {
            return this.#doRequest( "version" );
        }

        async [ "API_tags" ] ( ctx ) {
            return this.#doRequest( "tags" );
        }

        async [ "API_ps" ] ( ctx ) {
            return this.#doRequest( "ps" );
        }

        async [ "API_show" ] ( ctx, model, { verbose = false } = {} ) {
            return this.#doRequest( "show", {
                model,
                verbose,
            } );
        }

        async [ "API_pull" ] ( ctx, model, { stream = false } = {} ) {
            return this.#doRequest( "pull", {
                model,
                stream,
            } );
        }

        async [ "API_delete" ] ( ctx, model ) {
            return this.#doRequest(
                "delete",
                {
                    model,
                },
                "DELETE"
            );
        }

        async [ "API_chat" ] ( ctx, { model, messages, stream = false, ...options } = {} ) {
            return this.#doRequest( "chat", {
                model,
                messages,
                stream,
                ...options,
            } );
        }

        async [ "API_generate" ] ( ctx, { model, prompt, stream = false, ...options } = {} ) {
            return this.#doRequest( "generate", {
                model,
                prompt,
                stream,
                ...options,
            } );
        }

        async [ "API_embed" ] ( ctx, { model, input, ...options } = {} ) {
            return this.#doRequest( "embed", {
                model,
                input,
                ...options,
            } );
        }

        // private
        // XXX add stream support
        async #doRequest ( path, body, method ) {
            const url = `http://${ this.app.config.ollamaHost }:11434/api/${ path }`;

            const res = await fetch( url, {
                "method": method || ( body
                    ? "POST"
                    : "GET" ),
                "body": body
                    ? JSON.stringify( body )
                    : undefined,
            } );

            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }
    };
