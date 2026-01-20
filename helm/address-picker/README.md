# Address Picker Helm Chart

This Helm chart deploys the address-picker application (frontend and backend) to Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- kubectl configured to access your cluster

## Installation

### Install with default values:
```bash
helm install address-picker ./helm/address-picker
```

### Install with custom values:
```bash
helm install address-picker ./helm/address-picker -f helm/address-picker/values-prod.yaml
```

### Install in specific namespace:
```bash
helm install address-picker ./helm/address-picker --namespace address-picker --create-namespace
```

## Upgrading

```bash
helm upgrade address-picker ./helm/address-picker
```

With custom values:
```bash
helm upgrade address-picker ./helm/address-picker -f helm/address-picker/values-prod.yaml
```

## Uninstalling

```bash
helm uninstall address-picker
```

## Configuration

### Values Files

- `values.yaml` - Default values
- `values-dev.yaml` - Development environment
- `values-prod.yaml` - Production environment

### Key Configuration Options

#### Backend
- `backend.replicaCount` - Number of backend replicas
- `backend.image.repository` - Docker image repository
- `backend.image.tag` - Docker image tag
- `backend.resources` - CPU and memory limits

#### Frontend
- `frontend.replicaCount` - Number of frontend replicas
- `frontend.image.repository` - Docker image repository
- `frontend.image.tag` - Docker image tag
- `frontend.resources` - CPU and memory limits

#### Ingress
- `ingress.enabled` - Enable/disable Ingress
- `ingress.hosts` - Ingress host configuration
- `ingress.tls` - TLS/SSL configuration

## Examples

### Development Deployment
```bash
helm install address-picker-dev ./helm/address-picker \
  -f helm/address-picker/values-dev.yaml \
  --namespace dev \
  --create-namespace
```

### Production Deployment
```bash
helm install address-picker-prod ./helm/address-picker \
  -f helm/address-picker/values-prod.yaml \
  --namespace prod \
  --create-namespace
```

### Custom Image Tag
```bash
helm install address-picker ./helm/address-picker \
  --set backend.image.tag=v1.2.3 \
  --set frontend.image.tag=v1.2.3
```

### Scale Replicas
```bash
helm upgrade address-picker ./helm/address-picker \
  --set backend.replicaCount=5 \
  --set frontend.replicaCount=5
```

## Chart Structure

```
helm/address-picker/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default values
├── values-dev.yaml         # Dev environment values
├── values-prod.yaml        # Prod environment values
├── templates/              # Kubernetes manifests
│   ├── _helpers.tpl       # Template helpers
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-service.yaml
│   ├── configmap.yaml
│   └── ingress.yaml
└── README.md
```

## Troubleshooting

### Check Release Status
```bash
helm status address-picker
```

### View Rendered Templates
```bash
helm template address-picker ./helm/address-picker
```

### Debug Installation
```bash
helm install address-picker ./helm/address-picker --debug --dry-run
```

### View Values
```bash
helm get values address-picker
```

## Next Steps

After deploying with Helm:
- **Module 5**: ArgoCD (GitOps deployment)
- **Module 6**: Grafana (monitoring)
