# `Ollama` application

## Run with `GPU` support

### Installing the NVidia Container Runtime

Install `Nvidia` container toolkit:

<https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installation>

[Official instructions](https://github.com/NVIDIA/nvidia-docker).

Start by installing the appropriate NVidia drivers. Then continue to install NVidia Docker.

Verify with `docker run --gpus all,capabilities=utility nvidia/cuda:10.0-base nvidia-smi`.

### Configuring Docker to work with your GPU(s)

The first step is to identify the GPU(s) available on your system.
Docker will expose these as 'resources' to the swarm.
This allows other nodes to place services (swarm-managed container deployments) on your machine.

_These steps are currently for NVidia GPUs._

Docker identifies your GPU by its Universally Unique IDentifier (UUID).
Find the GPU UUID for the GPU(s) in your machine.

```sh
nvidia-smi -a
```

A typical UUID looks like `GPU-45cbf7b3-f919-7228-7a26-b06628ebefa1`.
Now, only take the first two dash-separated parts, e.g.: `GPU-45cbf7b3`.

This "GPU_ID" can also be obtained using the following command

```sh
GPU_ID=$(nvidia-smi -a | grep UUID | awk '{print substr($4,0,12)}')
```

Open up the Docker engine configuration file, typically at `/etc/docker/daemon.json`.

Add the GPU ID to the `node-generic-resources`.
Make sure that the `nvidia` runtime is present and set the `default-runtime` to it.
Make sure to keep other configuration options in-place, if they are there.
Take care of the JSON syntax, which is not forgiving of single quotes and lagging commas.

```json
{
    "runtimes": {
        "nvidia": {
            "path": "/usr/bin/nvidia-container-runtime",
            "runtimeArgs": []
        }
    },
    "default-runtime": "nvidia",
    "node-generic-resources": [
        "NVIDIA-GPU=GPU-45cbf7b"
    ]
}
```

Now, make sure to enable GPU resource advertisting by adding or uncommenting the following in `/etc/nvidia-container-runtime/config.toml`

```
swarm-resource = "DOCKER_RESOURCE_GPU"
```

Restart the service.

```sh
sudo systemctl restart docker.service
```

### A first deployment

```sh
docker service create --replicas 1 \
    --name tensor-qs \
    --generic-resource "NVIDIA-GPU=0" \
    tomlankhorst/tensorflow-quickstart
```

## Open WebUI

```sh
# ollama embedded
docker run --rm -it \
    -p 80:8080 \
    -v /var/local/open-webui/ollama:/root/.ollama \
    -v /var/local/open-webui:/app/backend/data \
    ghcr.io/open-webui/open-webui:ollama

# api only
docker run --rm -it \
    -p 80:8080 \
    -e OPENAI_API_KEY=1
-e WEBUI_SECRET_KEY=1 \
    -v /var/local/open-webui:/app/backend/data \
    ghcr.io/open-webui/open-webui:main

http://devel/

curl http://devel/api/models \
    -H "Authorization: Bearer sk-ceb5434731474ecda2df427a600011bf"

curl http://devel/api/chat/completions \
    -H "Authorization: Bearer sk-ceb5434731474ecda2df427a600011bf" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "qwen3:0.6b",
        "messages": [ {
            "role": "user",
            "content": "когда ты получил последнее обновление?"
        } ],
        "temperature": 0.7
    }'
```
