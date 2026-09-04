import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


# ============================================================
# 1. LOAD DATA
# ============================================================

DATA_PATH = "data/bengaluru_demand.csv"

df = pd.read_csv(DATA_PATH)

df["date"] = pd.to_datetime(df["date"])

print("Dataset loaded:", df.shape)


# ============================================================
# 2. CREATE TARGET
# ============================================================

# We want to predict NEXT HOUR demand.

df = df.sort_values(
    ["station", "date", "hour"]
)

df["next_hour_demand"] = (
    df.groupby("station")["ridership"]
      .shift(-1)
)

# Remove rows where next hour doesn't exist
df = df.dropna(
    subset=["next_hour_demand"]
)


# ============================================================
# 3. FEATURE ENGINEERING
# ============================================================

# Cyclic hour features
# This helps the model understand that hour 23 and hour 0
# are close to each other.

df["hour_sin"] = np.sin(
    2 * np.pi * df["hour"] / 24
)

df["hour_cos"] = np.cos(
    2 * np.pi * df["hour"] / 24
)


# Cyclic day-of-week features

df["day_sin"] = np.sin(
    2 * np.pi * df["day_of_week"] / 7
)

df["day_cos"] = np.cos(
    2 * np.pi * df["day_of_week"] / 7
)


# Demand momentum

df["demand_change"] = (
    df["ridership"]
    - df["previous_hour_demand"]
)


# Rolling demand
df["rolling_3hr_demand"] = (
    df.groupby("station")["ridership"]
      .transform(
          lambda x: x.rolling(3).mean()
      )
)


df = df.dropna()


# ============================================================
# 4. FEATURES
# ============================================================

features = [
    "hour",
    "day_of_week",
    "is_weekend",
    "is_peak",

    "previous_hour_demand",
    "previous_day_demand",

    "hour_sin",
    "hour_cos",

    "day_sin",
    "day_cos",

    "demand_change",
    "rolling_3hr_demand",

    "station"
]

target = "next_hour_demand"


X = df[features]
y = df[target]


# ============================================================
# 5. TRAIN / TEST SPLIT
# ============================================================

# IMPORTANT:
# Because this is time-series data, we don't randomly shuffle it.

split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]


print("\nTraining rows:", len(X_train))
print("Testing rows:", len(X_test))


# ============================================================
# 6. ENCODE STATION
# ============================================================

categorical_features = ["station"]

numeric_features = [
    "hour",
    "day_of_week",
    "is_weekend",
    "is_peak",
    "previous_hour_demand",
    "previous_day_demand",
    "hour_sin",
    "hour_cos",
    "day_sin",
    "day_cos",
    "demand_change",
    "rolling_3hr_demand"
]


preprocessor = ColumnTransformer(
    transformers=[
        (
            "station",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        )
    ],
    remainder="passthrough"
)


# ============================================================
# 7. RANDOM FOREST MODEL
# ============================================================

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=8,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)


pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ============================================================
# 8. TRAIN
# ============================================================

print("\nTraining Demand Prediction Model...")

pipeline.fit(
    X_train,
    y_train
)


# ============================================================
# 9. EVALUATE
# ============================================================

predictions = pipeline.predict(X_test)

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

r2 = r2_score(
    y_test,
    predictions
)


print("\n==============================")
print("DEMAND MODEL RESULTS")
print("==============================")

print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R²   : {r2:.3f}")


# ============================================================
# 10. SHOW EXAMPLES
# ============================================================

results = X_test.copy()

results["actual_demand"] = y_test.values
results["predicted_demand"] = predictions

results["prediction_error"] = (
    results["actual_demand"]
    - results["predicted_demand"]
)

print("\nSample predictions:")

print(
    results[
        [
            "station",
            "hour",
            "actual_demand",
            "predicted_demand",
            "prediction_error"
        ]
    ].head(15).to_string(index=False)
)


# ============================================================
# 11. SAVE MODEL
# ============================================================

import joblib

MODEL_PATH = "models/demand_model.pkl"

joblib.dump(
    pipeline,
    MODEL_PATH
)

print("\nModel saved to:")
print(MODEL_PATH)