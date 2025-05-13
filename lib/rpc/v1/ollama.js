import fetch from "#core/fetch";

// DOCS: https://github.com/ollama/ollama/blob/main/docs/api.md

const OLLAMA_API_URL = "http://127.0.0.7:11434/api/";

export default Super =>
    class extends Super {

        // public
        async [ "API_version" ] ( ctx ) {
            const res = await fetch( OLLAMA_API_URL + "version" );
            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }

        async [ "API_tags" ] ( ctx ) {
            const res = await fetch( OLLAMA_API_URL + "tags" );
            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }

        async [ "API_ps" ] ( ctx ) {
            const res = await fetch( OLLAMA_API_URL + "ps" );
            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }

        async [ "API_show" ] ( ctx, model, { verbose = false } = {} ) {
            const res = await fetch( OLLAMA_API_URL + "show", {
                "method": "POST",
                "body": JSON.stringify( {
                    model,
                    verbose,
                } ),
            } );

            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }

        async [ "API_pull" ] ( ctx, model, { stream = false } = {} ) {
            const res = await fetch( OLLAMA_API_URL + "pull", {
                "method": "POST",
                "body": JSON.stringify( {
                    model,
                    stream,
                } ),
            } );

            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }

        async [ "API_delete" ] ( ctx, model ) {
            const res = await fetch( OLLAMA_API_URL + "delete", {
                "method": "POST",
                "body": JSON.stringify( {
                    model,
                } ),
            } );

            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }

        async [ "API_chat" ] ( ctx, { model, messages, stream = false, ...options } = {} ) {
            const res = await fetch( OLLAMA_API_URL + "chat", {
                "method": "POST",
                "body": JSON.stringify( {
                    model,
                    messages,
                    stream,
                    ...options,
                } ),
            } );

            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }

        async [ "API_generate" ] ( ctx, { model, prompt, stream = false, ...options } = {} ) {
            const res = await fetch( OLLAMA_API_URL + "generate", {
                "method": "POST",
                "body": JSON.stringify( {
                    model,
                    prompt,
                    stream,
                    ...options,
                } ),
            } );

            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }

        async [ "API_embed" ] ( ctx, { model, input, ...options } = {} ) {
            const res = await fetch( OLLAMA_API_URL + "embed", {
                "method": "POST",
                "body": JSON.stringify( {
                    model,
                    input,
                    ...options,
                } ),
            } );

            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }
    };
