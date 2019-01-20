import re
import string
from nltk.sentiment.vader import SentimentIntensityAnalyzer

def valence_intensity_meter(sentence):
    analyser = SentimentIntensityAnalyzer()
    # Compute compound score from sentiment analysis including punctuation in the sentence
    snt = analyser.polarity_scores(sentence)
    compound_score = snt["compound"]

    # Compute compound score from sentiment analysis excluding punctuation in the sentence
    sentence = re.sub('[' + string.punctuation + ']', '', sentence)
    snt_striped = analyser.polarity_scores(sentence)
    compound_score_striped = snt_striped["compound"]

    # Compare the scores to check for contradiction, convert the score into 0-1 for negative valence score(compound)
    if compound_score_striped <= 0 and compound_score >=0 :
        compounded_neg_score = compound_score_striped
        compounded_neg_score = 0 - compounded_neg_score

    elif compound_score > 0 and compound_score_striped > 0:
        compounded_neg_score = 0

    else:
        compounded_neg_score = 0 - compound_score

    return compounded_neg_score


if __name__ == "__main__":
    sentence = 'You are such an ugly person!'
    print(valence_intensity_meter(sentence))