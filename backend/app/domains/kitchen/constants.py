"""Kitchen option sets aligned with mobile app."""

INGREDIENT_CATEGORIES = [
    "Proteins",
    "Vegetables",
    "Grains",
    "Dairy",
    "Spices",
]

INGREDIENT_OPTIONS: dict[str, list[str]] = {
    "Proteins": [
        "Chicken",
        "Beef",
        "Eggs",
        "Tofu",
        "Salmon",
        "Shrimp",
        "Lentils",
        "Chickpeas",
    ],
    "Vegetables": [
        "Onion",
        "Garlic",
        "Tomato",
        "Spinach",
        "Carrot",
        "Bell Pepper",
        "Broccoli",
        "Potato",
    ],
    "Grains": [
        "Rice",
        "Pasta",
        "Bread",
        "Oats",
        "Quinoa",
        "Flour",
        "Noodles",
    ],
    "Dairy": [
        "Milk",
        "Butter",
        "Cheese",
        "Yogurt",
        "Cream",
        "Sour Cream",
    ],
    "Spices": [
        "Salt",
        "Pepper",
        "Cumin",
        "Paprika",
        "Turmeric",
        "Oregano",
        "Chili Flakes",
        "Cinnamon",
    ],
}

UTENSIL_IDS = [
    "pan",
    "pot",
    "oven",
    "microwave",
    "air-fryer",
    "blender",
    "knife",
    "cutting-board",
    "wok",
    "steamer",
    "grill",
    "mixer",
    "pressure-cooker",
    "toaster",
    "colander",
    "baking-sheet",
]

DIETARY_IDS = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "dairy-free",
    "halal",
    "kosher",
    "nut-free",
    "low-carb",
]
