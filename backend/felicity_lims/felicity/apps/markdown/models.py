from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship, backref

from felicity.database.base_class import DBModel
from felicity.apps.setup.models.setup import Department
from felicity.apps.user.models import User
from . import schemas


class DocumentCategory(DBModel):
    name = Column(String)

    @classmethod
    def create(cls, obj_in: schemas.DocumentCategoryCreate) -> schemas.DocumentCategory:
        data = cls._import(obj_in)
        return super().create(**data)

    def update(self, obj_in: schemas.DocumentCategoryUpdate) -> schemas.DocumentCategory:
        data = self._import(obj_in)
        return super().update(**data)


class DocumentTag(DBModel):
    name = Column(String)

    @classmethod
    def create(cls, obj_in: schemas.DocumentTagCreate) -> schemas.DocumentTag:
        data = cls._import(obj_in)
        return super().create(**data)

    def update(self, obj_in: schemas.DocumentTagUpdate) -> schemas.DocumentTag:
        data = self._import(obj_in)
        return super().update(**data)


class DocTags(DBModel):
    document_uid = Column(Integer, ForeignKey('document.uid'), primary_key=True)
    tag_uid = Column(Integer, ForeignKey('documenttag.uid'), primary_key=True)


class DocAuthors(DBModel):
    document_uid = Column(Integer, ForeignKey('document.uid'), primary_key=True)
    user_uid = Column(Integer, ForeignKey('user.uid'), primary_key=True)


class DocReaders(DBModel):
    document_uid = Column(Integer, ForeignKey('document.uid'), primary_key=True)
    user_uid = Column(Integer, ForeignKey('user.uid'), primary_key=True)


class Document(DBModel):
    name = Column(String)
    subtitle = Column(String)
    document_id = Column(String)
    content = Column(String)
    version = Column(String)
    tags = relationship(DocumentTag, secondary="doctags", backref="tagged_documents")
    authors = relationship(User, secondary="docauthors", backref="authored_markdowns")
    readers = relationship(User, secondary="docreaders", backref="read_markdowns")
    department_uid = Column(Integer, ForeignKey('department.uid'), nullable=True)
    department = relationship(Department)
    category_uid = Column(Integer, ForeignKey('documentcategory.uid'), nullable=True)
    category = relationship(DocumentCategory)
    created_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    modified_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    date_archived = Column(DateTime, nullable=True)
    archived_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    date_recalled = Column(DateTime, nullable=True)
    recalled_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    date_effected = Column(DateTime, nullable=True)
    effected_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    date_approved = Column(DateTime, nullable=True)
    approved_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    last_accessed = Column(DateTime, nullable=True)
    last_accessed_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    status = Column(String)

    @classmethod
    def create(cls, obj_in: schemas.DocumentCreate) -> schemas.Document:
        data = cls._import(obj_in)
        return super().create(**data)

    def update(self, obj_in: schemas.DocumentUpdate) -> schemas.Document:
        data = self._import(obj_in)
        return super().update(**data)
