# Ollama

## Run with `GPU` support

<https://gist.github.com/RafaelWO/290b764e88933b0c0769b6d2394fcad2>

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
