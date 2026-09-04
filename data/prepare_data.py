import pandas as pd
import numpy as np
import zipfile


# ============================================================
# FLEETMIND — REAL BENGALURU DATA PREPARATION
# ============================================================

ZIP_PATH = "data/station-hourly.csv.zip"
OUTPUT_PATH = "data/bengaluru_demand.csv"

print("Loading Bengaluru Namma Metro dataset...")


# ============================================================
# 1. LOAD REAL DATA
# ============================================================

with zipfile.ZipFile(ZIP_PATH, "r") as z:

    csv_file = [
        f for f in z.namelist()
        if f.endswith(".csv")
    ][0]

    print("Reading:", csv_file)

    with z.open(csv_file) as f:

        df = pd.read_csv(
            f,
            sep=";",
            engine="python"
        )


print("\nOriginal dataset shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())


# ============================================================
# 2. CLEAN
# ============================================================

df.columns = [
    col.strip().lower()
    for col in df.columns
]

df["date"] = pd.to_datetime(
    df["date"],
    format="%Y-%m-%d"
)

df["hour"] = pd.to_numeric(
    df["hour"],
    errors="coerce"
)

df["ridership"] = pd.to_numeric(
    df["ridership"],
    errors="coerce"
)

df = df.dropna(
    subset=[
        "date",
        "hour",
        "station",
        "ridership"
    ]
)

df = df.sort_values(
    ["station", "date", "hour"]
)


# ============================================================
# 3. SELECT TOP 5 HIGH-ACTIVITY STATIONS
# ============================================================

top_stations = (
    df.groupby("station")["ridership"]
      .sum()
      .sort_values(ascending=False)
      .head(5)
      .index
      .tolist()
)

print("\nSelected Bengaluru mobility zones:")

for station in top_stations:
    print("-", station)


df = df[
    df["station"].isin(top_stations)
].copy()


# ============================================================
# 4. USE 14 DAYS
# ============================================================

start_date = df["date"].min()

end_date = (
    start_date
    + pd.Timedelta(days=13)
)

df = df[
    (df["date"] >= start_date)
    &
    (df["date"] <= end_date)
].copy()


# ============================================================
# 5. TIME FEATURES
# ============================================================

df["day_of_week"] = (
    df["date"].dt.dayofweek
)

df["is_weekend"] = (
    df["day_of_week"] >= 5
).astype(int)

df["is_peak"] = (
    df["hour"].isin(
        [7, 8, 9, 10, 17, 18, 19, 20]
    )
).astype(int)


# ============================================================
# 6. LAG FEATURES
# ============================================================

grouped = df.groupby("station")

df["previous_hour_demand"] = (
    grouped["ridership"]
    .shift(1)
)

df["previous_day_demand"] = (
    grouped["ridership"]
    .shift(24)
)


# ============================================================
# 7. ROLLING DEMAND
# ============================================================

df["rolling_3hr_demand"] = (
    grouped["ridership"]
    .transform(
        lambda x:
        x.rolling(
            window=3,
            min_periods=1
        ).mean()
    )
)


# ============================================================
# 8. DEMAND MOMENTUM
# ============================================================

df["demand_change"] = (
    df["ridership"]
    - df["previous_hour_demand"]
)

df["demand_change"] = (
    df["demand_change"]
    .fillna(0)
)


# ============================================================
# 9. CYCLIC FEATURES
# ============================================================

df["hour_sin"] = np.sin(
    2 * np.pi * df["hour"] / 24
)

df["hour_cos"] = np.cos(
    2 * np.pi * df["hour"] / 24
)

df["day_sin"] = np.sin(
    2 * np.pi * df["day_of_week"] / 7
)

df["day_cos"] = np.cos(
    2 * np.pi * df["day_of_week"] / 7
)


# ============================================================
# 10. CLEAN LAG ROWS
# ============================================================

df = df.dropna(
    subset=[
        "previous_hour_demand",
        "previous_day_demand"
    ]
)


# ============================================================
# 11. SAVE
# ============================================================

df.to_csv(
    OUTPUT_PATH,
    index=False
)


# ============================================================
# 12. SUMMARY
# ============================================================

print("\n========================================")
print("FLEETMIND DATASET READY")
print("========================================")

print(
    "Rows:",
    len(df)
)

print(
    "Columns:",
    len(df.columns)
)

print(
    "Stations:",
    df["station"].nunique()
)

print(
    "Date range:",
    df["date"].min().date(),
    "→",
    df["date"].max().date()
)

print("\nFinal columns:")

for column in df.columns:
    print("-", column)

print("\nSample:")
print(
    df.head(10).to_string(
        index=False
    )
)

print(
    "\nSaved:",
    OUTPUT_PATH
)