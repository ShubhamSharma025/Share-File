# PeerLink AWS Deployment Guide

## Quick Start

### 1. Launch EC2 Instance
```bash
# Instance specifications:
- AMI: Ubuntu 22.04 LTS
- Instance Type: t3.medium (2 vCPU, 4GB RAM)
- Storage: 20GB gp3
- Security Group: See security-group-rules.txt
```

### 2. Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Upload Application
```bash
# From your local machine:
scp -i your-key.pem -r p2p ubuntu@your-ec2-ip:/home/ubuntu/peerlink
```

### 4. Run Deployment Script
```bash
cd /home/ubuntu/peerlink
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

### 5. Configure Domain
```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/peerlink

# Replace 'your-domain.com' with your actual domain
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 6. Setup SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Security Group Rules

### Inbound Rules
```
Type            Protocol    Port Range      Source
SSH             TCP         22              Your IP/32
HTTP            TCP         80              0.0.0.0/0
HTTPS           TCP         443             0.0.0.0/0
Custom TCP      TCP         49152-65535     0.0.0.0/0
```

### Outbound Rules
```
Type            Protocol    Port Range      Destination
All traffic     All         All             0.0.0.0/0
```

## Monitoring

### Check Service Status
```bash
# Backend
sudo systemctl status peerlink-backend

# Frontend
sudo systemctl status peerlink-frontend

# Nginx
sudo systemctl status nginx
```

### View Logs
```bash
# Backend logs
sudo journalctl -u peerlink-backend -f

# Frontend logs
sudo journalctl -u peerlink-frontend -f

# Nginx access logs
sudo tail -f /var/log/nginx/peerlink_access.log

# Nginx error logs
sudo tail -f /var/log/nginx/peerlink_error.log
```

### Restart Services
```bash
sudo systemctl restart peerlink-backend
sudo systemctl restart peerlink-frontend
sudo systemctl restart nginx
```

## Troubleshooting

### Backend not starting
```bash
# Check Java version
java -version

# Check if JAR exists
ls -la /home/ubuntu/peerlink/target/p2p-1.0-SNAPSHOT.jar

# Check logs
sudo journalctl -u peerlink-backend -n 50
```

### Frontend not starting
```bash
# Check Node version
node --version

# Check if build exists
ls -la /home/ubuntu/peerlink/ui/.next

# Rebuild if needed
cd /home/ubuntu/peerlink/ui
npm run build

# Check logs
sudo journalctl -u peerlink-frontend -n 50
```

### Nginx errors
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Verify ports are listening
sudo netstat -tlnp | grep -E '(80|443|3000|8080)'
```

## Cost Optimization

### Use Spot Instances
- Save up to 90% on EC2 costs
- Good for non-critical workloads

### Auto Scaling
- Scale down during low usage
- Scale up during peak times

### Reserved Instances
- 1-year commitment: ~40% savings
- 3-year commitment: ~60% savings

## Backup Strategy

### Create AMI
```bash
# From AWS Console or CLI
aws ec2 create-image --instance-id i-xxxxx --name "peerlink-backup-$(date +%Y%m%d)"
```

### Backup Application Data
```bash
# Create backup script
#!/bin/bash
tar -czf /home/ubuntu/backups/peerlink-$(date +%Y%m%d).tar.gz /home/ubuntu/peerlink
```

## Updating Application

### Update Backend
```bash
cd /home/ubuntu/peerlink
git pull  # or upload new files
mvn clean package
sudo systemctl restart peerlink-backend
```

### Update Frontend
```bash
cd /home/ubuntu/peerlink/ui
git pull  # or upload new files
npm install
npm run build
sudo systemctl restart peerlink-frontend
```

## Performance Tuning

### Nginx
```nginx
# Add to nginx.conf
worker_processes auto;
worker_connections 1024;
```

### Java Backend
```bash
# Edit systemd service
ExecStart=/usr/bin/java -Xmx1g -Xms512m -jar target/p2p-1.0-SNAPSHOT.jar
```

### Next.js
```bash
# Use PM2 for better process management
npm install -g pm2
pm2 start npm --name "peerlink-ui" -- start
```

## Domain Setup

### DNS Configuration
```
Type    Name    Value               TTL
A       @       your-ec2-ip         300
A       www     your-ec2-ip         300
```

### SSL Auto-Renewal
```bash
# Certbot auto-renewal is enabled by default
# Test renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```
