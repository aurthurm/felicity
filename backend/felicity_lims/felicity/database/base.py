from felicity.database.base_class import DBModel
from felicity.apps.setup.models import Country
from felicity.apps.setup.models import Province
from felicity.apps.setup.models import District
from felicity.apps.setup.models import Laboratory
from felicity.apps.setup.models import Department
from felicity.apps.setup.models import Supplier
from felicity.apps.setup.models import Instrument
from felicity.apps.setup.models import Method
from felicity.apps.user.models import UserAuth
from felicity.apps.user.models import User
from felicity.apps.client.models import Client
from felicity.apps.client.models import ClientContact
from felicity.apps.patient.models import Patient
from felicity.apps.analysis.models import SampleType
from felicity.apps.analysis.models import Analysis
from felicity.apps.analysis.models import Profile
from felicity.apps.analysis.models import Sample
from felicity.apps.analysis.models import ResultOption
from felicity.apps.analysis.models import RejectionReason
from felicity.apps.analysis.models import AnalysisRequest
from felicity.apps.analysis.models import AnalysisResult
from felicity.apps.analysis.models import AnalysisCategory
from felicity.apps.job.models import Job