from flask import Flask, request
from language_detection import LanguageDetection
from sentiment_score import SentimentScore
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

LANGUAGE_DETECTION = LanguageDetection()
SENTIMENT_SCORE = SentimentScore()


@app.route('/api/language-detection',methods=['POST'])
def language_detection():
    data = request.json
    result = []
    for res in data:
        tweet_text = res['tweet_text']
        tweet_text_replaced = tweet_text.replace('\n', ' ')
        if tweet_text_replaced == None:
            return json.dumps({
                'tweet_text': None, 
                'sentiment_score': None,
                'detected_mood': None
            }, ensure_ascii=False) 
        lang = LANGUAGE_DETECTION.predict(tweet_text_replaced)
        is_english = False
        if lang[0][0] == '__label__en':
            is_english = True
        result.append({
            "tweet_text": tweet_text, 
            "is_english": is_english
        })
    return json.dumps(result, ensure_ascii=False)

@app.route('/api/sentiment-score',methods=['POST'])
def sentiment_score():
    data = request.json
    result = []
    for res in data:
        tweet_text = res['tweet_text']
        tweet_text_replaced = tweet_text.replace('\n', ' ')
        if tweet_text_replaced == None:
            return json.dumps({
                'tweet_text': None, 
                'sentiment_score': None,
                'detected_mood': None
            }, ensure_ascii=False) 
        prediction = SENTIMENT_SCORE.predict(tweet_text_replaced)
        score = {}
        for i in range(3):
            score[prediction[0][i]] = prediction[1][i]
        result.append({
            'tweet_text': tweet_text, 
            'sentiment_score': {
                'positive': score['__label__POSITIVE'],
                'neutral': score['__label__NEUTRAL'],
                'negative': score['__label__NEGATIVE']
            },
            'detected_mood': prediction[0][0].split('_')[-1]
        })
    return json.dumps(result, ensure_ascii=False)

if __name__ == "__main__":
    # if running server locally in port 8080
    app.run(host='127.0.0.1', port=8080, debug=True)