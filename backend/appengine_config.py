import os
import vendor

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
vendor.add(os.path.join(ROOT_DIR, 'lib'))
