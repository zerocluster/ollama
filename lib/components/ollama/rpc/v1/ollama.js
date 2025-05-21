export default Super =>
    class extends Super {

        // public
        async [ "API_get-version" ] ( ctx ) {
            return this.app.ollama.getVersion();
        }

        async [ "API_get-models" ] ( ctx ) {
            return [ ...this.app.ollama.models ];
        }

        async [ "API_get-installed-models" ] ( ctx ) {
            return this.app.ollama.getInstalledModels();
        }

        async [ "API_get-loaded-models" ] ( ctx ) {
            return this.app.ollama.getLoadedModels();
        }

        async [ "API_get-model-info" ] ( ctx, model, { verbose } = {} ) {
            return this.app.ollama.getModelInfo( model, { verbose } );
        }

        async [ "API_install-model" ] ( ctx, model, { stream } = {} ) {
            return this.app.ollama.installModel( model, { stream } );
        }

        async [ "API_delete-model" ] ( ctx, model ) {
            return this.app.ollama.deleteModel( model );
        }

        async [ "API_get-chat-completion" ] ( ctx, { model, messages, stream, ...options } = {} ) {
            return this.app.ollama.getChatCompletion( { model, messages, stream, ...options } );
        }

        async [ "API_get-completion" ] ( ctx, { model, prompt, stream, ...options } = {} ) {
            return this.app.ollama.getCompletion( { model, prompt, stream, ...options } );
        }

        async [ "API_get-embedding" ] ( ctx, { model, input, ...options } = {} ) {
            return this.app.ollama.getEmbedding( { model, input, ...options } );
        }
    };
