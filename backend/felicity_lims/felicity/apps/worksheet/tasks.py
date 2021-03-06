import time
import logging
from felicity.apps.analysis.models.analysis import Sample
from felicity.apps.analysis.models.qc import QCSet
from felicity.apps.analysis import conf as analysis_conf
from felicity.apps.analysis.utils import get_qc_sample_type
from felicity.apps.analysis.models.results import AnalysisResult
from felicity.apps.analysis.schemas import (
    AnalysisResultCreate,
    SampleCreate,
    QCSetCreate,
)
from felicity.apps.job import models as job_models
from felicity.apps.job.conf import states as job_states
from felicity.apps.worksheet import models, conf

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def populate_worksheet_plate(job_uid: int):

    logger.info(f"starting job {job_uid} ....")
    job = job_models.Job.get(uid=job_uid)
    if not job:
        return

    if not job.status == job_states.PENDING:
        return

    job.change_status(new_status=job_states.RUNNING)
    ws_uid = job.job_id

    ws = models.WorkSheet.get(uid=ws_uid)
    if not ws:
        job.change_status(new_status=job_states.FAILED, change_reason=f"Failed to acquire WorkSheet {ws_uid}")
        logger.warning(f"Failed to acquire WorkSheet {ws_uid}")
        return

    if ws.state in [conf.worksheet_states.TO_BE_VERIFIED, conf.worksheet_states.VERIFIED]:
        job.change_status(new_status=job_states.FAILED, change_reason=f"WorkSheet {ws_uid} - is already processed")
        logger.warning(f"WorkSheet {ws_uid} - is already processed")
        return

    if ws.has_processed_samples():
        job.change_status(new_status=job_states.FAILED, change_reason=f"WorkSheet {ws_uid} - contains at least a "
                                                                      f"processed sample")
        logger.warning(f"WorkSheet {ws_uid} - contains at least a processed sample")
        return

    logger.info(f"Filtering samples by template criteria ...")
    # get sample, filtered by analysis_service and Sample Type
    samples = AnalysisResult.smart_query(
        filters={
            'assigned__exact': False,
            # 'sample___internal_use__exact': False,  # ?
            # 'profiles__uid__in': [_p.uid for _p in ws.profiles],
            'analysis_uid__in': [_a.uid for _a in ws.analyses],
            'sample___sampletype_uid__exact': ws.sample_type_uid,
        },
        sort_attrs=['-sample___priority', '-created_at']
    ).all()
    available_samples = len(samples)
    logger.info(f"Done filtering: Got {available_samples} samples available ...")
    if available_samples == 0:
        job.change_status(new_status=job_states.FAILED, change_reason=f"There are no samples to assign to WorkSheet {ws_uid}")
        logger.warning(f"There are no samples to assign to WorkSheet {ws_uid}")
        return

    samples = samples[:ws.number_of_samples]
    print(ws.reserved)
    reserved = [int(r) for r in list(ws.reserved.keys())]

    position = 1
    for key, sample in enumerate(reversed(samples)):
        while position in reserved:
            position += 1
        sample.assign(ws.uid, position)
        position += 1

    time.sleep(1)

    ws.reset_assigned_count()
    if ws.assigned_count > 0:
        ws.change_state(state=conf.worksheet_states.OPEN)

    setup_ws_quality_control(ws)

    job.change_status(new_status=job_states.FINISHED)
    logger.info(f"Done !! Job {job_uid} was executed successfully :)")


def run_ws_jobs():
    pass


def get_sample_position(reserved, level_uid) -> int:
    if not reserved:
        return 0
    level_uid = int(level_uid)
    try:
        for k, v in reserved.items():
            val_uid = int(v.get('level_uid', 0))
            if val_uid == level_uid:
                return int(k)
    except Exception:
        pass
    return 0


def setup_ws_quality_control(ws):
    reserved_pos = ws.reserved
    if ws.template.qc_levels:
        # if ws has qc set, then retrieve
        _a_res = AnalysisResult.where(worksheet_uid=ws.uid).all()
        _qc_sets = []

        for _a_r in _a_res:
            if _a_r.sample.qc_set:
                _qc_sets.append(_a_r.sample.qc_set)

        try:
            qc_set = _qc_sets[0]
        except Exception:
            qc_set_schema = QCSetCreate(name="Set", note="Auto Generated")
            qc_set = QCSet.create(qc_set_schema)

        for level in ws.template.qc_levels:
            # if ws has qc_set with this level, skip
            add_qc_sample = True
            if qc_set.samples:
                for _sample in qc_set.samples:
                    if _sample.qc_level.uid == level.uid:
                        add_qc_sample = False

            if add_qc_sample:
                sample_type = get_qc_sample_type()

                # create qc_sample
                s_in = SampleCreate(
                    sampletype_uid=sample_type.uid,
                    internal_use=True,
                    status=analysis_conf.states.sample.PENDING,
                )
                sample: Sample = Sample.create(s_in)
                sample.qc_set_uid = qc_set.uid
                sample.qc_level_uid = level.uid
                sample.analyses.append(ws.analyses[0])
                sample.save()
                logger.warning(f"Sample {sample.sample_id}, level {level.level}")

                # create results linkages
                a_result_in = {
                    'sample_uid': sample.uid,
                    'analysis_uid': ws.analyses[0].uid,
                    'status': analysis_conf.states.result.PENDING
                }
                a_result_schema = AnalysisResultCreate(**a_result_in)
                ar: AnalysisResult = AnalysisResult.create(a_result_schema)
                position = get_sample_position(reserved_pos, level.uid)
                ar.assign(ws.uid, position)


