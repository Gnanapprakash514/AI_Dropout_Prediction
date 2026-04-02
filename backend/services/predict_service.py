import os
import numpy as np
import joblib   # ← THIS is the key

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "ml", "dropout_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ml", "scaler.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "ml", "features.pkl")

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    features = joblib.load(FEATURES_PATH)

    print("✅ ML model loaded successfully")

except Exception as e:
    print("❌ Error loading ML files:", e)
    model = None
    scaler = None
    features = None


def predict(data: dict):
    try:
        if model is None or scaler is None:
            return {"risk": "Unknown", "probability": 0}

        input_data = np.array([[
            data["attendance"],
            data["marks"],
            data["prev_marks"],
            data["backlogs"],
            data["mental_stress"],
            data["study_hours"],
            data["assignment"]
        ]])

        input_scaled = scaler.transform(input_data)

        # 🔥 probability
        prob = model.predict_proba(input_scaled)[0][1]

        # 🔥 risk classification
        if prob < 0.4:
            risk = "Low"
        elif prob < 0.7:
            risk = "Medium"
        else:
            risk = "High"

        return {
            "risk": risk,
            "probability": float(prob)
        }

    except Exception as e:
        print("❌ Prediction error:", e)
        return {"risk": "Unknown", "probability": 0}