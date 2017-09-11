# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import json
import logging
from time import time
from os import environ
from bottle import Bottle, request
from datetime import datetime as dt
import google.cloud.bigquery as bigquery
from google.appengine.api.app_identity import get_application_id

app = Bottle()
dataset_name = environ['DATASET_NAME']

project = get_application_id()
bigquery_client = bigquery.Client(project=project)
dataset = bigquery_client.dataset(dataset_name)

raw_table = dataset.table('raw')
raw_table.reload()

mac_to_owner_table = dataset.table('mac_to_owner')
mac_to_owner_table.reload()


@app.route('/report', method="POST")
def report():
    res = request.json
    addresses = []

    now = dt.fromtimestamp(time()).strftime('%Y-%m-%d %H:%M:%S')

    for [ip, mac] in res:
        addresses.append([mac, ip, now])

    errors = raw_table.insert_data(addresses)
    logging.debug(res)
    if not errors:
        return 'Loaded {} addresses'.format(str(addresses.__len__()))
    else:
        logging.error(errors)
        return errors


@app.route('/pair', method="POST")
def pair():
    res = request.json
    logging.debug('{} {}'.format(res['mac_address'], res['email']))

    errors = mac_to_owner_table.insert_data([[res['mac_address'], res['email']]])
    if not errors:
        return 'Paired Successfully'
    else:
        logging.error(errors)
        return errors


@app.route('/addresses', method="GET")
def get_addresses():
    query = """
    #standardSQL
    SELECT raw.mac_address, 
      owner.email, 
      max(local_ip) as last_seen_ip_address, 
      max(timestamp) as last_seen_timestamp,
      count(raw.mac_address) as occurences 
      FROM `"""+dataset_name+""".raw` as raw 
      LEFT JOIN `"""+dataset_name+""".mac_to_owner` as owner ON owner.mac_address = raw.mac_address 
      GROUP by raw.mac_address,owner.email
      ORDER BY occurences desc
    """

    query_job = bigquery_client.run_sync_query(query)
    query_job.run()

    field_names = [f.name for f in query_job.schema]

    try:
        res = []
        for row in query_job.rows:
            zipped_results = zip(field_names, row)
            res.append({x[0]: str(x[1]) for x in zipped_results})
    except IndexError:
        res = None
    return json.dumps(res)
