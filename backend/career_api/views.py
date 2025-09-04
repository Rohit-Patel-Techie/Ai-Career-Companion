from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .serializers import CareerProfileSerializer, RoadmapSerializer
from .models import CareerProfile, Roadmap
from openai import OpenAI
from rest_framework.permissions import AllowAny, IsAuthenticated
import json
from decouple import config

# 🔐 OpenRouter API Client (env)
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=config("OPENROUTER_API_KEY", default=""),
)

# 🔁 Submit Career Profile + Get AI Suggestions
class CareerSubmitView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = CareerProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
           

            prompt = f"""
You are an AI career advisor. The user has provided their profile below. Based on this, suggest exactly 3 career paths that align with their background, interests, and constraints.

User Profile:
- Full Name: {profile.fullName}
- Email: {profile.email}
- Currently Living: {profile.currentlyLiving}
- Grade/Year: {profile.gradeOrYear}
- Subjects: {profile.subjects}
- Last Class Percentage or CGPA: {profile.lastClassPercentageOrCGPA}
- Current Course: {profile.currentCourse}
- Last Year CGPA: {profile.lastYearCGPA}
- Skills: {profile.skills}
- Interests: {profile.interests}
- Used AI Tool Before: {profile.usedAIToolBefore}
- Experience: {profile.experience}
- Main Goal: {profile.mainGoal}
- Learning Time Available: {profile.learningTime}
- Learning Style: {profile.learningStyle}
- Long-term Career Goal: {profile.longTermCareerGoal}
- Biggest Career Challenge: {profile.biggestCareerChallenge}

Respond only with a valid JSON object using the following structure. Make sure to include labor market data like job demand, salary estimates, industry trends, and future scope.

JSON format:
{{
  "career_paths": [
    {{
      "title": "string",                          // Career title
      "description": "string",                    // Short summary of the role
      "skills": ["string"],                       // List of key tools, languages, or concepts to learn
      "resources": [                              // Free or low-cost, video-based learning resources
        {{
          "name": "string",
          "url": "string"
        }}
      ],
      "icon": "string",                           // Emoji or icon to visually represent the career
      "reason": "string",                         // Why this is a good fit for the user
      "labor_market": {{
        "job_demand": "string",                   // e.g., High, Moderate, Low
        "salary_range": "string",                 // e.g., 5-10 LPA Rupees
        "industry_growth": "string",              // e.g., 'Growing at 12% annually'
        "future_scope": "string"                  // e.g., 'High demand expected for the next decade'
      }}
    }},
    ...
  ]
}}

Do not include any extra text, explanation, or commentary. Only return a valid JSON object as per the structure above.
"""
            # print("prompt : ", prompt)

            try:
                response = client.chat.completions.create(
                    model="deepseek/deepseek-chat-v3-0324:free",
                    messages=[
                        {"role": "system", "content": "You are a professional career guidance assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    extra_headers={
                        "HTTP-Referer": "http://localhost:3000/",
                        "X-Title": "Career Companion"
                    }
                )
                suggestion = response.choices[0].message.content
                print("AI Suggestion:", suggestion)


                # 💾 Save suggestion to profile
                profile.suggestion = suggestion
                profile.save()


                return Response({"success": True, "suggestions": suggestion}, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 📊 Serve Data to Dashboard UI
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    try:
        user = request.user
        profile = CareerProfile.objects.filter(email=user.email).latest('created_at')

        skills_list = profile.skills if isinstance(profile.skills, list) else []

        data = {
            "fullName": profile.fullName,
            "careerSuggestion":     {
                "role": profile.preferredField or "AI/Data Specialist",
                "company": "DataViz Co.",
                "location": "Remote",
                "match": 78,
                "skills": skills_list[:3] if skills_list else ["Python", "Excel", "SQL"]
            },
            "learningPath": [
                {"title": "Python Fundamentals", "status": "completed", "completedOn": "2023-05-15"},
                {"title": "Data Analysis with Python", "status": "in_progress", "progress": 65},
                {"title": "Machine Learning Basics", "status": "not_started"}
            ],
            "recommendedSkills": [
                {"title": "Machine Learning", "tag": "High Demand", "match": 92, "color": "blue"},
                {"title": "Data Visualization", "tag": "Trending", "match": 85, "color": "purple"},
                {"title": "Cloud Computing", "tag": "Career Boost", "match": 78, "color": "green"}
            ],
            "currentSkills": skills_list,
            "learningStats": {
                "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
                "learningHours": [2, 4, 6, 8],
                "skillsMastered": [1, 2, 3, 4]
            },
            "suggestion": profile.suggestion or "No suggestion yet."
        }

        return Response(data)

    except CareerProfile.DoesNotExist:
        return Response({"error": "No profile found."}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    try:
        profile = CareerProfile.objects.filter(email=user.email).latest('created_at')
    except CareerProfile.DoesNotExist:
        profile = None

    data = {
        "username": user.username,
        "email": user.email,
        "fullName": profile.fullName if profile else "",
        "currentlyLiving": profile.currentlyLiving if profile else "",
        "gradeOrYear": profile.gradeOrYear if profile else "",
        "subjects": profile.subjects if profile else [],
        "lastClassPercentageOrCGPA": profile.lastClassPercentageOrCGPA if profile else "",
        "currentCourse": profile.currentCourse if profile else "",
        "lastYearCGPA": profile.lastYearCGPA if profile else "",
        "experience": profile.experience if profile else "",
        "skills": profile.skills if profile else [],
        "interests": profile.interests if profile else [],
        "usedAIToolBefore": profile.usedAIToolBefore if profile else "",
        "mainGoal": profile.mainGoal if profile else "",
        "learningTime": profile.learningTime if profile else "",
        "learningStyle": profile.learningStyle if profile else "",
        "longTermCareerGoal": profile.longTermCareerGoal if profile else "",
        "biggestCareerChallenge": profile.biggestCareerChallenge if profile else "",
    }
    return Response(data)


class GenerateRoadmapView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        career = request.data.get('career')
        if not career or not isinstance(career, dict):
            return Response({"error": "Missing or invalid 'career' payload."}, status=400)

        # Load latest user profile if exists (optional but helps prompt quality)
        profile = CareerProfile.objects.filter(email=user.email).order_by('-created_at').first()
        profile_snapshot = None
        if profile:
            profile_snapshot = {
                "fullName": profile.fullName,
                "email": profile.email,
                "currentlyLiving": profile.currentlyLiving,
                "gradeOrYear": profile.gradeOrYear,
                "subjects": profile.subjects,
                "lastClassPercentageOrCGPA": profile.lastClassPercentageOrCGPA,
                "currentCourse": profile.currentCourse,
                "lastYearCGPA": profile.lastYearCGPA,
                "skills": profile.skills,
                "interests": profile.interests,
                "usedAIToolBefore": profile.usedAIToolBefore,
                "experience": profile.experience,
                "mainGoal": profile.mainGoal,
                "learningTime": profile.learningTime,
                "learningStyle": profile.learningStyle,
                "longTermCareerGoal": profile.longTermCareerGoal,
                "biggestCareerChallenge": profile.biggestCareerChallenge,
            }

        base_title = career.get('title') or 'Career Roadmap'
        # Strict JSON-only roadmap schema
        schema_hint = json.dumps({
            "title": "string",
            "overview": "string",
            "duration_weeks": 16,
            "prerequisites": ["string"],
            "skills_to_master": ["string"],
            "phases": [
                {
                    "name": "string",
                    "weeks": [
                        {
                            "week": 1,
                            "focus": "string",
                            "topics": ["string"],
                            "resources": [
                                {"name": "string", "type": "video", "url": "string", "free": True}
                            ],
                            "hands_on": [
                                {"task": "string", "est_hours": 6}
                            ],
                            "milestone": "string",
                            "assessment": "string"
                        }
                    ]
                }
            ],
            "projects": [
                {"name": "string", "description": "string", "deliverables": ["string"]}
            ],
            "interview_prep": {"topics": ["string"], "resources": [{"name": "string", "url": "string"}]},
            "next_steps": ["string"],
            "estimated_outcomes": ["string"]
        }, indent=2)

        # Build prompt
        prompt = f"""
You are an AI career roadmap generator. Create a realistic, step-by-step, weekly learning roadmap with projects and assessments. Output must be STRICT JSON matching the schema below. Do not include backticks or extra commentary. No markdown.

USER PROFILE SNAPSHOT (may be empty):\n{json.dumps(profile_snapshot, ensure_ascii=False)}
SELECTED CAREER INPUT:\n{json.dumps(career, ensure_ascii=False)}

RESPONSE JSON SCHEMA (example values only, follow structure):
{schema_hint}
"""

        if not client.api_key:
            return Response({"error": "Missing OpenRouter API key. Set OPENROUTER_API_KEY in environment."}, status=500)

        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-chat-v3-0324:free",
                messages=[
                    {"role": "system", "content": "You are an expert roadmap planner. Output only valid JSON that matches the provided schema."},
                    {"role": "user", "content": prompt},
                ],
                extra_headers={
                    "HTTP-Referer": "http://localhost:3000/",
                    "X-Title": "Career Companion"
                }
            )
            raw = response.choices[0].message.content

            # Try parse JSON; if model wrapped in code-fences, strip them
            cleaned = raw.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.strip('`')
                if cleaned.startswith("json"):
                    cleaned = cleaned[4:]
                cleaned = cleaned.strip()

            roadmap_json = json.loads(cleaned)
        except Exception as e:
            return Response({"error": f"Roadmap generation failed: {str(e)}"}, status=500)

        # Persist roadmap
        roadmap = Roadmap.objects.create(
            user=user,
            title=roadmap_json.get('title', base_title),
            career_input=career,
            profile_snapshot=profile_snapshot,
            prompt=prompt,
            model="deepseek/deepseek-chat-v3-0324:free",
            status='generated',
            content=roadmap_json,
        )

        data = RoadmapSerializer(roadmap).data
        return Response(data, status=200)


class RoadmapDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, short_id: int):
        user = request.user
        try:
            roadmap = Roadmap.objects.get(id=short_id, user=user)
        except Roadmap.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        return Response(RoadmapSerializer(roadmap).data, status=200)

    def patch(self, request, short_id: int):
        """
        Persist progress state into roadmap.content["progress"].
        Accepts either:
          - {"key": "some-id", "value": true}
          - {"state": {"id1": true, "id2": false}}
        Returns: {"progress": { ... }}
        """
        user = request.user
        try:
            roadmap = Roadmap.objects.get(id=short_id, user=user)
        except Roadmap.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        payload = request.data or {}
        key = payload.get("key")
        value = payload.get("value")
        bulk_state = payload.get("state")

        content = roadmap.content or {}
        progress = content.get("progress")
        if not isinstance(progress, dict):
            progress = {}

        if isinstance(bulk_state, dict):
            # Merge bulk updates
            for k, v in bulk_state.items():
                if isinstance(v, bool):
                    progress[str(k)] = v
        elif isinstance(key, str) and isinstance(value, bool):
            progress[key] = value
        else:
            return Response({"error": "Invalid payload"}, status=400)

        content["progress"] = progress
        roadmap.content = content
        roadmap.save(update_fields=["content"]) 

        return Response({"progress": progress}, status=200)
