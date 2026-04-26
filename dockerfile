FROM ghcr.io/zerocluster/node/app

RUN <<EOF
#!/usr/bin/env bash

set -Eeuo pipefail
trap 'echo "⚠  Error ($0:$LINENO, exit code: $?): $BASH_COMMAND" >&2' ERR

# install ollama
apt-get update
apt-get install -y \
    zstd

script=$(curl -fsSL "https://ollama.com/install.sh")
bash <(echo "$script")

# cleanup
script=$(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh")
bash <(echo "$script") cleanup
EOF

RUN --mount=type=secret,id=GITHUB_TOKEN,env=GITHUB_TOKEN \
    <<EOF
#!/usr/bin/env bash

set -Eeuo pipefail
trap 'echo "⚠  Error ($0:$LINENO, exit code: $?): $BASH_COMMAND" >&2' ERR

# install dependencies
NODE_ENV=production npm install-clean

# cleanup
script=$(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh")
bash <(echo "$script") cleanup
EOF
