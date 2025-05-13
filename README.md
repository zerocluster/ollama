# Ollama

## Run with `GPU` support

<https://gist.github.com/RafaelWO/290b764e88933b0c0769b6d2394fcad2>

````markdown
# Setting up a Docker Swarm with GPUs

## Installing Docker

[Official instructions](https://docs.docker.com/install/linux/docker-ce/ubuntu/).

Add yourself to the `docker` group to be able to run containers as non-root (see [Post-install steps for Linux](https://docs.docker.com/install/linux/linux-postinstall/)).

```
sudo groupadd docker
sudo usermod -aG docker $USER
```

Verify with `docker run hello-world`.

## Installing the NVidia Container Runtime

[Official instructions](https://github.com/NVIDIA/nvidia-docker).

Start by installing the appropriate NVidia drivers. Then continue to install NVidia Docker.

Verify with `docker run --gpus all,capabilities=utility nvidia/cuda:10.0-base nvidia-smi`.

## Configuring Docker to work with your GPU(s)

The first step is to identify the GPU(s) available on your system.
Docker will expose these as 'resources' to the swarm.
This allows other nodes to place services (swarm-managed container deployments) on your machine.

_These steps are currently for NVidia GPUs._

Docker identifies your GPU by its Universally Unique IDentifier (UUID).
Find the GPU UUID for the GPU(s) in your machine.

```
nvidia-smi -a
```

A typical UUID looks like `GPU-45cbf7b3-f919-7228-7a26-b06628ebefa1`.
Now, only take the first two dash-separated parts, e.g.: `GPU-45cbf7b3`.

This "GPU_ID" can also be obtained using the following command

```
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

```
sudo systemctl restart docker.service
```

## Initializing the Docker Swarm

Initialize a new swarm on a manager-to-be.

```
docker swarm init
```

Add new nodes (slaves), or manager-nodes (shared masters).
Run the following command on a node that is already part of the swarm:

```
docker swarm join-token (worker|manager)
```

Then, run the resulting command on a member-to-be.

Show who's in the swarm:

```
docker node ls
```

## A first deployment

```
docker service create --replicas 1 \
  --name tensor-qs \
  --generic-resource "NVIDIA-GPU=0" \
  tomlankhorst/tensorflow-quickstart
```

This deploys [a TensorFlow quick start image](https://hub.docker.com/r/tomlankhorst/tensorflow-quickstart), that follows [the quick start](https://www.tensorflow.org/tutorials/quickstart/advanced).

Show active services:

```
docker service ls
```

Inspect the service

```
$ docker service inspect --pretty tensor-qs
ID:             vtjcl47xc630o6vndbup64c1i
Name:           tensor-qs
Service Mode:   Replicated
 Replicas:      1
Placement:
UpdateConfig:
 Parallelism:   1
 On failure:    pause
 Monitoring Period: 5s
 Max failure ratio: 0
 Update order:      stop-first
RollbackConfig:
 Parallelism:   1
 On failure:    pause
 Monitoring Period: 5s
 Max failure ratio: 0
 Rollback order:    stop-first
ContainerSpec:
 Image:         tomlankhorst/tensorflow-quickstart:latest@sha256:1f793df87f00478d0c41ccc7e6177f9a214a5d3508009995447f3f25b45496fb
 Init:          false
Resources:
Endpoint Mode:  vip
```

Show the logs

```
$ docker service logs tensor-qs
...
tensor-qs.1.3f9jl1emwe9l@tlws    | 2020-03-16 08:45:15.495159: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library libcublas.so.10.0
tensor-qs.1.3f9jl1emwe9l@tlws    | 2020-03-16 08:45:15.621767: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library libcudnn.so.7
tensor-qs.1.3f9jl1emwe9l@tlws    | Epoch 1, Loss: 0.132665216923, Accuracy: 95.9766693115, Test Loss: 0.0573637597263, Test Accuracy: 98.1399993896
tensor-qs.1.3f9jl1emwe9l@tlws    | Epoch 2, Loss: 0.0415383689106, Accuracy: 98.6949996948, Test Loss: 0.0489368513227, Test Accuracy: 98.3499984741
tensor-qs.1.3f9jl1emwe9l@tlws    | Epoch 3, Loss: 0.0211332384497, Accuracy: 99.3150024414, Test Loss: 0.0521399155259, Test Accuracy: 98.2900009155
tensor-qs.1.3f9jl1emwe9l@tlws    | Epoch 4, Loss: 0.0140329506248, Accuracy: 99.5716705322, Test Loss: 0.053688980639, Test Accuracy: 98.4700012207
tensor-qs.1.3f9jl1emwe9l@tlws    | Epoch 5, Loss: 0.00931495986879, Accuracy: 99.7116699219, Test Loss: 0.0681483447552, Test Accuracy: 98.1500015259
```
````

```yaml
test:
  image: tomlankhorst/tensorflow-quickstart
  deploy:
    resources:
      reservations:
        generic_resources:
          - discrete_resource_spec:
              kind: NVIDIA-GPU
              value: 0
```

Install `Nvidia` container toolkit:

<https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installation>

```sh
docker run \
    -d \
    --gpus=all \
    -v ollama:/root/.ollama \
    -p 11434:11434 \
    --name ollama \
    ollama/ollama
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
