import re
import string
from nltk.sentiment.vader import SentimentIntensityAnalyzer


def find_mean_comments(list_of_texts):
    result = []
    sid = SentimentIntensityAnalyzer()
    epsilon = -0.1
    for text in list_of_texts:
        print(text)
        # blob = TextBlob(text)
        # print(blob.sentiment)
        ss = sid.polarity_scores(text)
        for k in sorted(ss):
            print('{0}: {1}, '.format(k, ss[k]), end='')
            print()
        print()

        if ss["compound"] < -0.5 or (ss["compound"] < 0 and ss["neg"] - ss["neu"] > epsilon):
            text = re.sub("@.+", "", text)
            result.append(text)

    print(result)
    return result


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

    print(sentence)
    print("negativity - ", compounded_neg_score)
    return compounded_neg_score


if __name__ == "__main__":
    list_of_texts = []