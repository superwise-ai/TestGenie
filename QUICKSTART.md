# 🚀 Quick Start: Deploy TestGenie to GKE

## TL;DR

```bash
# 1. Commit and push to deploy
git add .gitlab-ci.yml helm/ DEPLOYMENT.md QUICKSTART.md
git commit -m "Add GKE deployment with Knative"
git push origin main

# 2. Watch the magic happen!
# GitLab CI will:
# - Build frontend & backend Docker images
# - Push to Artifact Registry
# - Deploy to GKE with Knative
# - Scale to 0 when idle (like Cloud Run!)
```

## What You Get

✅ **Auto Scale-to-Zero**: Just like Cloud Run, but cheaper!  
✅ **Multi-Container Pod**: Frontend + Backend in one pod  
✅ **HTTPS**: Automatic SSL certificates  
✅ **CI/CD**: Push to deploy  
✅ **Rollbacks**: One click in GitLab UI  

## Access Your App

- **Production**: https://testgenie.sandbox.superwise.ai

## Monitor Deployment

### Via GitLab
1. Go to your GitLab project
2. Click **CI/CD** → **Pipelines**
3. Watch the build and deploy stages

### Via kubectl
```bash
# Check if pods are running (0 = idle, scales on first request)
kubectl get pods -n testgenie

# Check Knative Service status
kubectl get ksvc -n testgenie

# Stream logs
kubectl logs -f -n testgenie -l app.kubernetes.io/name=testgenie -c frontend
kubectl logs -f -n testgenie -l app.kubernetes.io/name=testgenie -c backend
```

## Test Scale-to-Zero

```bash
# 1. Check pods (should be 0 after 30s of idle)
kubectl get pods -n testgenie

# 2. Send a request (triggers scale-up)
curl https://testgenie.sandbox.superwise.ai

# 3. Watch pods appear
kubectl get pods -n testgenie -w

# 4. Wait 30s... pods disappear!
```

## Rollback

### Via GitLab UI
1. Go to **Deployments** → **Environments** → **production**
2. Click **Rollback** on the previous deployment

### Via kubectl
```bash
helm rollback testgenie -n testgenie
```

## Environment Variables

All CI/CD variables are **automatically configured by Terraform**:

- ✅ `GCP_SA_KEY`
- ✅ `GKE_PROJECT`
- ✅ `GKE_CLUSTER`
- ✅ `K8S_NAMESPACE`
- ✅ `ARTIFACT_REGISTRY`
- ✅ `IMAGE_NAME`

You don't need to set anything manually!

## Architecture

```
testgenie.sandbox.superwise.ai
             │
             ▼
    ┌────────────────┐
    │ Knative Service│ ← Scales 0→10 automatically
    └────────────────┘
             │
      ┌──────┴──────┐
      │             │
 Next.js(3000)  Python(5000)
   Frontend      Backend
```

Both containers run in **the same pod**, so they communicate via `localhost` (super fast!).

## Need Help?

- 📚 **Full Guide**: See `DEPLOYMENT.md`
- 🛠️ **Helm Chart**: See `helm/README.md`
- 🐛 **Troubleshooting**: Check logs with `kubectl logs`

## What's Different from Cloud Run?

| Feature | Cloud Run | GKE + Knative |
|---------|-----------|---------------|
| Scale-to-Zero | ✅ | ✅ |
| Cold Start | ~2s | ~5s |
| Multi-Container | ❌ | ✅ |
| Cost (multiple apps) | $$$ | $ |
| Full K8s Access | ❌ | ✅ |

---

🎉 **That's it! Your app will scale like Cloud Run, but cheaper and more powerful!**

