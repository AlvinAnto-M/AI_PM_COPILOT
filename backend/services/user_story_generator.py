import json
import os

from dotenv import load_dotenv
from google import genai


# ============================================================
# Load Environment Variables
# ============================================================

load_dotenv()


# ============================================================
# Gemini API Configuration
# ============================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured. "
        "Please add GEMINI_API_KEY to your backend .env file."
    )


# ============================================================
# Gemini Client
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ============================================================
# Generate User Stories
# ============================================================

def generate_user_stories(
    theme: str,
    feedback: list[str]
):
    """
    Generate user stories and acceptance criteria
    from customer feedback belonging to a cluster.
    """

    # --------------------------------------------------------
    # Prepare Customer Feedback
    # --------------------------------------------------------

    feedback_text = "\n".join(
        f"- {item}"
        for item in feedback
        if item
    )

    # --------------------------------------------------------
    # Product Manager Prompt
    # --------------------------------------------------------

    prompt = f"""
You are an experienced Senior Product Manager.

Your task is to generate user stories and acceptance
criteria based ONLY on the customer feedback provided.

============================================================
CLUSTER THEME
============================================================

{theme}

============================================================
CUSTOMER FEEDBACK
============================================================

{feedback_text}

============================================================
REQUIREMENTS
============================================================

1. Generate 3 to 5 meaningful user stories.

2. Every user story must follow this format:

   As a <type of user>,
   I want <goal>,
   so that <benefit>.

3. Generate 3 to 5 acceptance criteria for every user story.

4. Acceptance criteria must be:
   - Specific
   - Testable
   - Clear
   - Relevant to the user story

5. Use ONLY information supported by the customer feedback.

6. Do not invent unrelated features or problems.

7. Do not make assumptions that are not supported by the
   customer feedback.

8. Focus on the actual customer problem represented by
   this cluster.

9. Avoid technical implementation details.

10. Use professional Product Management language.

11. Do not include explanations outside the JSON response.

============================================================
OUTPUT FORMAT
============================================================

Return ONLY valid JSON.

Use exactly this structure:

{{
    "theme": "{theme}",
    "user_stories": [
        {{
            "id": 1,
            "title": "Short descriptive title",
            "story": "As a <type of user>, I want <goal>, so that <benefit>.",
            "acceptance_criteria": [
                "Given ... When ... Then ...",
                "Given ... When ... Then ...",
                "Given ... When ... Then ..."
            ]
        }}
    ]
}}
"""

    # --------------------------------------------------------
    # Call Gemini
    # --------------------------------------------------------

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # ----------------------------------------------------
        # Validate Response
        # ----------------------------------------------------

        if not response or not response.text:
            raise Exception(
                "Gemini returned an empty response."
            )

        text = response.text.strip()

        # ----------------------------------------------------
        # Remove Markdown JSON Code Fence
        # ----------------------------------------------------

        if text.startswith("```json"):
            text = text[len("```json"):].strip()

        elif text.startswith("```"):
            text = text[len("```"):].strip()

        if text.endswith("```"):
            text = text[:-3].strip()

        # ----------------------------------------------------
        # Parse JSON
        # ----------------------------------------------------

        result = json.loads(text)

        # ----------------------------------------------------
        # Validate Expected Structure
        # ----------------------------------------------------

        if not isinstance(result, dict):
            raise Exception(
                "Gemini response is not a valid JSON object."
            )

        if "user_stories" not in result:
            raise Exception(
                "Gemini response does not contain user_stories."
            )

        if not isinstance(
            result["user_stories"],
            list
        ):
            raise Exception(
                "user_stories must be a list."
            )

        # ----------------------------------------------------
        # Return Structured Result
        # ----------------------------------------------------

        return result

    except json.JSONDecodeError as e:

        raise Exception(
            "Gemini returned invalid JSON. "
            f"Raw response: {text}"
        ) from e

    except Exception as e:

        raise Exception(
            f"User story generation failed: {str(e)}"
        ) from e