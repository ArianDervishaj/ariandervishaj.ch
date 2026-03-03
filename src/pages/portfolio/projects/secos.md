---
layout: /src/layouts/ProjectLayout.astro
title: 'SME Infrastructure Design & Hardening'
description: 'A team project designing, deploying, and hardening a complete virtualized IT infrastructure for a fictional SME, with system hardening, centralized logging, encrypted backups, and Ansible automation.'
languages: ["ansible","linux","docker","selinux"]
category: "lab"
sortOrder: 1
--- 

**SME Infrastructure Design & Hardening** is a team project completed as part of the OS Security (Sécurité des systèmes d'exploitation) course at HEPIA. Working in a team of 3, we designed, deployed, configured, and hardened the complete IT infrastructure of a fictional small-to-medium enterprise from scratch.

The course follows a 4-phase approach: infrastructure design, deployment and configuration, security tooling (IDS/IPS, SIEM), and purple team pentesting. This writeup covers the first two phases.

## Project Objective

The goal was to build a realistic enterprise infrastructure on Proxmox VE at HEPIA and apply OS-level security principles throughout, including disk partitioning strategies, user/group management with least privilege, Linux Security Modules (SELinux), and system hardening.

## Infrastructure Overview

The infrastructure consists of 7 dedicated VMs on a `192.168.100.0/24` network, each running a specific service:

| **Server** | **Role** | **Key Services** |
|-----------|---------|-----------------|
| GR2-WebServer | Web hosting | NGINX |
| GR2-MailServer | Email | Mailcow (Dockerized Postfix/Dovecot) |
| GR2-VPNServer | Remote access | WireGuard |
| GR2-DataServer | File sharing | SFTPGo (Dockerized) |
| GR2-LogServer | Centralized logging | rsyslog |
| GR2-BackupServer | Encrypted backups | BorgBackup |
| GR2-MFAServer | Multi-factor authentication | PrivacyIDEA |

Access to the infrastructure was done through a Linode VPS acting as an SSH jump host, allowing the team to manage all VMs remotely.

## System Hardening

Each VM was hardened following OS security best practices covered in the course:

### Disk Partitioning & Encryption

Servers handling sensitive data use LUKS full-disk encryption with LVM, with separate partitions for `/boot`, `/tmp`, `/var`, and `/home` using restrictive mount options:

- **nodev** - prevents creation of device files on user-accessible partitions
- **nosuid** - ignores SUID/SGID bits to prevent privilege escalation
- **noexec** - blocks binary execution on `/tmp` to prevent malware from running

The Backup Server uses LUKS encryption on all partitions except `/boot`, protecting backup data and SSH keys at rest. The trade-off of requiring manual passphrase entry at boot was accepted since backup servers rarely restart.

The Log Server intentionally skips disk encryption to allow unattended reboots, relying instead on network-level and access-level security.

### User Management & Least Privilege

Each server follows strict user separation with dedicated accounts per function. For example, the Backup Server has 4 distinct users:

- **backupadmin** : human administration via sudo, SSH key auth only
- **backupexec** : automated backup execution, outbound SSH only, no sudo, no password
- **backupreader** : read-only monitoring account with `nologin` shell
- **root** : emergency recovery only, SSH access disabled

This pattern of separating admin, execution, and read-only accounts is applied across all servers, ensuring each account has only the permissions it needs.

### SSH Hardening

Applied consistently across all VMs:

- Password authentication disabled - key-based auth only
- Root login forbidden
- Strict user whitelisting with `AllowUsers`
- Maximum 3 authentication attempts
- X11 forwarding disabled

### SELinux

All servers run SELinux in enforcing mode with custom policy modules generated from audit logs using `audit2allow`. This was particularly relevant for the Mail Server running Mailcow in Docker containers, which required custom SELinux policies to allow container operations while maintaining enforcement.

### OS-Level Hardening

Applied the [dev-sec ansible-collection-hardening](https://github.com/dev-sec/ansible-collection-hardening) collection across all VMs, covering kernel parameters, file permissions, and service configurations.

## Centralized Logging

The Log Server collects logs from all VMs using rsyslog over UDP. Logs are organized by hostname and program name with daily rotation, 7-day retention, and 50MB size limits. Each VM runs a rsyslog client that forwards authentication logs, audit logs, and system logs to the central server.

## Backup Strategy

BorgBackup handles encrypted, deduplicated backups pulled from all servers to the Backup Server. Each server has its own Borg repository with a unique passphrase stored in Ansible Vault. Backups cover `/etc`, `/home`, `/root`, and `/var` with automated scheduling via systemd timers.

## Ansible Automation

The entire deployment is automated with Ansible, using a jump host for SSH access to the Proxmox VMs:

- **Roles**: SSH hardening, OS hardening (dev-sec collection), Docker installation, BorgBackup client/server, rsyslog logging, WireGuard VPN, SFTPGo, Mailcow, web server
- **Security**: All passwords and private keys encrypted with Ansible Vault
- **Per-host configuration**: Each server has its own host vars defining service-specific settings, Borg repository config, and user access

A single playbook handles base configuration, role application, Docker setup for containerized services, and service-specific deployments.

## Technologies Used

- **Proxmox VE** : Virtualization platform (hosted at HEPIA)
- **Debian** : Base OS for all VMs
- **Ansible** : Configuration management and deployment automation
- **SELinux** : Mandatory access control
- **BorgBackup** : Encrypted, deduplicated backups
- **rsyslog** : Centralized log collection
- **WireGuard** : VPN for remote access
- **Docker** : Containerization for Mailcow, SFTPGo, and PrivacyIDEA
- **Mailcow** : Full-featured mail server stack
- **SFTPGo** : SFTP/file sharing server
- **NGINX** : Web server

## What I Learned

This project provided hands-on experience with enterprise infrastructure security:

- Applying defense-in-depth across an entire infrastructure (disk encryption, partitioning, user isolation, SELinux, SSH hardening)
- Making justified security trade-offs (encryption vs. unattended reboots, convenience vs. least privilege)
- Working with SELinux in enforcing mode on real services, including writing custom policy modules
- Designing user hierarchies with proper privilege separation across multiple servers
- Automating secure deployments with Ansible at scale
- Collaborating as a team to manage a multi-server infrastructure