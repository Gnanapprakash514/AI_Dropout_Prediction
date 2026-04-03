# existing imports
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd

from database import get_db
from models.student import Student
from models.prediction import Prediction
from services.predict_service import predict
from schemas.student_schema import StudentInput

router = APIRouter()


# -------------------------
# 🔹 SINGLE PREDICTION
# -------------------------
@router.post("/predict")
def predict_student(data: StudentInput, db: Session = Depends(get_db)):

    input_data = data.dict()
    result = predict(input_data)   # now returns dict

    student = Student(
        name=input_data["name"],
        attendance=input_data["attendance"],
        marks=input_data["marks"],
        prev_marks=input_data["prev_marks"],
        backlogs=input_data["backlogs"],
        mental_stress=input_data["mental_stress"],
        study_hours=input_data["study_hours"],
        assignment=input_data["assignment"],
        dropout=(result["risk"] == "High")   # 🔥 important change
    )

    db.add(student)
    db.commit()
    db.refresh(student)

    prediction = Prediction(
        student_id=student.id,
        risk_level=result["risk"],
        probability=result["probability"]
    )
    db.add(prediction)
    db.commit()

    return {
        "risk": result["risk"],
        "probability": result["probability"],
        "student_id": student.id
    }


# -------------------------
# 🔹 BULK PREDICTION
# -------------------------
@router.post("/predict-bulk")
def predict_bulk(file: UploadFile = File(...), db: Session = Depends(get_db)):

    df = pd.read_csv(file.file)

    results = []

    for _, row in df.iterrows():

        data = {
            "name": row.get("name", "Unknown"),
            "attendance": int(row["attendance"]),
            "marks": int(row["marks"]),
            "prev_marks": int(row["prev_marks"]),
            "backlogs": int(row["backlogs"]),
            "mental_stress": int(row["mental_stress"]),
            "study_hours": int(row["study_hours"]),
            "assignment": int(row["assignment"])
        }

        result = predict(data)

        student = Student(
            name=data["name"],
            attendance=data["attendance"],
            marks=data["marks"],
            prev_marks=data["prev_marks"],
            backlogs=data["backlogs"],
            mental_stress=data["mental_stress"],
            study_hours=data["study_hours"],
            assignment=data["assignment"],
            dropout=(result["risk"] == "High")   # 🔥 same change
        )

        db.add(student)
        db.flush()  # get student.id before commit

        prediction = Prediction(
            student_id=student.id,
            risk_level=result["risk"],
            probability=result["probability"]
        )
        db.add(prediction)

        results.append({
            "name": data["name"],
            "risk": result["risk"],
            "probability": result["probability"]
        })

    db.commit()

    return {
        "total_students": len(results),
        "results": results
    }