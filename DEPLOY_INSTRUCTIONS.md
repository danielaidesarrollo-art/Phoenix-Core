# Deploying Phoenix to Google Cloud Run (Scale-to-Zero)

This guide explains how to deploy Phoenix as a "Scale-to-Zero" container. This means the application will shut down completely when not in use, incurring **zero cost** during idle times.

## Prerequisites

1. **Google Cloud SDK** installed and authenticated (`gcloud auth login`).
2. **Project ID** in Google Cloud.

## Deployment Steps

1. **Enable Services**:
   Ensure Cloud Run and Container Registry/Artifact Registry are enabled.

   ```powershell
   gcloud services enable run.googleapis.com containerregistry.googleapis.com
   ```

2. **Submit Build**:
   This command builds the Docker image remotely and stores it in Google Container Registry (GCR).
   (Replace `YOUR_PROJECT_ID` with your actual GCP Project ID).

   ```powershell
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/phoenix-app .
   ```

3. **Deploy to Cloud Run**:
   This deploys the image. The critical flag is `--min-instances 0`, which enables the zero-cost behavior.

   ```powershell
   gcloud run deploy phoenix-app `
     --image gcr.io/YOUR_PROJECT_ID/phoenix-app `
     --platform managed `
     --region us-central1 `
     --allow-unauthenticated `
     --port 8080 `
     --min-instances 0 `
     --max-instances 5 `
     --memory 512Mi
   ```

## Architecture Notes for Investors

- **Cost Efficiency**: configuration `--min-instances 0` is the key. Google only charges for CPU/Memory *while* a request is being processed.
- **Cold Start**: The first user after a period of inactivity may experience a 3-5 second delay ("Wake up" time). This is the trade-off for zero idle cost.
- **Single Container**: Both the Python Backend and React Frontend are bundled into one unit, simplifying management and versioning.
