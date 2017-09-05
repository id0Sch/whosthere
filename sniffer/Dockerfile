FROM python:2.7-alpine
RUN apk add --update-cache --allow-untrusted \
    --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ \
    arp-scan

ADD requirements.txt /
RUN pip install -r requirements.txt

COPY . .
CMD ["python", "sniffer.py"]