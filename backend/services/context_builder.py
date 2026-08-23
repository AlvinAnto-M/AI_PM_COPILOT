import pandas as pd


def build_context(
    df,
    cluster_labels,
    trends,
    recommendations
):
    """
    Build Product Manager context for Gemini.
    """

    context = []

    context.append(
        "You are an expert AI Product Manager."
    )

    context.append("\n===== DATASET SUMMARY =====")

    context.append(
        f"Total Feedback: {len(df)}"
    )

    context.append(
        f"Clusters: {df['cluster'].nunique()}"
    )

    context.append(
        f"Themes: {df['theme'].nunique()}"
    )

    context.append("\n===== TOP THEMES =====")

    top_themes = (
        df["theme"]
        .value_counts()
        .head(10)
    )

    for theme, count in top_themes.items():

        context.append(
            f"{theme} ({count})"
        )

    context.append("\n===== HIGH PRIORITY ISSUES =====")

    high = (
        df[df["priority"] == "High"]
        .head(10)
    )

    for _, row in high.iterrows():

        context.append(
            f"- {row['issue_description']}"
        )

    context.append("\n===== PRODUCTS =====")

    products = (
        df["product"]
        .value_counts()
        .head(10)
    )

    for product, count in products.items():

        context.append(
            f"{product} ({count})"
        )

    context.append("\n===== TREND ANALYSIS =====")

    context.append(str(trends))

    context.append("\n===== RECOMMENDATIONS =====")

    context.append(str(recommendations))

    return "\n".join(context)