from graphene_sqlalchemy import SQLAlchemyObjectType
from graphene import relay

from felicity.apps.user.models import User, UserAuth # noqa

# Graphene User Type
class UserType(SQLAlchemyObjectType):
    class Meta:
        model = User
        interfaces = (relay.Node, )
        

# Graphene UserAuth Type
class UserAuthType(SQLAlchemyObjectType):
    class Meta:
        model = UserAuth
        interfaces = (relay.Node, )
        exclude_fields = ('hashed_password',)