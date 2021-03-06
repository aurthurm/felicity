"""wstaqc

Revision ID: 801898baa572
Revises: 79c3917c4d01
Create Date: 2021-05-29 21:06:50.003396

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '801898baa572'
down_revision = '79c3917c4d01'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('wstaqclink',
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('uid', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('ws_template_uid', sa.Integer(), nullable=False),
    sa.Column('analysis_uid', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['analysis_uid'], ['analysis.uid'], ),
    sa.ForeignKeyConstraint(['ws_template_uid'], ['worksheettemplate.uid'], ),
    sa.PrimaryKeyConstraint('uid', 'ws_template_uid', 'analysis_uid')
    )
    op.create_index(op.f('ix_wstaqclink_uid'), 'wstaqclink', ['uid'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_wstaqclink_uid'), table_name='wstaqclink')
    op.drop_table('wstaqclink')
    # ### end Alembic commands ###
