from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# 🔥 Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 🔥 SAFE LOADING (with logs)
try:
    disease_info_path = os.path.join(BASE_DIR, "dataset", "disease_info.csv")
    model_path = os.path.join(BASE_DIR, "model", "model.pkl")
    features_path = os.path.join(BASE_DIR, "model", "features.pkl")

    print("📂 BASE DIR:", BASE_DIR)
    print("📄 Disease file:", disease_info_path)
    print("🤖 Model file:", model_path)
    print("🧠 Features file:", features_path)

    # Load files
    disease_info_df = pd.read_csv(disease_info_path)
    model = pickle.load(open(model_path, "rb"))
    features = pickle.load(open(features_path, "rb"))

    print("✅ All files loaded successfully")

except Exception as e:
    print("❌ ERROR LOADING FILES:", str(e))
    raise e


# 🔥 Helpers
def get_disease_details(disease_name):
    row = disease_info_df[disease_info_df["disease"] == disease_name]
    if row.empty:
        return {
            "description": "No data available",
            "precautions": [],
            "medications": [],
            "diet": []
        }

    row = row.iloc[0]

    return {
        "description": row["description"],
        "precautions": row["precautions"].split(";"),
        "medications": row["medications"].split(";"),
        "diet": row["diet"].split(";"),
    }


def calculate_severity(symptoms, probabilities):
    symptom_count = len(symptoms)
    max_prob = max(probabilities)

    if symptom_count <= 2 and max_prob < 0.5:
        return "Low Risk"
    elif symptom_count <= 4 and max_prob < 0.75:
        return "Medium Risk"
    else:
        return "High Risk"


def get_suggestions(severity):
    if severity == "High Risk":
        return [
            "Consult a doctor immediately",
            "Avoid self-medication",
            "Monitor symptoms closely"
        ]
    elif severity == "Medium Risk":
        return [
            "Monitor symptoms for 2-3 days",
            "Follow precautions strictly",
            "Consult doctor if condition worsens"
        ]
    else:
        return [
            "Maintain healthy lifestyle",
            "Follow basic precautions",
            "No immediate concern"
        ]


# 🔥 Routes
@app.route("/")
def home():
    return "MediPredict API is running 🚀"


@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    return jsonify(features)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json["symptoms"]

        input_data = [0] * len(features)

        for symptom in data:
            symptom = symptom.strip().lower().replace(" ", "_")
            if symptom in features:
                input_data[features.index(symptom)] = 1

        input_data = np.array(input_data).reshape(1, -1)

        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]

        top3_idx = probabilities.argsort()[-3:][::-1]

        top3 = [
            {
                "disease": model.classes_[i],
                "probability": float(probabilities[i])
            }
            for i in top3_idx
        ]

        details = get_disease_details(prediction)
        severity = calculate_severity(data, probabilities)
        suggestions = get_suggestions(severity)

        return jsonify({
            "prediction": prediction,
            "top3": top3,
            "details": details,
            "severity": severity,
            "suggestions": suggestions,
        })

    except Exception as e:
        print("❌ ERROR IN /predict:", str(e))
        return jsonify({"error": str(e)}), 500


# 🔥 Local run (Render ignores this)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)