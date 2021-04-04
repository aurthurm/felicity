from typing import Optional, List
from datetime import datetime

from felicity.apps import BaseAuditModel


# 
# SampleType Schemas
# 

# Shared properties
class SampleTypeBase(BaseAuditModel):
    name: Optional[str] = None
    description: Optional[str] = None
    abbr: Optional[str] = None
    active: Optional[bool] = True


class SampleTypeBaseInDB(SampleTypeBase):
    uid: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class SampleTypeCreate(SampleTypeBase):
    pass


# Properties to receive via API on update
class SampleTypeUpdate(SampleTypeBase):
    pass


# Properties to return via API
class SampleType(SampleTypeBaseInDB):
    pass


# Properties stored in DB
class SampleTypeInDB(SampleTypeBaseInDB):
    pass


# 
# Profile Schemas
# 

# Shared properties
class ProfileBase(BaseAuditModel):
    name: Optional[str] = None
    description: Optional[str] = None
    keyword: Optional[str] = None
    tat_length_minutes: Optional[int] = None
    active: Optional[bool] = True


class ProfileBaseInDB(ProfileBase):
    uid: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ProfileCreate(ProfileBase):
    pass


# Properties to receive via API on update
class ProfileUpdate(ProfileBase):
    pass


# Properties to return via API
class Profile(ProfileBaseInDB):
    pass


# Properties stored in DB
class ProfileInDB(ProfileBaseInDB):
    pass


# AnalysisCategory Schemas
#

# Shared properties
class AnalysisCategoryBase(BaseAuditModel):
    name: Optional[str] = None
    description: Optional[str] = None
    active: Optional[bool] = True


class AnalysisCategoryBaseInDB(AnalysisCategoryBase):
    uid: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class AnalysisCategoryCreate(AnalysisCategoryBase):
    pass


# Properties to receive via API on update
class AnalysisCategoryUpdate(AnalysisCategoryBase):
    pass


# Properties to return via API
class AnalysisCategory(AnalysisCategoryBaseInDB):
    pass


# Properties stored in DB
class AnalysisCategoryInDB(AnalysisCategoryBaseInDB):
    pass


#
# Analysis Schemas
# 

# Shared properties
class AnalysisBase(BaseAuditModel):
    name: Optional[str] = None
    description: Optional[str] = None
    keyword: Optional[str] = None
    active: Optional[bool] = True
    profiles: Optional[List[Profile]] = []
    sampletypes: Optional[List[SampleType]] = []
    tat_length_minutes: Optional[int] = None
    unit: Optional[str] = None
    category_uid: Optional[str] = None


class AnalysisBaseInDB(AnalysisBase):
    uid: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class AnalysisCreate(AnalysisBase):
    pass


# Properties to receive via API on update
class AnalysisUpdate(AnalysisBase):
    pass


# Properties to return via API
class Analysis(AnalysisBaseInDB):
    pass


# Properties stored in DB
class AnalysisInDB(AnalysisBaseInDB):
    pass


#
# Result Option Schemas
#

# Shared properties
class ResultOptionBase(BaseAuditModel):
    option_key: Optional[str] = None
    value: Optional[str] = None
    analysis_uid: Optional[str] = None


class ResultOptionBaseInDB(ResultOptionBase):
    uid: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ResultOptionCreate(ResultOptionBase):
    pass


# Properties to receive via API on update
class ResultOptionUpdate(ResultOptionBase):
    pass


# Properties to return via API
class ResultOption(ResultOptionBaseInDB):
    pass


# Properties stored in DB
class ResultOptionInDB(ResultOptionBaseInDB):
    pass


#
# AnalysisRequest Schemas
# 

# Shared properties
class AnalysisRequestBase(BaseAuditModel):
    patient_uid: Optional[int] = None
    client_uid: Optional[int] = None
    request_id: Optional[str] = None
    client_request_id: Optional[str] = None


class AnalysisRequestBaseInDB(AnalysisRequestBase):
    uid: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class AnalysisRequestCreate(AnalysisRequestBase):
    pass


# Properties to receive via API on update
class AnalysisRequestUpdate(AnalysisRequestBase):
    pass


# Properties to return via API
class AnalysisRequest(AnalysisRequestBaseInDB):
    pass


# Properties stored in DB
class AnalysisRequestInDB(AnalysisRequestBaseInDB):
    pass


#
# Sample Schemas
# 

# Shared properties
class SampleBase(BaseAuditModel):
    analysisrequest_uid: Optional[int] = None
    sampletype_uid: Optional[int] = None
    profiles: Optional[List[Profile]] = []
    analyses: Optional[List[Analysis]] = []
    sample_id: Optional[str] = None
    priority: Optional[int] = 0
    invalidated_by_uid : Optional[int] = None
    date_invalidated: Optional[datetime] = None
    status: Optional[str] = None


class SampleBaseInDB(SampleBase):
    uid: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class SampleCreate(SampleBase):
    pass


# Properties to receive via API on update
class SampleUpdate(SampleBase):
    pass


# Properties to return via API
class Sample(SampleBaseInDB):
    pass


# Properties stored in DB
class SampleInDB(SampleBaseInDB):
    pass


#
# Rejection Reason Schemas
#

# Shared properties
class RejectionReasonBase(BaseAuditModel):
    reason: Optional[str] = None


class RejectionReasonBaseInDB(RejectionReasonBase):
    uid: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class RejectionReasonCreate(RejectionReasonBase):
    pass


# Properties to receive via API on update
class RejectionReasonUpdate(RejectionReasonBase):
    pass


# Properties to return via API
class RejectionReason(RejectionReasonBaseInDB):
    pass


# Properties stored in DB
class RejectionReasonInDB(RejectionReasonBaseInDB):
    pass


#
# AnalysisResultBase Schemas
# 

# Shared properties
class AnalysisResultBase(BaseAuditModel):
    analysis_uid: Optional[int] = None
    sample_uid: Optional[int] = None
    instrument_uid: Optional[int] = None
    method_uid: Optional[int] = None
    result: Optional[str] = None
    analyst_uid: Optional[int] = None
    submitted_by_uid: Optional[int] = None
    date_submitted: Optional[datetime] = None
    verified_by_uid: Optional[int] = None
    date_verified: Optional[datetime] = None
    invalidated_by_uid : Optional[int] = None
    date_invalidated: Optional[datetime] = None
    status: Optional[str] = None


class AnalysisResultBaseInDB(AnalysisResultBase):
    uid: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class AnalysisResultCreate(AnalysisResultBase):
    pass


# Properties to receive via API on update
class AnalysisResultUpdate(AnalysisResultBase):
    pass


# Properties to return via API
class AnalysisResult(AnalysisResultBaseInDB):
    pass


# Properties stored in DB
class AnalysisResultInDB(AnalysisResultBaseInDB):
    pass
