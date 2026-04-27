def generate_first_aid(species, injury_type, severity):
    """
    Improved first aid generation
    """

    injury_type = (injury_type or "").lower()
    severity = (severity or "").lower()

    # 🩺 Injury-based rules
    if "injured" in injury_type:
        if severity == "high":
            steps = [
                "Do NOT move the animal",
                "Apply pressure to stop heavy bleeding",
                "Keep the animal warm and calm",
                "Call emergency rescue immediately"
            ]

        elif severity == "medium":
            steps = [
                "Clean the wound with clean water",
                "Use cloth to control bleeding",
                "Limit animal movement",
                "Contact nearby NGO or vet"
            ]

        else:  # low or unknown
            steps = [
                "Keep the animal calm",
                "Avoid touching injured area",
                "Monitor condition closely",
                "Seek help if condition worsens"
            ]

    elif "healthy" in injury_type:
        steps = [
            "Animal appears safe",
            "Provide food and clean water",
            "Keep in a safe environment",
            "Monitor for any unusual behavior"
        ]

    else:
        # 🔥 fallback (IMPORTANT)
        steps = [
            "Unable to determine exact condition",
            "Avoid handling the animal unnecessarily",
            "Keep it safe and calm",
            "Contact NGO or veterinarian"
        ]

    return {
        "disclaimer": "AI-generated first aid is temporary. Contact a veterinarian or NGO immediately.",
        "steps": steps
    }