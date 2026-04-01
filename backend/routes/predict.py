from fastapi import APIRouter
from models.student import Student
from services.predict_service import predict

router = APIRouter()

@router.post("/predict")
def predict_dropout(student: Student):
    result = predict(student.dict())
    
    # result will now return probability
    confidence = result["confidence"]
    prediction = result["prediction"]

    # Risk categorization
    if confidence < 0.4:
        risk_level = "Low"
    elif confidence < 0.7:
        risk_level = "Medium"
    else:
        risk_level = "High"

    return {
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "risk_level": risk_level
    }