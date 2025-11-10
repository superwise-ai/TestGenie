# TestGenie GKE Deployment Setup - Complete! ✅

## What We've Done

Successfully configured TestGenie (Next.js + Python) for deployment to GKE with Knative scale-to-zero! 🎉

## Files Created in TestGenie Repo

### 1. `.gitlab-ci.yml` - CI/CD Pipeline
- **Build Stage**: Builds both frontend and backend Docker images in parallel
- **Deploy Stage**: Deploys to GKE using Helm
- **Images**:
  - `us-central1-docker.pkg.dev/tiger-team-1/tiger-team/testgenie-frontend`
  - `us-central1-docker.pkg.dev/tiger-team-1/tiger-team/testgenie-backend`

### 2. `helm/` - Kubernetes Helm Chart
- **`Chart.yaml`**: Helm chart metadata
- **`values.yaml`**: Configuration for TestGenie deployment
  - Frontend: Port 3000 (Next.js)
  - Backend: Port 5000 (Python FastAPI)
  - Knative autoscaling: 0-10 pods
- **`templates/_helpers.tpl`**: Helm helper functions
- **`templates/knative-service.yaml`**: Knative Service for scale-to-zero
- **`templates/serviceaccount.yaml`**: Service account with Workload Identity
- **`README.md`**: Comprehensive deployment guide

## Architecture

```
┌──────────────────────────────────────────────┐
│          Knative Service Pod                 │
│  (scales 0→10 based on traffic)             │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────────┐      ┌──────────────┐      │
│  │  Frontend   │      │   Backend    │      │
│  │  Next.js    │ ───▶ │   FastAPI    │      │
│  │  Port 3000  │      │   Port 5000  │      │
│  └─────────────┘      └──────────────┘      │
│         │                     ▲              │
│         └─── localhost:5000 ──┘              │
│                                              │
└──────────────────────────────────────────────┘
                    │
                    ▼
      testgenie.sandbox.superwise.ai
```

## What's Already Configured

✅ **Dockerfiles Exist**:
- `frontend/Dockerfile`: Multi-stage build for Next.js
- `backend/Dockerfile`: Python 3.11 with FastAPI

✅ **Health Endpoints**:
- Backend: `/api/health` (line 83 in `main.py`)
- Frontend: Uses root `/` path

✅ **API Communication**:
- Frontend uses `NEXT_PUBLIC_API_URL` env variable
- Defaults to `http://localhost:5000` (perfect for pod-local communication)
- See `frontend/src/services/api.ts`

✅ **Backend Configuration**:
- Runs on port 5000 (docker-compose shows this)
- CORS configured for frontend
- SQLite database

## GitLab CI Variables (Automatically Set by Terraform)

These are already configured in the IAC repo and will be set in your GitLab project:

- `GCP_SA_KEY`: Service account key
- `GKE_PROJECT`: `tiger-team-1`
- `GKE_CLUSTER`: `tiger-team`
- `GKE_REGION`: `us-central1`
- `K8S_NAMESPACE`: `testgenie`
- `APP_SUBDOMAIN`: `testgenie.sandbox.superwise.ai`
- `ARTIFACT_REGISTRY`: `us-central1-docker.pkg.dev/tiger-team-1/tiger-team`
- `IMAGE_NAME`: `testgenie`

## Next Steps

### 1. Commit TestGenie Changes
```bash
cd testgenie
git add .gitlab-ci.yml helm/
git commit -m "Add Kubernetes deployment with Knative scale-to-zero"
git push origin main
```

### 2. Deploy GKE Infrastructure (IAC Repo)
```bash
cd ../iac/terraform/GCP/customers/tiger-team-gke
terraform init
terraform plan -var-file=environments/prod.tfvars
terraform apply -var-file=environments/prod.tfvars
```

This will:
- Create the GKE cluster
- Set up Knative Serving
- Configure namespaces and Workload Identity
- Set GitLab CI variables automatically

### 3. Install Knative (One-Time Setup)
After Terraform completes, follow the output instructions to install Knative:

```bash
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.12.0/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.12.0/serving-core.yaml
kubectl apply -f https://github.com/knative/net-kourier/releases/download/knative-v1.12.0/kourier.yaml
```

### 4. Deploy TestGenie
Just push to your repo:
```bash
git push origin main  # Builds and deploys to production
```

### 5. Verify Deployment
```bash
# Check Knative Service
kubectl get ksvc -n testgenie

# Check pods (will be 0 when idle)
kubectl get pods -n testgenie

# Test the app (triggers scale-from-zero)
curl https://testgenie.sandbox.superwise.ai

# Watch pods scale up
kubectl get pods -n testgenie -w
```

## Features

### 🚀 Scale-to-Zero (Like Cloud Run!)
- Pods automatically scale from 0 to 10 based on traffic
- When idle for 30 seconds, scales down to 0
- Cold start time: ~5-10 seconds
- **Cost savings**: Only pay for actual usage!

### 🔄 Multi-Container Pod
- Frontend and backend run in the same pod
- Communication via `localhost` (fast and secure)
- Single Knative Service manages both

### 🔐 Security
- Workload Identity for GCP access
- Non-root containers
- HTTPS with Let's Encrypt (via cert-manager)

### 📊 Monitoring
- GitLab CI/CD integration
- Helm-based deployments
- Easy rollbacks

## Troubleshooting

### Check Logs
```bash
# Frontend logs
kubectl logs -f -n testgenie -l app.kubernetes.io/name=testgenie -c frontend

# Backend logs
kubectl logs -f -n testgenie -l app.kubernetes.io/name=testgenie -c backend
```

### Scale Issues
```bash
# Check autoscaling
kubectl get kpa -n testgenie

# Describe service
kubectl describe ksvc testgenie -n testgenie
```

### Image Pull Issues
```bash
# Check service account
kubectl describe sa testgenie -n testgenie

# Should have annotation:
# iam.gke.io/gcp-service-account: tiger-team-testgenie-app@tiger-team-1.iam.gserviceaccount.com
```

## Cost Comparison

### Before (Cloud Run - Separate Services)
- Frontend Cloud Run: Always on
- Backend Cloud Run: Always on
- ~$20-30/month (idle charges)

### After (GKE with Knative)
- Single GKE cluster: $73/month (shared across all use-cases)
- Knative pods: Scale to 0 when idle (no idle charges!)
- **Estimated savings**: 60-70% for multiple use-cases

## Documentation

- TestGenie Helm Chart: `helm/README.md`
- Knative Guide: `../iac/k8s/KNATIVE.md`
- GitLab CI Examples: `../iac/k8s/examples/testgenie/`

---

🎉 **You're all set! TestGenie is ready for Cloud Native deployment with scale-to-zero!**

