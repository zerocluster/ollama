FROM ghcr.io/zerocluster/node/app

RUN \
    # install ollama
    apt-get update && apt-get install -y zstd \
    && script=$(curl -fsSL "https://ollama.com/install.sh") \
    && bash <(echo "$script") \
    \
    # cleanup
    && script=$(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh") \
    && bash <(echo "$script") cleanup

RUN \
    --mount=type=secret,id=GITHUB_TOKEN,env=GITHUB_TOKEN \
    \
    # install dependencies
    NODE_ENV=production npm install-clean \
    \
    # cleanup
    && script=$(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh") \
    && bash <(echo "$script") cleanup
