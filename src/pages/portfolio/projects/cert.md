---
layout: /src/layouts/ProjectLayout.astro
title: 'TLS Certificate Management Lab'
description: 'A hands-on lab exploring digital certificate creation, certificate authority setup, and HTTPS configuration with Apache.'
languages: ["linux","openssl","pki"]
category: "lab"
--- 

**TLS Certificate Management Lab** is a practical lab demonstrating the complete workflow of creating and managing digital certificates for secure web communications. This hands-on implementation covers everything from cryptographic key generation to deploying a fully functional HTTPS server with custom certificates.

Built with **OpenSSL** and **Apache**, this project showcases the technical infrastructure behind secure web communications and certificate management.

## Project Objective

The goal was to understand and implement the complete certificate management lifecycle, including:
- Private and public key generation
- Certificate Authority (CA) creation and management
- Self-signed certificate workflow
- HTTPS protocol configuration on Apache server

## Implementation Process

### Step 1 - Server Certificate Creation

**Private Key Generation**

Generated an unencrypted RSA private key:

```bash
openssl genrsa 2048 > fichier.key
```

**Result:** Created a 2048-bit RSA private key stored securely.

![Private Key](/images/projects/cert/priv_key.png)

**Encrypted Key Generation**

Created an encrypted private key with AES-256:

```bash
openssl genrsa -aes256 2048 > fichier_encrypted.key
```

**Result:** Generated a passphrase-protected private key for enhanced security.

![Encrypted Key](/images/projects/cert/encrypt_priv.png)

**Security Hardening**

Applied proper file permissions:

```bash
chmod 600 fichier_encrypted.key
```

**Purpose:** Restricted access to owner-only (read/write), preventing unauthorized access.

### Step 2 - Certificate Signing Request (CSR)

Generated a CSR for certificate signing:

```bash
openssl req -new -key fichier.key -config serv.conf > fichier.csr
```

**Result:** Created a CSR file ready for CA signing or submission to external certificate authorities.

![CSR Creation](/images/projects/cert/ca_csr.png)

### Step 3 - Certificate Authority Setup

**CA Private Key**

Created the CA's encrypted private key:

```bash
openssl genrsa -aes256 2048 > ca.key
```

**CA Certificate**

Generated a self-signed root CA certificate:

```bash
openssl req -new -x509 -days 365 -key ca.key > ca.crt
```

**Result:** Established a local Certificate Authority valid for 365 days.

![CA Certificate](/images/projects/cert/ca_csr.png)

### Step 4 - Certificate Signing

Signed the server certificate using the CA:

```bash
openssl x509 -req -in fichier.csr -out fichier.crt -CA ca.crt -CAkey ca.key -CAcreateserial -CAserial ca.srl -extensions req_ext -extfile serv.conf
```

**Key Parameters:**
- `CAcreateserial`: Generates unique serial numbers for certificate tracking
- `extensions req_ext`: Applies necessary certificate extensions

**Result:** Produced a CA-signed server certificate ready for deployment.

![Signed Certificate](/images/projects/cert/fichier_crt.png)

### Step 5 - Apache HTTPS Configuration

**SSL Module Activation**

Enabled Apache's SSL module:

```bash
a2enmod ssl
```

**Effect:** Activated SSL/TLS support in Apache for HTTPS connections.

**Port Configuration**

Verified HTTPS port 443 configuration in `ports.conf`:

![Ports Configuration](/images/projects/cert/ports_conf.png)

Confirmed the port was listening:

![Port 443 Active](/images/projects/cert/ss.png)

**VirtualHost Setup**

Configured the Apache VirtualHost:
- Set `ServerName example.com` for proper domain routing
- Changed `<VirtualHost _default_:443>` to `<VirtualHost *:443>` to accept connections on all network interfaces

### Step 6 - Testing & Deployment

Successfully deployed and tested the HTTPS server:

![Working HTTPS Server](/images/projects/cert/server.png)

**Result:** Fully functional HTTPS server accessible via browser with valid CA-signed certificate.

## Outcome

Successfully implemented a complete certificate management system from scratch, demonstrating the ability to:
- Establish and operate a Certificate Authority
- Generate and manage cryptographic keys securely
- Sign and deploy certificates following industry standards
- Configure production-ready HTTPS infrastructure

