from flask import Flask, request
from language_detection import LanguageDetection
from sentiment_score import SentimentScore
import requests
import json
app = Flask(__name__)

LANGUAGE_DETECTION = LanguageDetection()
SENTIMENT_SCORE = SentimentScore()

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
    prediction = SENTIMENT_SCORE.predict(tweet_text)
    score = {}
    for i in range(3):
        score[prediction[0][i]] = prediction[1][i]
    
    result = {
        'tweet_text': tweet_text, 
        'sentiment_score': {
            'positive': score['__label__POSITIVE'],
            'neutral': score['__label__NEUTRAL'],
            'negative': score['__label__NEGATIVE']
        },
        'detected_mood': prediction[0][0].split('_')[-1]
    }
    return json.dumps(result, ensure_ascii=False)

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)