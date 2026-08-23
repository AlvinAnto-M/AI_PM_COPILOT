from services.copilot import ask_copilot

answer = ask_copilot(
    "Say hello",
    "This is a test."
)

print(answer)