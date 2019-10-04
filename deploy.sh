set -e

gcloud beta run deploy nsc \
  --project x-cycling-251008 \
  --quiet \
  --platform managed \
  --allow-unauthenticated \
  --region europe-west1 \
  --image gcr.io/x-cycling-251008/nsc:$TAG

