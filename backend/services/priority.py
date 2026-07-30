import re
import pandas as pd
from transformers import pipeline

# -----------------------------
# Load Sentiment Analysis Model
# -----------------------------
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)

# -----------------------------
# Critical Keywords
# -----------------------------
HIGH_IMPACT = [
    "payment",
    "refund",
    "security",
    "login",
    "authentication",
    "crash",
    "failed",
    "error",
    "bug",
    "unable",
    "data loss",
    "not working",
]

MEDIUM_IMPACT = [
    "slow",
    "delay",
    "performance",
    "notification",
    "sync",
    "loading",
]

LOW_IMPACT = [
    "theme",
    "dark mode",
    "font",
    "animation",
    "color",
    "ui",
    "design",
]


# -----------------------------
# Keyword Score
# -----------------------------
def keyword_score(text):
    text = text.lower()

    score = 0

    for word in HIGH_IMPACT:
        if word in text:
            score += 40

    for word in MEDIUM_IMPACT:
        if word in text:
            score += 20

    for word in LOW_IMPACT:
        if word in text:
            score += 5

    return min(score, 40)


# -----------------------------
# Sentiment Score
# -----------------------------
def sentiment_score(text):

    result = sentiment_pipeline(text[:512])[0]

    label = result["label"].lower()

    if "negative" in label:
        return 40

    elif "neutral" in label:
        return 20

    else:
        return 5


# -----------------------------
# Frequency Score
# -----------------------------
def frequency_scores(df, cluster_column="cluster"):

    counts = df[cluster_column].value_counts()

    maximum = counts.max()

    scores = {}

    for cluster, count in counts.items():

        scores[cluster] = int((count / maximum) * 20)

    return scores


# -----------------------------
# Compute Priority
# -----------------------------
def compute_priority(df):

    freq_dict = frequency_scores(df)

    priority = []
    score_list = []

    for _, row in df.iterrows():

        feedback = str(row["clean_text"])
        sentiment = sentiment_score(feedback)

        keywords = keyword_score(feedback)

        frequency = freq_dict[row["cluster"]]

        total = sentiment + keywords + frequency

        score_list.append(total)

        if total >= 70:
            priority.append("High")

        elif total >= 40:
            priority.append("Medium")

        else:
            priority.append("Low")

    df["priority"] = priority
    df["priority_score"] = score_list

    return df