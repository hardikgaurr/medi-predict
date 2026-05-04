from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load disease info dataset
disease_info_df = pd.read_csv(os.path.join(BASE_DIR, "dataset", "disease_info.csv"))

# Load ML model
model  = pickle.load(open(os.path.join(BASE_DIR, "model", "model.pkl"),    "rb"))
features = pickle.load(open(os.path.join(BASE_DIR, "model", "features.pkl"), "rb"))


def get_disease_details(disease_name):
    row = disease_info_df[disease_info_df["disease"] == disease_name]
    if row.empty:
        return {"description": "No data available", "precautions": [], "medications": [], "diet": []}
    row = row.iloc[0]
    return {
        "description":  row["description"],
        "precautions":  row["precautions"].split(";"),
        "medications":  row["medications"].split(";"),
        "diet":         row["diet"].split(";"),
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
        return ["Consult a doctor immediately", "Avoid self-medication", "Monitor symptoms closely"]
    elif severity == "Medium Risk":
        return ["Monitor symptoms for 2-3 days", "Follow precautions strictly", "Consult doctor if condition worsens"]
    else:
        return ["Maintain healthy lifestyle", "Follow basic precautions", "No immediate concern"]


@app.route("/")
def home():
    return "MediPredict API is running 🚀"

@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    return jsonify(features)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["symptoms"]

    input_data = [0] * len(features)
    for symptom in data:
        symptom = symptom.strip().lower().replace(" ", "_")
        if symptom in features:
            input_data[features.index(symptom)] = 1

    input_data  = np.array(input_data).reshape(1, -1)
    prediction  = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]

    top3_idx = probabilities.argsort()[-3:][::-1]
    top3 = [{"disease": model.classes_[i], "probability": float(probabilities[i])} for i in top3_idx]

    details     = get_disease_details(prediction)
    severity    = calculate_severity(data, probabilities)
    suggestions = get_suggestions(severity)

    return jsonify({
        "prediction":  prediction,
        "top3":        top3,
        "details":     details,
        "severity":    severity,
        "suggestions": suggestions,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))