# Ollama

## Run with `GPU` support

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
