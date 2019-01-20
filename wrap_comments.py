import string
import tweepy as tweepy
import facebook
import nltk
from nltk.corpus import stopwords
from textblob import TextBlob

ID = 429533649


def get_twitter_comments(id):
    CONSUMER_KEY = '4aGEzpgGbaBPsxOJX0cCEmj5y'
    CONSUMER_SECRET = 'WQ02CnN2Q351aM2hQF85eZBBFfRgKXdkVZIGBNzNMlsfF4toq0'
    OAUTH_TOKEN = '429533649-21FyLeH3KI8Gif5O1AwyUK6xn31sXRd22eWG9wv2'
    OAUTH_TOKEN_SECRET = 'folgRGdgKPL6OxUY72BizajNOdp7v5dE1N42aSKMSWQhj'

    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
    api = tweepy.API(auth)

    tweet = api.user_timeline(id=id)
    result = {}  # output as json
    result["length"] = len(tweet)
    all_tokens = []
    stop_words = set(stopwords.words('english'))
    punctuation = set(string.punctuation)
    punctuation.add('``')
    for t in tweet:
        if 'RT' not in t.text:   # exclude retweets
            word_tokens = nltk.word_tokenize(t.text)
            filtered_sentence = [w.lower() for w in word_tokens if not (w in stop_words or w in punctuation or len(w) <= 1 or "http" in w)]
            all_tokens += filtered_sentence
    token_frequency = {}

    for token in all_tokens:
        if token in token_frequency:
            token_frequency[token] += 1
        else:
            token_frequency[token] = 1

    result["tokens"] = all_tokens
    result["all_posts"] = [t.text for t in tweet]
    result["top_five"] = [(k, token_frequency[k]) for k in sorted(token_frequency, key=token_frequency.get, reverse=True)][:5]
    result["token_frequency"] = token_frequency

    sentiment = []
    for post in result["all_posts"]:
        sentiment.append(TextBlob(post).sentiment)
    polarity = [k.polarity for k in sentiment]
    subjectivity = [k.subjectivity for k in sentiment]
    polarity = sum(polarity) / len(polarity)
    subjectivity = sum(subjectivity) / len(subjectivity)

    result["polarity"] = (polarity + 1) / 2
    result["subjectivity"] = subjectivity
    result["sentiment"] = sentiment
    print(result["polarity"], subjectivity)
    return result


def get_facebook_comments():
    access_token = "EAACAVjsVZAZAsBAHNa1IB8ik5rEx3cFv3r3MgDLnC6QE2gK9jxxLPyHzlTggW57SCczhQWT3xon2FYHjNZA6JxfL2oLRHT2pYYaYzBwHgegbCjyKtWstmVwU47gxZB1YF96QxGVSLZALGOrs9tS5PtAbYSByFYfL3k6hpI8Y7FgZDZD"
    graph = facebook.GraphAPI(access_token=access_token)
    events = graph.request('/me/feed')
    result = {}  # output as json
    result["length"] = len(events["data"])
    all_tokens = []
    stop_words = set(stopwords.words('english'))
    punctuation = set(string.punctuation)
    for e in events["data"]:
        if "message" in e.keys():
            text = e["message"]
            word_tokens = nltk.word_tokenize(text)
            filtered_sentence = [w.lower() for w in word_tokens if not (w in stop_words or w in punctuation or len(w) <= 1)]
            all_tokens += filtered_sentence
    result["tokens"] = all_tokens
    result["all_posts"] = events["data"]
    token_frequency = {}

    for token in all_tokens:
        if token in token_frequency:
            token_frequency[token] += 1
        else:
            token_frequency[token] = 1

    result["top_five"] = [(k, token_frequency[k]) for k in sorted(token_frequency, key=token_frequency.get, reverse=True)][:5]
    result["token_frequency"] = token_frequency
    sentiment = []
    for post in result["all_posts"]:
        if "message" in post.keys():
            sentiment.append(TextBlob(post["message"]).sentiment)
    polarity = [k.polarity for k in sentiment]
    subjectivity = [k.subjectivity for k in sentiment]
    polarity = sum(polarity) / len(polarity)
    subjectivity = sum(subjectivity) / len(subjectivity)

    result["polarity"] = (polarity + 1) / 2
    result["subjectivity"] = subjectivity
    result["sentiment"] = sentiment
    print(result["polarity"], subjectivity)

    return result


def get_data():
    twit = get_twitter_comments(ID)
    fb = get_facebook_comments()
    result = {}
    result["mean_polarity"] = int((twit["polarity"] + fb["polarity"]) / 2 * 100)
    result["mean_subjectivity"] = int((twit["subjectivity"] + fb["subjectivity"]) / 2 * 100)
    total_usage = twit["length"] + fb["length"]
    result["twit_usage"] = int(twit["length"] / total_usage * 100)
    result["fb_usage"] = int(fb["length"] / total_usage * 100)
    # result["fb_top_five"] = [k[0] for k in fb["top_five"]]
    # result["fb_top_five_val"] = [k[1] for k in fb["top_five"]]
    # result["twit_top_five"] = [k[0] for k in twit["top_five"]]
    # result["twit_top_five_val"] = [k[1] for k in twit["top_five"]]
    return result, [k[0] for k in fb["top_five"]], [k[1] for k in fb["top_five"]], [k[0] for k in twit["top_five"]], [k[1] for k in twit["top_five"]]


if __name__ == "__main__":
    # get_twitter_comments(ID)
    # get_facebook_comments()
    print(get_data())