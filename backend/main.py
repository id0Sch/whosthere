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

from bottle import Bottle, request
from google.cloud import bigquery
from os import environ
import logging

app = Bottle()
dataset_name = environ['DATASET_NAME']
table_name = environ['TABLE_NAME']
project = environ['project']

bigquery_client = bigquery.Client(project=project)
dataset = bigquery_client.dataset(dataset_name)
table = dataset.table(table_name)
table.reload()


@app.route('/', method="GET")
def the_get():
    return "result"


@app.route('/', method="POST")
def the_post():
    res = request.body.read().split(',')

    errors = table.insert_data(res)

    logging.debug(res)
    if not errors:
        return 'Loaded {} rows table'.format(res.__len__)
    else:
        logging.error(errors)
        return errors
