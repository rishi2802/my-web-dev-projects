import numpy as np
import joblib
from sklearn.impute import SimpleImputer  # Add this line


# Load the trained model
model_filename = "heart_disease_rf_model.pkl"
clf = joblib.load(model_filename)

# Preprocess the input data
input_data = np.array([[59,1,0,134,204,0,0,162,0,0.8,0,2,0]])
imputer = SimpleImputer(strategy='mean')
input_data_imputed = imputer.fit_transform(input_data)

# Make a prediction
prediction = clf.predict(input_data_imputed)

# Interpret the prediction
if prediction[0] == 0:
    result = "Negative (No Heart Disease)"
else:
    result = "Positive (Heart Disease)"

print("Prediction:", result)
