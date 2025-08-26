from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .serializers import CareerProfileSerializer
from .models import CareerProfile
from openai import OpenAI
from rest_framework.permissions import AllowAny, IsAuthenticated

# 🔐 OpenRouter API Client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
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
