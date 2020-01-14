
Convert mysql dump to CSV

awk -F ";" '{gsub(/"/, ""); print $1","$2","$3","$4","$5","$6","$7","$8}' sampledata.csv >> sampledata1.csv

convert csv to geojson
http://geojson.io

Run with environment variables
REACT_APP_API_ENDPOINT=http://localhost:8080/v1 npm start