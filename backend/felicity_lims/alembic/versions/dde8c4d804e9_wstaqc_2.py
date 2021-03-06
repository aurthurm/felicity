"""wstaqc 2

Revision ID: dde8c4d804e9
Revises: 801898baa572
Create Date: 2021-05-29 21:09:43.059431

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dde8c4d804e9'
down_revision = '801898baa572'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('wsaqclink',
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('uid', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('ws_template_uid', sa.Integer(), nullable=False),
    sa.Column('analysis_uid', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['analysis_uid'], ['analysis.uid'], ),
    sa.ForeignKeyConstraint(['ws_template_uid'], ['worksheettemplate.uid'], ),
    sa.PrimaryKeyConstraint('uid', 'ws_template_uid', 'analysis_uid')
    )
    op.create_index(op.f('ix_wsaqclink_uid'), 'wsaqclink', ['uid'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_wsaqclink_uid'), table_name='wsaqclink')
    op.drop_table('wsaqclink')
    # ### end Alembic commands ###
