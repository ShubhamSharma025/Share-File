#!/bin/bash

# PeerLink AWS EC2 Deployment Script
# This script sets up PeerLink on a fresh Ubuntu EC2 instance

set -e  # Exit on error

echo "========================================="
echo "PeerLink AWS Deployment Script"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root. Run as ubuntu user with sudo privileges."
    exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Java 17
print_status "Installing Java 17..."
sudo apt install -y openjdk-17-jdk

# Verify Java installation
java -version
print_status "Java installed successfully"

# Install Node.js 18
print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node --version
npm --version
print_status "Node.js installed successfully"

# Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx

# Install Maven
print_status "Installing Maven..."
sudo apt install -y maven

# Install Certbot for SSL
print_status "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Configure firewall
print_status "Configuring UFW firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 49152:65535/tcp
sudo ufw --force enable
print_status "Firewall configured"

# Create application directory
print_status "Setting up application directory..."
cd /home/ubuntu

# Check if peerlink directory exists
if [ -d "peerlink" ]; then
    print_warning "peerlink directory already exists. Skipping clone."
else
    print_status "Please upload your peerlink code to /home/ubuntu/peerlink"
    mkdir -p peerlink
fi

cd peerlink

# Build Java backend
if [ -f "pom.xml" ]; then
    print_status "Building Java backend..."
    mvn clean package
    print_status "Java backend built successfully"
else
    print_warning "pom.xml not found. Please upload your code first."
fi

# Build Next.js frontend
if [ -d "ui" ]; then
    print_status "Building Next.js frontend..."
    cd ui
    npm install
    npm run build
    cd ..
    print_status "Frontend built successfully"
else
    print_warning "ui directory not found. Please upload your code first."
fi

# Copy systemd service files
print_status "Setting up systemd services..."
if [ -f "deployment/systemd/peerlink-backend.service" ]; then
    sudo cp deployment/systemd/peerlink-backend.service /etc/systemd/system/
    sudo cp deployment/systemd/peerlink-frontend.service /etc/systemd/system/
    sudo systemctl daemon-reload
    print_status "Systemd services configured"
else
    print_warning "Systemd service files not found in deployment/systemd/"
fi

# Copy Nginx configuration
print_status "Setting up Nginx..."
if [ -f "deployment/nginx/peerlink.conf" ]; then
    sudo cp deployment/nginx/peerlink.conf /etc/nginx/sites-available/peerlink
    sudo ln -sf /etc/nginx/sites-available/peerlink /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    print_warning "Please update the domain name in /etc/nginx/sites-available/peerlink"
    print_warning "Then run: sudo nginx -t && sudo systemctl restart nginx"
else
    print_warning "Nginx config not found in deployment/nginx/"
fi

# Enable and start services
print_status "Enabling services..."
sudo systemctl enable peerlink-backend
sudo systemctl enable peerlink-frontend
sudo systemctl enable nginx

print_status "Starting services..."
sudo systemctl start peerlink-backend
sudo systemctl start peerlink-frontend
sudo systemctl restart nginx

# Check service status
print_status "Checking service status..."
sudo systemctl status peerlink-backend --no-pager
sudo systemctl status peerlink-frontend --no-pager
sudo systemctl status nginx --no-pager

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update domain name in /etc/nginx/sites-available/peerlink"
echo "2. Run: sudo nginx -t && sudo systemctl restart nginx"
echo "3. Setup SSL: sudo certbot --nginx -d your-domain.com"
echo "4. Check logs:"
echo "   - Backend: sudo journalctl -u peerlink-backend -f"
echo "   - Frontend: sudo journalctl -u peerlink-frontend -f"
echo "   - Nginx: sudo tail -f /var/log/nginx/peerlink_error.log"
echo ""
print_status "Deployment script completed successfully!"
