import json
from language_processing import find_mean_comments, valence_intensity_meter
from wrap_comments import get_data
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/output", methods=['POST'])
def output():
    text = request.form['text']
    arr = json.loads(text)
    arr = [k.strip() for k in arr]

    list_of_tokens = find_mean_comments(arr)
    return ';'.join(list_of_tokens)


@app.route("/comment", methods=['POST'])
def comment():
    text = request.form['text']
    negativity = int(valence_intensity_meter(text) * 100)
    return str(negativity)


@app.route("/wrap", methods=['GET'])
def wrap():
    data, fb, fb_val, twit, twit_val = get_data()
    print(twit)
    return render_template('index.html', fb_usage=str(data["fb_usage"]) + '%',
                           twit_usage=str(data["twit_usage"]) + '%',
                           fb_1=fb[0], fb_1_val=fb_val[0],
                           fb_2=fb[1], fb_2_val=fb_val[1],
                           fb_3=fb[2], fb_3_val=fb_val[2],
                           fb_4=fb[3], fb_4_val=fb_val[3],
                           fb_5=fb[4], fb_5_val=fb_val[4],
                           twi_1=twit[0], twi_1_val=twit_val[0],
                           twi_2=twit[1], twi_2_val=twit_val[1],
                           twi_3=twit[2], twi_3_val=twit_val[2],
                           twi_4=twit[3], twi_4_val=twit_val[3],
                           twi_5=twit[4], twi_5_val=twit_val[4])


if __name__ == "__main__":
	app.run()