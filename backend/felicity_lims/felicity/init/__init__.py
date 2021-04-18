import logging

from felicity.init.checks.db import check_db_conn_status
from felicity.init.setup.create_superuser import create_super_user
from felicity.init.setup.groups_perms import create_groups, create_permissions
from felicity.init.setup.setup_laboratory import create_laboratory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def initialize_felicity() -> bool:
    logger.info("Initializing Felicity LIMS")
    # Felicity Health Status Checks
    check_db_conn_status()
    
    # Felicity LIMS Setup
    create_super_user()
    create_groups()
    create_permissions()
    create_laboratory()
    
    logger.info("Felicity LIMS Initializing Success :) YaY")
    return True
