import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()


async def seed_education_data():
    """Seed educational modules into database"""
    client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
    db = client[os.getenv("DATABASE_NAME", "finzen")]

    # Modules
    modules = [
        {
            "title": "What is Investing?",
            "description": "Learn the fundamentals of investing and why it matters",
            "content": "What is Investing?Investing is putting your money into assets...",
            "difficulty": "beginner",
            "duration_minutes": 15,
            "learning_outcomes": [
                "Understand investing basics",
                "Learn about risk vs reward",
                "Know why start early",
            ],
            "order": 1,
        },
        {
            "title": "Types of Investments",
            "description": "Explore mutual funds, stocks, ETFs, and bonds",
            "content": "Types of InvestmentsThere are many ways to invest...",
            "difficulty": "beginner",
            "duration_minutes": 20,
            "learning_outcomes": ["Mutual funds explained", "ETFs vs stocks", "Bond basics"],
            "order": 2,
        },
        {
            "title": "Building Your Portfolio",
            "description": "Create a diversified investment portfolio",
            "content": "Portfolio AllocationDiversification is key...",
            "difficulty": "intermediate",
            "duration_minutes": 25,
            "learning_outcomes": [
                "Asset allocation",
                "Diversification benefits",
                "Rebalancing strategy",
            ],
            "order": 3,
        },
    ]

    # Insert modules
    module_results = await db.education_modules.insert_many(modules)
    print(f"✅ Inserted {len(module_results.inserted_ids)} modules")

    # Quizzes for each module
    quizzes = [
        {
            "module_id": module_results.inserted_ids[0],
            "questions": [
                {
                    "question": "What is the primary reason to invest?",
                    "options": [
                        "To get rich quick",
                        "To build wealth over time",
                        "To gamble money",
                        "No real reason",
                    ],
                    "correct_answer": 1,
                },
                {
                    "question": "What is the relationship between risk and reward?",
                    "options": [
                        "Higher risk, lower reward",
                        "No relationship",
                        "Higher risk, potentially higher reward",
                        "Risk doesn't matter",
                    ],
                    "correct_answer": 2,
                },
            ],
            "passing_score": 70,
        },
        {
            "module_id": module_results.inserted_ids[1],
            "questions": [
                {
                    "question": "What is a Mutual Fund?",
                    "options": [
                        "A type of stock",
                        "A pooled investment managed by professionals",
                        "A government bond",
                        "A savings account",
                    ],
                    "correct_answer": 1,
                }
            ],
            "passing_score": 70,
        },
    ]

    quiz_results = await db.quizzes.insert_many(quizzes)
    print(f"✅ Inserted {len(quiz_results.inserted_ids)} quizzes")

    # Update modules with quiz references
    for i, module_id in enumerate(module_results.inserted_ids[: len(quiz_results.inserted_ids)]):
        await db.education_modules.update_one(
            {"_id": module_id}, {"$set": {"quiz_id": quiz_results.inserted_ids[i]}}
        )

    client.close()


if __name__ == "__main__":
    asyncio.run(seed_education_data())
