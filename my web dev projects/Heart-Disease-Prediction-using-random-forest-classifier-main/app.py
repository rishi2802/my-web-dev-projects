from flask import Flask, render_template, request, redirect, url_for
import joblib
import numpy as np
from sklearn.impute import SimpleImputer

app = Flask(__name__, template_folder='templates', static_url_path='/static', static_folder='static')

# Load the trained model
model = joblib.load('heart_disease_rf_model.pkl')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = [float(x) for x in request.form.values()]

        # Preprocess the input data
        imputer = SimpleImputer(strategy='mean')
        features = np.array(data).reshape(1, -1)
        features_imputed = imputer.fit_transform(features)

        prediction = model.predict(features_imputed)
        if prediction[0] == 0:
            return redirect(url_for('negative_result_page'))
        else:
            return redirect(url_for('positive_result_page'))
    except Exception as e:
        return str(e)

@app.route('/negative_result', methods=['GET'])
def negative_result_page():
    return render_template('negative_result.html')

@app.route('/positive_result', methods=['GET'])
def positive_result_page():
    return render_template('positive_result.html')

@app.route('/prediction_form', methods=['GET'])
def prediction_form():
    return render_template('prediction_form.html')

@app.route('/back', methods=['POST'])
def back():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
