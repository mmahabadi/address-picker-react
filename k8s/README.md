# Kubernetes Manifests

This directory contains Kubernetes manifests for deploying the Address Picker application.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Kubernetes Cluster                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Namespace: address-picker               │    │
│  │                                                          │    │
│  │  ┌──────────────┐         ┌──────────────┐              │    │
│  │  │   Frontend   │         │   Backend    │              │    │
│  │  │  Deployment  │         │  Deployment  │              │    │
│  │  │  (nginx+React)│        │ (Spring Boot)│              │    │
│  │  └──────┬───────┘         └──────┬───────┘              │    │
│  │         │                        │                       │    │
│  │  ┌──────▼───────┐         ┌──────▼───────┐              │    │
│  │  │  frontend-   │  /api   │   backend-   │              │    │
│  │  │   service    │────────►│   service    │              │    │
│  │  │   (port 80)  │         │  (port 8080) │              │    │
│  │  └──────────────┘         └──────────────┘              │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                     ┌────────▼────────┐                         │
│                     │     Ingress     │                         │
│                     │  (nginx-ingress)│                         │
│                     └────────┬────────┘                         │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                    http://address-picker.local
```

## Files Overview

| File | Purpose |
|------|---------|
| `namespace.yaml` | Creates isolated `address-picker` namespace |
| `dockerhub-secret.yaml` | Docker Hub credentials for pulling private images |
| `backend-deployment.yaml` | Deploys backend Pods (Spring Boot API) |
| `backend.yaml` | Service for backend used by nginx (`backend:8080`) |
| `backend-service.yaml` | Service for backend used by Ingress (`backend-service:8080`) |
| `frontend-deployment.yaml` | Deploys frontend Pods (React + Nginx) |
| `frontend-service.yaml` | Service for frontend (`frontend-service:80`) |
| `ingress.yaml` | HTTP routing rules (requires Ingress Controller) |
| `configmap.yaml` | Configuration data (optional) |

## Quick Start

### Prerequisites

1. **Kubernetes Cluster** (choose one):
   - **minikube** (recommended for learning)
   - kind (Kubernetes in Docker)
   - Docker Desktop Kubernetes

2. **kubectl**: Kubernetes CLI
   ```bash
   brew install kubectl  # macOS
   ```

3. **Docker Hub account** with images pushed (from Jenkins pipeline)

### Step 1: Start minikube

```bash
# Install minikube
brew install minikube

# Start cluster
minikube start

# Enable ingress controller
minikube addons enable ingress

# Verify
kubectl get nodes
```

### Step 2: Configure Docker Hub Secret

**Important**: The images are private, so Kubernetes needs credentials.

1. Generate auth value (no trailing newline):
   ```bash
   printf 'YOUR_DOCKERHUB_USERNAME:YOUR_DOCKERHUB_TOKEN' | base64
   ```

2. Edit `dockerhub-secret.yaml` and replace the `auth` values with your base64 output

3. Apply the secret:
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/dockerhub-secret.yaml
   ```

### Step 3: Deploy Everything

```bash
# Apply all manifests at once
kubectl apply -f k8s/

# Or apply individually (in order):
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/dockerhub-secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Step 4: Verify Deployment

```bash
# Check all resources
kubectl get all -n address-picker

# Check Pods are Running
kubectl get pods -n address-picker
# Expected: backend-deployment-xxx  1/1  Running
#           frontend-deployment-xxx 1/1  Running

# Check Services have endpoints
kubectl get endpoints -n address-picker

# Check Ingress
kubectl get ingress -n address-picker
```

### Step 5: Access the Application

#### Option A: Port Forward (simplest, always works)
```bash
kubectl port-forward -n address-picker svc/frontend-service 5173:80
```
Open: **http://localhost:5173**

#### Option B: minikube service (opens browser)
```bash
minikube service -n address-picker frontend-service
```

#### Option C: Ingress (production-like)

**On macOS with Docker driver**, minikube IP isn't directly reachable. Use tunnel:

```bash
# Terminal 1: Start tunnel (keep running)
minikube service -n ingress-nginx ingress-nginx-controller --url
# Note the URL, e.g., http://127.0.0.1:64469

# Add to /etc/hosts
echo "127.0.0.1 address-picker.local" | sudo tee -a /etc/hosts

# Open browser
http://address-picker.local:64469
```

**On Linux or VM-based minikube driver**:
```bash
# Get minikube IP
minikube ip

# Add to /etc/hosts
echo "$(minikube ip) address-picker.local" | sudo tee -a /etc/hosts

# Open browser
http://address-picker.local
```

## Common Commands

```bash
# View all resources in namespace
kubectl get all -n address-picker

# View Pod logs
kubectl logs -f deployment/backend-deployment -n address-picker
kubectl logs -f deployment/frontend-deployment -n address-picker

# Describe a resource (shows events, useful for debugging)
kubectl describe pod <pod-name> -n address-picker
kubectl describe service backend-service -n address-picker

# Execute command in Pod
kubectl exec -it deployment/backend-deployment -n address-picker -- sh

# Scale deployment
kubectl scale deployment backend-deployment --replicas=3 -n address-picker

# Restart deployment (after config change)
kubectl rollout restart deployment -n address-picker

# Delete and recreate
kubectl delete -f k8s/
kubectl apply -f k8s/
```

## Troubleshooting

### Pods stuck in `ErrImagePull` or `ImagePullBackOff`

**Cause**: Kubernetes can't pull the Docker image.

```bash
# Check the error details
kubectl describe pod <pod-name> -n address-picker | grep -A5 Events
```

**Common fixes**:
- **`unauthorized: incorrect username or password`**: Docker Hub secret is wrong
  - Regenerate: `printf 'user:token' | base64` (no newline!)
  - Update `dockerhub-secret.yaml` and re-apply
- **`manifest unknown`**: Image tag doesn't exist on Docker Hub
- **`illegal base64 data`**: The auth value contains invalid characters

### Pods stuck in `CrashLoopBackOff`

**Cause**: Container starts but crashes immediately.

```bash
# Check logs
kubectl logs <pod-name> -n address-picker --previous
```

**Common fixes**:
- **`host not found in upstream "backend"`**: Backend service doesn't exist or has wrong name
  - Verify: `kubectl get svc -n address-picker`
  - The frontend nginx.conf expects a service named matching its `proxy_pass` URL

### API returns `502 Bad Gateway`

**Cause**: Service exists but has no endpoints (no selector, or selector doesn't match).

```bash
# Check if service has endpoints
kubectl get endpoints -n address-picker

# If endpoints show <none>, check selector matches Pod labels
kubectl describe svc backend-service -n address-picker
kubectl get pods -n address-picker --show-labels
```

**Fix**: Ensure Service `selector` matches Deployment Pod `labels`.

### Can't access app via Ingress

**Cause**: Ingress controller not running or not reachable.

```bash
# Check ingress controller is running
kubectl get pods -n ingress-nginx

# If not running, enable it
minikube addons enable ingress

# Check ingress has an ADDRESS
kubectl get ingress -n address-picker
# ADDRESS should show minikube IP, not empty
```

**On macOS Docker driver**: Use `minikube service` tunnel instead of direct IP access.

### Service has no endpoints

```bash
# Check endpoints
kubectl get endpoints <service-name> -n address-picker

# If empty, the Service selector doesn't match any Pod labels
# Compare:
kubectl describe svc <service-name> -n address-picker | grep Selector
kubectl get pods -n address-picker --show-labels
```

## Useful kubectl Aliases

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get svc'
alias kgd='kubectl get deployments'
alias kga='kubectl get all'
alias kd='kubectl describe'
alias kl='kubectl logs -f'
alias kns='kubectl config set-context --current --namespace'

# Quick namespace switch
kns address-picker
```

## Clean Up

```bash
# Delete all resources in namespace
kubectl delete -f k8s/

# Or delete the entire namespace (removes everything)
kubectl delete namespace address-picker

# Stop minikube
minikube stop

# Delete minikube cluster entirely
minikube delete
```

## Next Steps

After mastering Kubernetes basics:
- **Module 4: Helm** - Package these manifests into a reusable chart
- **Module 5: ArgoCD** - GitOps continuous deployment
- **Module 6: Grafana** - Monitoring and observability
