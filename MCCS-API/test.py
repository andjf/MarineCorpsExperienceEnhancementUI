import requests

# Define the URL of the FastAPI server
url = 'http://localhost:8000/query/'

# Define the action you want to send in the request body
action = "What 5 commands cause the most shrink?"


# Send the POST request
response = requests.post(url, json=action)

# Print the response status code and content
print("Response Status Code:", response.status_code)
print("Response Content:", response.json())