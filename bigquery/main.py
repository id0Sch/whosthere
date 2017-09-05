from os import environ
from google.cloud import bigquery


def create_dataset(dataset_name, project=None):
    """Craetes a dataset in a given project.
    If no project is specified, then the currently active project is used.
    """
    bigquery_client = bigquery.Client(project=project)

    dataset = bigquery_client.dataset(dataset_name)

    if not dataset.exists():
        dataset.create()
        print('Created dataset {}.'.format(dataset_name))
    else:
        print 'dataset exists'


def create_table(dataset_name, table_name, project=None):
    """Creates a simple table in the given dataset.

    If no project is specified, then the currently active project is used.
    """
    bigquery_client = bigquery.Client(project=project)
    dataset = bigquery_client.dataset(dataset_name)

    if not dataset.exists():
        print('Dataset {} does not exist.'.format(dataset_name))
        return

    table = dataset.table(table_name)

    # Set the table schema
    table.schema = (
        bigquery.SchemaField('Address', 'STRING'),
        bigquery.SchemaField('timestamp', 'TIMESTAMP')
    )

    table.create()

    print('Created table {} in dataset {}.'.format(table_name, dataset_name))


def list_tables(dataset_name, project=None):
    """Lists all of the tables in a given dataset.
    If no project is specified, then the currently active project is used.
    """
    bigquery_client = bigquery.Client(project=project)
    dataset = bigquery_client.dataset(dataset_name)

    if not dataset.exists():
        print('Dataset {} does not exist.'.format(dataset_name))
        return []

    for table in dataset.list_tables():
        print(table.name)


if __name__ == '__main__':
    dataset_name = environ['DATASET_NAME']
    table_name = environ['TABLE_NAME']
    project = environ['PROJECT_ID']

    create_dataset(dataset_name, project)
    create_table(dataset_name, table_name, project)
