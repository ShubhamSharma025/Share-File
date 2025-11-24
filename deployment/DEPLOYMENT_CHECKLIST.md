# PeerLink AWS Deployment Checklist

## Pre-Deployment

### AWS Account Setup
- [ ] Create AWS account (if not already done)
- [ ] Set up billing alerts
- [ ] Create IAM user with appropriate permissions
- [ ] Download and configure AWS CLI

### Domain & DNS (Optional but Recommended)
- [ ] Register domain or use existing
- [ ] Have domain registrar credentials ready
- [ ] Plan DNS configuration

### Local Preparation
- [ ] Test application locally
- [ ] Commit all code changes to Git
- [ ] Create GitHub/GitLab repository (optional)
- [ ] Review security group rules

## AWS Infrastructure Setup

### EC2 Instance
- [ ] Launch EC2 instance (Ubuntu 22.04 LTS)
- [ ] Instance type: t3.medium (minimum)
- [ ] Storage: 20GB+ gp3 EBS volume
- [ ] Create/select key pair (.pem file)
- [ ] Save key pair securely
- [ ] Configure security group with required ports
- [ ] Allocate Elastic IP
- [ ] Associate Elastic IP with instance
- [ ] Tag instance appropriately

### Security Group Configuration
- [ ] Port 22 (SSH) - Your IP only
- [ ] Port 80 (HTTP) - 0.0.0.0/0
- [ ] Port 443 (HTTPS) - 0.0.0.0/0
- [ ] Ports 49152-65535 (P2P) - 0.0.0.0/0
- [ ] Verify outbound rules allow all traffic

## Application Deployment

### Upload Application
- [ ] Connect to EC2 via SSH
- [ ] Upload application files via SCP or Git
- [ ] Verify all files uploaded correctly
- [ ] Set correct file permissions

### Run Deployment Script
- [ ] Navigate to application directory
- [ ] Make deploy.sh executable: `chmod +x deployment/deploy.sh`
- [ ] Run deployment script: `./deployment/deploy.sh`
- [ ] Monitor script output for errors
- [ ] Verify all dependencies installed

### Configure Application
- [ ] Update Nginx config with your domain
  - [ ] Edit `/etc/nginx/sites-available/peerlink`
  - [ ] Replace `your-domain.com` with actual domain
  - [ ] Test config: `sudo nginx -t`
  - [ ] Restart Nginx: `sudo systemctl restart nginx`
- [ ] Update environment variables
  - [ ] Edit `.env.production`
  - [ ] Set NEXT_PUBLIC_BASE_URL
  - [ ] Set ALLOWED_ORIGINS
- [ ] Verify services are running
  - [ ] Backend: `sudo systemctl status peerlink-backend`
  - [ ] Frontend: `sudo systemctl status peerlink-frontend`
  - [ ] Nginx: `sudo systemctl status nginx`

## DNS & SSL Configuration

### DNS Setup
- [ ] Log into domain registrar
- [ ] Create A record pointing to Elastic IP
- [ ] Create www CNAME (optional)
- [ ] Wait for DNS propagation (can take up to 48 hours)
- [ ] Verify DNS: `nslookup your-domain.com`

### SSL Certificate
- [ ] Run Certbot: `sudo certbot --nginx -d your-domain.com -d www.your-domain.com`
- [ ] Enter email address
- [ ] Agree to terms of service
- [ ] Choose redirect option (recommended)
- [ ] Verify certificate installation
- [ ] Test auto-renewal: `sudo certbot renew --dry-run`

## Testing

### Basic Connectivity
- [ ] Access application via HTTP (should redirect to HTTPS)
- [ ] Access application via HTTPS
- [ ] Verify SSL certificate is valid
- [ ] Test from different devices/networks

### Functionality Testing
- [ ] Test file upload
  - [ ] Upload small file (< 1MB)
  - [ ] Upload medium file (10-50MB)
  - [ ] Upload large file (100MB+)
  - [ ] Verify invite code generation
- [ ] Test file download
  - [ ] Enter invite code
  - [ ] Verify file downloads correctly
  - [ ] Check filename is preserved
- [ ] Test from different devices
  - [ ] Desktop browser
  - [ ] Mobile browser
  - [ ] Different networks

### Performance Testing
- [ ] Check page load times
- [ ] Monitor CPU usage: `top`
- [ ] Monitor memory usage: `free -h`
- [ ] Monitor disk usage: `df -h`
- [ ] Check network traffic

## Monitoring & Logs

### Set Up Monitoring
- [ ] Configure CloudWatch (optional)
- [ ] Set up log rotation
- [ ] Create monitoring dashboard
- [ ] Set up alerts for high CPU/memory

### Verify Logs
- [ ] Check backend logs: `sudo journalctl -u peerlink-backend -n 50`
- [ ] Check frontend logs: `sudo journalctl -u peerlink-frontend -n 50`
- [ ] Check Nginx access logs: `sudo tail -f /var/log/nginx/peerlink_access.log`
- [ ] Check Nginx error logs: `sudo tail -f /var/log/nginx/peerlink_error.log`
- [ ] Verify no critical errors

## Security Hardening

### Server Security
- [ ] Update system packages: `sudo apt update && sudo apt upgrade -y`
- [ ] Configure UFW firewall
- [ ] Disable root login
- [ ] Set up fail2ban (optional)
- [ ] Configure automatic security updates
- [ ] Review SSH configuration

### Application Security
- [ ] Verify CORS settings
- [ ] Check file upload size limits
- [ ] Review security headers in Nginx
- [ ] Test for common vulnerabilities
- [ ] Set up rate limiting (optional)

## Backup & Recovery

### Create Backups
- [ ] Create AMI of EC2 instance
- [ ] Set up automated EBS snapshots
- [ ] Backup application code to Git
- [ ] Document configuration changes
- [ ] Create recovery procedure document

### Test Recovery
- [ ] Test restoring from AMI
- [ ] Verify backup completeness
- [ ] Document recovery time

## Documentation

### Update Documentation
- [ ] Document server IP/domain
- [ ] Document SSH access procedure
- [ ] Document deployment process
- [ ] Create troubleshooting guide
- [ ] Document monitoring procedures

### Share Information
- [ ] Share access credentials securely
- [ ] Provide deployment guide to team
- [ ] Document cost estimates
- [ ] Create maintenance schedule

## Post-Deployment

### Optimization
- [ ] Review and optimize Nginx configuration
- [ ] Tune Java JVM settings
- [ ] Configure CDN (optional)
- [ ] Set up caching (optional)
- [ ] Optimize database queries (if applicable)

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Create alerting rules

### Maintenance Plan
- [ ] Schedule regular updates
- [ ] Plan backup strategy
- [ ] Create incident response plan
- [ ] Document scaling procedures

## Cost Management

### Review Costs
- [ ] Check AWS billing dashboard
- [ ] Review resource utilization
- [ ] Identify optimization opportunities
- [ ] Set up cost alerts
- [ ] Consider Reserved Instances for long-term

## Troubleshooting Checklist

If something goes wrong:

### Backend Issues
- [ ] Check if service is running: `sudo systemctl status peerlink-backend`
- [ ] Check logs: `sudo journalctl -u peerlink-backend -n 100`
- [ ] Verify JAR file exists
- [ ] Check Java version
- [ ] Restart service: `sudo systemctl restart peerlink-backend`

### Frontend Issues
- [ ] Check if service is running: `sudo systemctl status peerlink-frontend`
- [ ] Check logs: `sudo journalctl -u peerlink-frontend -n 100`
- [ ] Verify build exists
- [ ] Check Node version
- [ ] Rebuild: `cd ui && npm run build`
- [ ] Restart service: `sudo systemctl restart peerlink-frontend`

### Nginx Issues
- [ ] Test configuration: `sudo nginx -t`
- [ ] Check error logs: `sudo tail -f /var/log/nginx/error.log`
- [ ] Verify ports are listening: `sudo netstat -tlnp | grep -E '(80|443|3000|8080)'`
- [ ] Restart Nginx: `sudo systemctl restart nginx`

### SSL Issues
- [ ] Verify certificate: `sudo certbot certificates`
- [ ] Check renewal: `sudo certbot renew --dry-run`
- [ ] Review Nginx SSL config

### Connectivity Issues
- [ ] Verify security group rules
- [ ] Check firewall: `sudo ufw status`
- [ ] Test DNS: `nslookup your-domain.com`
- [ ] Ping server: `ping your-domain.com`

## Success Criteria

Deployment is successful when:
- [ ] Application accessible via HTTPS
- [ ] SSL certificate valid and auto-renewing
- [ ] File upload works correctly
- [ ] File download works correctly
- [ ] No errors in logs
- [ ] All services running and enabled
- [ ] Monitoring in place
- [ ] Backups configured
- [ ] Documentation complete

## Next Steps After Deployment

- [ ] Monitor application for 24-48 hours
- [ ] Gather user feedback
- [ ] Plan feature enhancements
- [ ] Consider implementing WebRTC for better P2P
- [ ] Set up CI/CD pipeline
- [ ] Plan scaling strategy
