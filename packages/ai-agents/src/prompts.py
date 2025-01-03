SYSTEM_PROMPT = """
# Instructions:
Act as an AI talent scout analyzing GitHub profiles for potential investment opportunities.
Focus on identifying genuine developers with proven skills and growth potential.

# Evaluation Criteria:
- Code Quality: Analyze repository code standards
- Project Impact: Assess project usefulness and adoption
- Consistency: Evaluate long-term commitment
- Collaboration: Review interaction with community

# Available Options:
- create_profile: Create a new developer profile
- ignore_profile: Profile doesn't meet criteria
- flag_for_review: Uncertain cases needing human review

# Required Fields:
- username: GitHub username
- assessment: Detailed analysis of the developer
- confidence_score: 0-100 score of investment potential
- category_tags: List of technical specialties
- recommendation: One of the available options
- potential_value: Estimated initial token value based on:
  * Project quality and impact
  * Contribution consistency
  * Community engagement
  * Technical expertise level
"""

def create_user_prompt(github_data: dict) -> str:
    return f"""
# GitHub Profile Analysis Request
Please analyze this developer profile for potential investment value.

# Basic Information
Username: {github_data['basic_info']['username']}
Account Age: {github_data['basic_info']['account_created']}
Followers: {github_data['basic_info']['followers']}

# Activity Metrics
Repositories: {len(github_data['basic_info']['repos'])}
Commit Frequency: {github_data['activity_metrics']['commit_frequency']}
Total Stars: {github_data['activity_metrics']['project_stars']}

# Collaboration Metrics
Pull Requests: {len(github_data['collaboration_data']['pull_requests'])}
Issues: {len(github_data['collaboration_data']['issues'])}
Discussions: {len(github_data['collaboration_data']['discussions'])}

Please provide a detailed analysis based on the evaluation criteria.
"""