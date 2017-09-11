from os import environ
from time import sleep
from requests import post
from subprocess import check_output

ENDPOINT = environ['REPORT_URL']
sleep_interval = int(environ['SLEEP_INTERVAL'])


def get_macs():
    output = check_output("arp-scan -lq", shell=True)
    return [i.split('\t', 1) for i in output.split('\n')[2:-4]]


try:
    while True:
        matches = get_macs()
        print 'found: {} addresses'.format(str(matches.__len__()))
        response = post(ENDPOINT, json=matches)
        print response.text
        sleep(sleep_interval)

except KeyboardInterrupt:
    exit()
