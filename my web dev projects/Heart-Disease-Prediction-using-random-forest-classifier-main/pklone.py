import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
import joblib

# Load the dataset
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
column_names = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal", "target"]
data = pd.read_csv(url, names=column_names)

# Replace '?' with NaN
data.replace('?', float('nan'), inplace=True)

# Splitting features and target
X = data.drop("target", axis=1)
y = data["target"]

# Splitting the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Impute missing values
imputer = SimpleImputer(strategy='mean')
X_train_imputed = imputer.fit_transform(X_train)
X_test_imputed = imputer.transform(X_test)

# Create a RandomForestClassifier
clf = RandomForestClassifier(n_estimators=100, random_state=42)

# Train the classifier on the training data
clf.fit(X_train_imputed, y_train)

# Evaluate the model on the testing data (optional)
accuracy = clf.score(X_test_imputed, y_test)
print("Accuracy:", accuracy)

# Save the trained model as a .pkl file
model_filename = "heart_disease_rf_model.pkl"
joblib.dump(clf, model_filename)
print("Model saved as", model_filename)
