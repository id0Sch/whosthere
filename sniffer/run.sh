#!/usr/bin/env bash
# TODO: https://docs.docker.com/engine/admin/start-containers-automatically/
docker run -e REPORT_URL=https://whos-there-179017.appspot.com/ -e SLEEP_INTERVAL=60 -it sniffer:latest
#docker run -e REPORT_URL=http://docker.for.mac.localhost:8080 -e SLEEP_INTERVAL=60 -it sniffer:latest