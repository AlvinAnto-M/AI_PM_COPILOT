import os
import json
import pickle

OUTPUT_DIR = "output"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def save_analysis(df, labels, trends, recommendations):
    """
    Save all analysis results to disk.
    """

    # DataFrame
    with open(os.path.join(OUTPUT_DIR, "analysis.pkl"), "wb") as f:
        pickle.dump(df, f)

    # Cluster labels
    with open(os.path.join(OUTPUT_DIR, "cluster_labels.json"), "w") as f:
        json.dump(labels, f, indent=4)

    # Trend analysis
    with open(os.path.join(OUTPUT_DIR, "trends.json"), "w") as f:
        json.dump(trends, f, indent=4)

    # Recommendations
    with open(os.path.join(OUTPUT_DIR, "recommendations.json"), "w") as f:
        json.dump(recommendations, f, indent=4)


def load_analysis():
    """
    Load saved analysis from disk.
    """

    analysis_file = os.path.join(OUTPUT_DIR, "analysis.pkl")

    if not os.path.exists(analysis_file):
        return None, None, None, None

    with open(analysis_file, "rb") as f:
        df = pickle.load(f)

    with open(os.path.join(OUTPUT_DIR, "cluster_labels.json")) as f:
        labels = json.load(f)

    with open(os.path.join(OUTPUT_DIR, "trends.json")) as f:
        trends = json.load(f)

    with open(os.path.join(OUTPUT_DIR, "recommendations.json")) as f:
        recommendations = json.load(f)

    return df, labels, trends, recommendations