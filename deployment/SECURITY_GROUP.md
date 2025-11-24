# Security Group Rules for PeerLink

## Create Security Group

**Name:** peerlink-sg  
**Description:** Security group for PeerLink P2P file sharing application  
**VPC:** Default VPC (or your custom VPC)

## Inbound Rules

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | Your IP/32 | SSH access (replace with your IP) |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP traffic (redirects to HTTPS) |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS traffic |
| Custom TCP | TCP | 49152-65535 | 0.0.0.0/0 | P2P file transfer ports |

### AWS CLI Commands

```bash
# Create security group
aws ec2 create-security-group \
  --group-name peerlink-sg \
  --description "Security group for PeerLink application"

# Add SSH rule (replace YOUR_IP with your actual IP)
aws ec2 authorize-security-group-ingress \
  --group-name peerlink-sg \
  --protocol tcp \
  --port 22 \
  --cidr YOUR_IP/32

# Add HTTP rule
aws ec2 authorize-security-group-ingress \
  --group-name peerlink-sg \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Add HTTPS rule
aws ec2 authorize-security-group-ingress \
  --group-name peerlink-sg \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Add P2P ports rule
aws ec2 authorize-security-group-ingress \
  --group-name peerlink-sg \
  --protocol tcp \
  --port 49152-65535 \
  --cidr 0.0.0.0/0
```

## Outbound Rules

| Type | Protocol | Port Range | Destination | Description |
|------|----------|------------|-------------|-------------|
| All traffic | All | All | 0.0.0.0/0 | Allow all outbound traffic |

**Note:** Default outbound rule allows all traffic. No changes needed.

## Security Considerations

### ⚠️ Warning: P2P Port Range
Opening ports 49152-65535 to the internet (0.0.0.0/0) is a security risk. Consider these alternatives:

1. **Restrict to known IPs**: If you know the IP addresses of users, restrict the P2P ports to those IPs only
2. **Use VPN**: Set up a VPN and only allow P2P connections from VPN clients
3. **Implement authentication**: Add authentication to the file transfer protocol
4. **Use WebRTC**: Redesign to use WebRTC with TURN/STUN servers for better security

### SSH Access
- **Never use 0.0.0.0/0** for SSH access
- Always restrict to your specific IP address
- Consider using AWS Systems Manager Session Manager instead of SSH
- Use key-based authentication only (no passwords)

### Best Practices
1. **Principle of Least Privilege**: Only open ports that are absolutely necessary
2. **Regular Audits**: Review security group rules monthly
3. **Use Security Groups as Firewalls**: Don't rely solely on application-level security
4. **Monitor Access**: Use VPC Flow Logs to monitor traffic
5. **Enable AWS GuardDuty**: For threat detection

## Alternative: More Secure Configuration

If you want better security, use this configuration:

### Inbound Rules (Secure)
| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | Your IP/32 | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS traffic |
| Custom TCP | TCP | 8080 | 127.0.0.1/32 | Backend (internal only) |
| Custom TCP | TCP | 3000 | 127.0.0.1/32 | Frontend (internal only) |

**Note:** This configuration removes the P2P ports entirely and would require redesigning the application to use WebRTC or a different file transfer method.

## Terraform Configuration (Optional)

```hcl
resource "aws_security_group" "peerlink" {
  name        = "peerlink-sg"
  description = "Security group for PeerLink application"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["YOUR_IP/32"]  # Replace with your IP
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "P2P Ports"
    from_port   = 49152
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "peerlink-sg"
    Application = "PeerLink"
  }
}
```

## Updating Security Group

### Add New Rule
```bash
aws ec2 authorize-security-group-ingress \
  --group-name peerlink-sg \
  --protocol tcp \
  --port PORT_NUMBER \
  --cidr IP_ADDRESS/32
```

### Remove Rule
```bash
aws ec2 revoke-security-group-ingress \
  --group-name peerlink-sg \
  --protocol tcp \
  --port PORT_NUMBER \
  --cidr IP_ADDRESS/32
```

### List Rules
```bash
aws ec2 describe-security-groups \
  --group-names peerlink-sg
```
