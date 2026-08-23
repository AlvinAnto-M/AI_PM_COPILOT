import pandas as pd

from .preprocessing import preprocess_dataframe
from .embedding import generate_embeddings
from .clustering import train_kmeans, save_model
from .themes import extract_themes
from .priority import compute_priority
from .trend import generate_trend_analysis
from . import storage


def analyze_feedback(df: pd.DataFrame):
    """
    Run the complete AI Product Manager analysis pipeline.
    """

    # ---------------------------------
    # Preprocessing
    # ---------------------------------

    df = preprocess_dataframe(df)

    # ---------------------------------
    # Embeddings
    # ---------------------------------

    embeddings = generate_embeddings(
        df["clean_text"].tolist()
    )

    # ---------------------------------
    # Clustering
    # ---------------------------------

    model, labels = train_kmeans(embeddings)

    save_model(model)

    # Make sure every feedback row receives
    # exactly one cluster label.
    df["cluster"] = labels

    # ---------------------------------
    # Themes
    # ---------------------------------

    df, theme_labels = extract_themes(df)

    # ---------------------------------
    # AI Priority Prediction
    # ---------------------------------

    df = compute_priority(df)

    # ---------------------------------
    # Trend Analysis
    # ---------------------------------

    trends = generate_trend_analysis(df)

    # ---------------------------------
    # IMPORTANT:
    # Save ACTUAL cluster assignment
    # for every feedback record.
    # ---------------------------------

    cluster_labels = (
        df["cluster"]
        .astype(int)
        .tolist()
    )

    # ---------------------------------
    # Store Analysis
    # ---------------------------------

    storage.save_analysis(
        df=df,
        labels=cluster_labels,
        trends=trends,
        recommendations={}
    )

    # ---------------------------------
    # Return Summary
    # ---------------------------------

    return {
        "message": "Dataset analyzed successfully",

        "total_feedback": int(len(df)),

        "total_clusters": int(
            df["cluster"].nunique()
        ),

        "total_themes": int(
            df["theme"].nunique()
        )
    }