from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.prediction import Prediction

router = APIRouter()


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    total = db.query(Prediction).count()
    high = db.query(Prediction).filter(Prediction.risk_level == "High").count()
    medium = db.query(Prediction).filter(Prediction.risk_level == "Medium").count()
    low = db.query(Prediction).filter(Prediction.risk_level == "Low").count()

    return {
        "total_predictions": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
    }
