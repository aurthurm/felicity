from typing import Optional, List

from pydantic import BaseModel


# 
# SampleType Schemas
# 

# Shared properties
class SampleTypeBase(BaseModel):
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
class ProfileBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
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


#
# Analysis Schemas
# 

# Shared properties
class AnalysisBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    keyword: Optional[str] = None
    active: Optional[bool] = True
    profiles: Optional[List[Profile]] = []
    sampletypes: Optional[List[SampleType]] = []


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
# AnalysisRequest Schemas
# 

# Shared properties
class AnalysisRequestBase(BaseModel):
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
class SampleBase(BaseModel):
    analysisrequest_uid: Optional[int] = None
    sampletype_uid: Optional[int] = None
    profiles: Optional[List[Profile]] = []
    analyses: Optional[List[Analysis]] = []
    sample_id: Optional[str] = None
    priority: Optional[int] = 0
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
# AnalysisResultBase Schemas
# 

# Shared properties
class AnalysisResultBase(BaseModel):
    analysis_uid: Optional[int] = None
    sample_uid: Optional[int] = None
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
