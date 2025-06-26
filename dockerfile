FROM ghcr.io/zerocluster/node/app

RUN \
    # install ollama
    script=$(curl -fsSL "https://ollama.com/install.sh") \
    && bash <(echo "$script") \
    \
    # cleanup
    && script=$(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh") \
    && bash <(echo "$script") cleanup

RUN \
    # install dependencies
    NODE_ENV=production npm install-clean \
    \
    # cleanup
    && script=$(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh") \
    && bash <(echo "$script") cleanup
