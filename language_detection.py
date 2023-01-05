import fasttext

class LanguageDetection:

    def __init__(self):
        pretrained_detection_model = 'models/language_detection/lid.176.ftz'
        self.model = fasttext.load_model(pretrained_detection_model)

    def predict(self, text):
        prediction = self.model.predict(text, k=1) 
        return prediction 
