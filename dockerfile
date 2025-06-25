FROM ghcr.io/zerocluster/node/app

RUN \
    # install ollama
    bash <(curl -fsSL "https://ollama.com/install.sh") \
    \
    # cleanup
    && bash <(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh") cleanup

RUN \
    # install dependencies
    NODE_ENV=production npm install-clean \
    \
    # cleanup
    && bash <(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh") cleanup
