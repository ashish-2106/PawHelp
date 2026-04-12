def generate_first_aid(species, injury_type, severity):
    """
    AI-generated first aid instructions
    """

    rules = {
        "low": [
            "Keep the animal calm",
            "Avoid touching the injured area",
            "Monitor condition closely"
        ],
        "medium": [
            "Use clean cloth to control bleeding",
            "Do not apply home remedies",
            "Limit animal movement",
            "Contact nearby NGO immediately"
        ],
        "high": [
            "Do NOT move the animal",
            "Control bleeding if possible",
            "Call emergency rescue immediately"
        ]
    }

    return {
        "disclaimer": "AI-generated first aid is temporary. Contact a veterinarian or NGO immediately.",
        "steps": rules.get(severity, [])
    }
