from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os
app = Flask(__name__)
CORS(app)

# 🔥 Load disease info dataset
disease_info_df = pd.read_csv("dataset/disease_info.csv")

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
        "diet": row["diet"].split(";")
    }

# 🔥 NEW: Severity calculation
def calculate_severity(symptoms, probabilities):
    symptom_count = len(symptoms)
    max_prob = max(probabilities)

    if symptom_count <= 2 and max_prob < 0.5:
        return "Low Risk"
    elif symptom_count <= 4 and max_prob < 0.75:
        return "Medium Risk"
    else:
        return "High Risk"

# 🔥 NEW: Smart suggestions
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

# Load ML model
model = pickle.load(open("model/model.pkl", "rb"))
features = pickle.load(open("model/features.pkl", "rb"))

@app.route("/")
def home():
    return "MediPredict API is running 🚀"

@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    return jsonify(features)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["symptoms"]

    # Create input vector
    input_data = [0] * len(features)

    for symptom in data:
        symptom = symptom.strip().lower().replace(" ", "_")

        if symptom in features:
            index = features.index(symptom)
            input_data[index] = 1

    input_data = np.array(input_data).reshape(1, -1)

    # Prediction
    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]

    # Top 3 predictions
    top3_idx = probabilities.argsort()[-3:][::-1]

    top3 = [
        {
            "disease": model.classes_[i],
            "probability": float(probabilities[i])
        }
        for i in top3_idx
    ]

    # 🔥 Disease details
    details = get_disease_details(prediction)

    # 🔥 NEW: severity + suggestions
    severity = calculate_severity(data, probabilities)
    suggestions = get_suggestions(severity)

    return jsonify({
        "prediction": prediction,
        "top3": top3,
        "details": details,
        "severity": severity,
        "suggestions": suggestions
    })

if __name__ == "__main__":
    app.run(debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))