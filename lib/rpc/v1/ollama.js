import fetch from "#core/fetch";

const OLLAMA_API_URL = "http://127.0.0.7:11434/api/";

export default Super =>
    class extends Super {

        // public
        async [ "API_tags" ] ( ctx ) {
            const res = await fetch( OLLAMA_API_URL + "tags" );
            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }

        async [ "API_pull" ] ( ctx, modelId ) {
            const res = await fetch( OLLAMA_API_URL + "pull", {
                "method": "POST",
                "body": JSON.stringify( {
                    "model": modelId,
                    "stream": false,
                } ),
            } );

            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }
    };
