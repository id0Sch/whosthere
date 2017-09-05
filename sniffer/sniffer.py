import re
from os import environ
from time import sleep
from requests import post
from subprocess import check_output

ENDPOINT = environ['REPORT_URL']
sleep_interval = int(environ['SLEEP_INTERVAL'])

mac_pattern = re.compile(ur'(?:[0-9a-fA-F]:?){12}', re.MULTILINE | re.I)


def get_macs():
    output = check_output("arp-scan -lq", shell=True)
    return mac_pattern.findall(output)


try:
    while True:
        matches = get_macs()
        print 'found: ', matches
        post(ENDPOINT, data={'data': matches})
        sleep(sleep_interval)

except KeyboardInterrupt:
    exit()
