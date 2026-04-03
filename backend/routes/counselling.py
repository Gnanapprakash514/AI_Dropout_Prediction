from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.counselling import Counselling, Followup
from models.student import Student

router = APIRouter()


class CounsellingInput(BaseModel):
    student_id: int
    counsellor: str
    notes: str


class FollowupInput(BaseModel):
    counselling_id: int
    student_id: int
    status: str
    remarks: str


@router.post("/counselling")
def create_counselling(data: CounsellingInput, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    record = Counselling(
        student_id=data.student_id,
        counsellor=data.counsellor,
        notes=data.notes,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"counselling_id": record.id, "student_id": record.student_id, "counsellor": record.counsellor}


@router.post("/followup")
def create_followup(data: FollowupInput, db: Session = Depends(get_db)):
    counselling = db.query(Counselling).filter(Counselling.id == data.counselling_id).first()
    if not counselling:
        raise HTTPException(status_code=404, detail="Counselling record not found")

    record = Followup(
        counselling_id=data.counselling_id,
        student_id=data.student_id,
        status=data.status,
        remarks=data.remarks,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"followup_id": record.id, "counselling_id": record.counselling_id, "status": record.status}
