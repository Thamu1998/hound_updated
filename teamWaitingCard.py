import http.client
import json
import sys
import datetime

conn = http.client.HTTPSConnection("sap.webhook.office.com")

payload = json.dumps({
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "contentUrl": None,
      "content": {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.3",
        "body": [
          {
            "speak": "Jenkins",
            "type": "ColumnSet",
            "columns": [
              {
                "type": "Column",
                "width": 2,
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Hound Deployment Status",
                    "weight": "Bolder",
                    "size": "Large",
                    "spacing": "None",
                    "wrap": True
                  },
                  {
                    "type": "TextBlock",
                    "$when": "${aggregateRating.ratingValue <= 1}",
                    "text": datetime.datetime.now().ctime(),
                    "isSubtle": True,
                    "spacing": "None",
                    "wrap": True,
                    "color": "Accent"
                  },
                  {
                    "type": "TextBlock",
                    "text": "Build No: {0}".format(sys.argv[1]),
                    "isSubtle": "true",
                    "weight": "Lighter",
                    "wrap": "true"
                  },
                  {
                    "type": "TextBlock",
                    "text": "Status: Waiting for confirmation",
                    "wrap": "true",
                    "size": "Medium",
                    "weight": "Lighter",
                    "color": "Warning"
                  },
                  {
                    "type": "TextBlock",
                    "text": "Stage: Production",
                    "weight": "Lighter",
                    "wrap": "true",
                    "size": "Medium",
                    "color": "Warning"
                  },
                  {
                    "type": "Container"
                  },
                  {
                    "type": "TextBlock",
                    "size": "Medium",
                    "wrap": True,
                    "maxLines": 3,
                    "text": "Jenkins pipeline needs your input/confirmation to proceed further."
                  }
                ]
              },
              {
                "type": "Column",
                "width": 1,
                "items": [
                  {
                    "type": "Image",
                    "url": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg",
                    "size": "auto"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ]
})
headers = {
  'Content-Type': 'application/json'
}
conn.request("POST", "/webhookb2/c3c30086-a37c-40a7-b491-81523ce05bc8@42f7676c-f455-423c-82f6-dc2d99791af7/IncomingWebhook/232b9cdb266e4b02a6625f54cd51de03/c2f39887-ffa1-4ca0-9aeb-34916624a5f7", payload, headers)
conn.getresponse()