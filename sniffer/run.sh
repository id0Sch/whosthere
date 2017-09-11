#!/usr/bin/env bash
# TODO: https://docs.docker.com/engine/admin/start-containers-automatically/
docker run -e REPORT_URL=http://docker.for.mac.localhost:8080/report -e SLEEP_INTERVAL=60 -it sniffer:latest