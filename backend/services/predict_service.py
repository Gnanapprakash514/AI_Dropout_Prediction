import joblib
import pandas as pd

model = joblib.load("ml/dropout_model.pkl")
scaler = joblib.load("ml/scaler.pkl")
features = joblib.load("ml/features.pkl")

def predict(data: dict):
    df = pd.DataFrame([data], columns=features)
    
    scaled = scaler.transform(df)
    
    proba = model.predict_proba(scaled)[0][1]
    prediction = int(proba > 0.5)

    return {
        "prediction": prediction,
        "confidence": float(proba)
    }