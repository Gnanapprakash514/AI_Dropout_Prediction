from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.prediction import Prediction
from models.student import Student

router = APIRouter()


@router.get("/predictions/student/{student_id}")
def get_student_prediction(student_id: int, db: Session = Depends(get_db)):
    result = (
        db.query(Prediction, Student)
        .join(Student, Prediction.student_id == Student.id)
        .filter(Prediction.student_id == student_id)
        .order_by(Prediction.created_at.desc())
        .first()
    )
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No prediction found for this student")
    p, s = result
    return {
        "prediction_id": p.id,
        "student_id": s.id,
        "name": s.name,
        "risk_level": p.risk_level,
        "probability": p.probability,
        "created_at": p.created_at,
        "attendance": s.attendance,
        "marks": s.marks,
        "prev_marks": s.prev_marks,
        "backlogs": s.backlogs,
        "mental_stress": s.mental_stress,
        "study_hours": s.study_hours,
        "assignment": s.assignment,
    }


@router.get("/predictions")
def get_predictions(db: Session = Depends(get_db)):
    results = (
        db.query(Prediction, Student)
        .join(Student, Prediction.student_id == Student.id)
        .all()
    )
    return [
        {
            "prediction_id": p.id,
            "student_id": s.id,
            "name": s.name,
            "risk_level": p.risk_level,
            "probability": p.probability,
            "created_at": p.created_at,
        }
        for p, s in results
    ]


@router.get("/high-risk")
def get_high_risk(db: Session = Depends(get_db)):
    results = (
        db.query(Prediction, Student)
        .join(Student, Prediction.student_id == Student.id)
        .filter(Prediction.risk_level == "High")
        .all()
    )
    return [
        {
            "prediction_id": p.id,
            "student_id": s.id,
            "name": s.name,
            "probability": p.probability,
            "created_at": p.created_at,
        }
        for p, s in results
    ]
