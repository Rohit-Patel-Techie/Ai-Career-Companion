from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import CareerProfileSerializer
from .models import CareerProfile
from openai import OpenAI

# 🔐 OpenRouter API Client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
)

# 🔁 Submit Career Profile + Get AI Suggestions
class CareerSubmitView(APIView):
    def post(self, request):
        serializer = CareerProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()

            prompt = f"""
The user has the following profile:
- Full Name: {profile.fullName}
- Email: {profile.email}
- Education: {profile.education}
- Experience: {profile.experience}
- Skills: {profile.skills}
- Interests: {profile.interests}
- Goals: {profile.goals}
- Preferred Field: {profile.preferredField}
- Learning Style: {profile.learningStyle}
- Challenges: {profile.challenges}

Based on this, suggest 2 suitable career paths and the skills/tools required.
"""

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

                # 💾 Save suggestion to profile
                profile.suggestion = suggestion
                profile.save()

                return Response({"success": True, "suggestions": suggestion}, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 📊 Serve Data to Dashboard UI
@api_view(['GET'])
def dashboard_data(request):
    try:
        profile = CareerProfile.objects.latest('created_at')

        skills_list = profile.skills if isinstance(profile.skills, list) else []

        data = {
            "fullName": profile.fullName,
            "careerSuggestion": {
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