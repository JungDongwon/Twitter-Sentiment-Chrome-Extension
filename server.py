from flask import Flask, request
from language_detection import LanguageDetection
import requests
import json
app = Flask(__name__)

LANGUAGE_DETECTION = LanguageDetection()

@app.route('/api/language-detection',methods=['POST'])
def language_detection():
    tweet_text = request.form.get('tweet_text')
    lang = LANGUAGE_DETECTION.predict(tweet_text)
    is_english = False
    if lang[0][0] == '__label__en':
        is_english = True
    result = {
        'tweet_text': tweet_text, 
        'is_english': is_english
    }
    return json.dumps(result, ensure_ascii=False)

@app.route('/api/sentiment-score',methods=['POST'])
def sentiment_score():
    tweet_text = request.form.get('tweet_text')
    result = {
        'tweet_text': tweet_text, 
        'sentiment_score': {
            'positive': 0.0,
            'neutral': 0.0,
            'negative': 0.0
        },
        'detected_mood': 'NEUTRAL'
    }
    return json.dumps(result, ensure_ascii=False)

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)