from typing import Optional

from felicity.apps.user import models, schemas
from felicity.core.config import settings


def create_super_user() -> None:
    superuser: Optional[models.User] = models.User.get_by_email(settings.FIRST_SUPERUSER_EMAIL)
    if not superuser:
        su_in = schemas.UserCreate(
            first_name="System",
            last_name="Administrator",
            email=settings.FIRST_SUPERUSER_EMAIL,
            is_superuser=True,
        )
        superuser = models.User.create(user_in=su_in)
        if not superuser:
            raise Exception("Failed to create superuser")

        su_auth: Optional[models.UserAuth] = models.UserAuth.get_by_username(settings.FIRST_SEPERUSER_USERNAME)
        if not su_auth:
            sua_in = schemas.AuthCreate(
                user_name=settings.FIRST_SEPERUSER_USERNAME,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                login_retry=0,
            )
            su_auth = models.UserAuth.create(sua_in)
            if not su_auth:
                raise Exception("Failed to add authentication to superuser")

            superuser.link_auth(auth_uid=su_auth.uid)
            superuser.propagate_user_type()