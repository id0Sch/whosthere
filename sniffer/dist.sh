#!/usr/bin/env bash
rm -rf dist
mkdir dist
sh build.sh
docker save sniffer:latest > ./dist/sniffer-latest.tar

# install docker
# full guide https://blog.alexellis.io/getting-started-with-docker-on-raspberry-pi/
echo "curl -sSL https://get.docker.com | sh && \
    sudo systemctl enable docker &&
    sudo systemctl start docker
    sudo usermod -aG docker pi
" > dist/install.sh

# load the image
echo "docker load < sniffer-latest.tar" > dist/load.sh

# run the image
# todo: provide real url
echo "docker run --restart=unless-stopped \
            -e REPORT_URL=http://docker.for.mac.localhost:8080 \
            -e SLEEP_INTERVAL=60 \
            -it sniffer:latest" > dist/run.sh