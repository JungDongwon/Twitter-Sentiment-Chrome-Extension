import fasttext

class SentimentScore:

    def __init__(self):
        pretrained_sentiment_model = 'models/sentiment_score/model-en.ftz'
        self.model = fasttext.load_model(pretrained_sentiment_model)

    def predict(self, text):
        prediction = self.model.predict(text, k=3) 
        return prediction 
