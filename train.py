import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Load dataset
df = pd.read_csv("dataset/Training.csv")

# 🔧 Clean column names
df.columns = (
    df.columns
    .str.strip()
    .str.replace(" ", "_")
    .str.replace("__", "_")
)

# Remove duplicate columns (important)
df = df.loc[:, ~df.columns.duplicated()]

# 🎯 Split features & target
X = df.drop("prognosis", axis=1)
y = df["prognosis"]

# 🧪 Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 🤖 Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# 📊 Accuracy
accuracy = model.score(X_test, y_test)
print("🔥 Model Accuracy:", accuracy)

# 💾 Save model
pickle.dump(model, open("model/model.pkl", "wb"))

# 💾 Save feature names (VERY IMPORTANT)
pickle.dump(X.columns.tolist(), open("model/features.pkl", "wb"))

print("✅ Model and features saved successfully!")