---
layout: /src/layouts/ProjectLayout.astro
title: 'Self-Hosted Homelab with Ansible Automation'
description: 'A fully automated self-hosted infrastructure running on Proxmox, managed with Ansible roles and playbooks for reproducible deployments of media, monitoring, and networking services.'
languages: ["ansible","docker","proxmox","linux"]
category: "homelab"
sortOrder: 0
---

Self-Hosted Homelab with Ansible Automation is a personal infrastructure project built to self-host services and practice real-world system administration and Infrastructure as Code (IaC). The entire stack runs on a Dell OptiPlex 7020 Micro with Proxmox VE and is fully managed through Ansible, making every deployment reproducible and consistent.
The project covers network segmentation, service containerization with Docker Compose, secret management with Ansible Vault, firewall hardening, and remote access.

The full codebase is available on [GitHub](https://github.com/ArianDervishaj/homelab).

## Hardware

- **Dell OptiPlex 7020 Micro** : Intel Core i5-12500T, 64GB RAM, 512GB SSD
- **Proxmox VE 8.4** : Type-1 hypervisor hosting all VMs
- **5TB ZFS pool ("tank")** : Provides NFS shares for media storage across VMs
- **Raspberry Pi 4B 8GB** : Dedicated Pi-hole DNS server for ad blocking and local DNS resolution

## Architecture
### Physical Layer

![Physical Layer](/images/projects/homelab/physical-layer.png)

### Logical Network

![Logical Network](/images/projects/homelab/logical-network.png)


The infrastructure is segmented into two networks:
- **Main LAN** (`192.168.1.0/24`): Home devices and router
- **Homelab subnet** (`192.168.100.0/24`): Isolated VM network for all services

A router VM bridges the two networks, keeping homelab traffic separated from the rest of the home network.


## Virtual Machines & Services

The homelab runs 5 dedicated VMs, each with a specific role:

| **VM** | **IP** | **Services** | **Purpose** |
|--------|--------|-------------|-------------|
| proxy-vm | 192.168.100.10 | Caddy | Reverse proxy with automatic HTTPS |
| streaming-vm | 192.168.100.11 | Jellyfin, Jellyseerr, Cloudflared | Media streaming and request management |
| arr-vm | 192.168.100.12 | Radarr, Sonarr, Prowlarr, Bazarr | Media library automation |
| downloader-vm | 192.168.100.13 | qBittorrent, Gluetun | Downloads tunneled through ProtonVPN (WireGuard) |
| monitoring-vm | 192.168.100.14 | Uptime Kuma, Homepage, Speedtest Tracker | Service monitoring and dashboard |

## Ansible Automation

The entire infrastructure is managed as code with Ansible.


### Project Structure

```
homelab/
├── inventory/
│   ├── hosts.yml                  # VM inventory with IPs
│   └── group_vars/
│       ├── all/
│       │   ├── vars.yml           # Global variables (timezone, networks, Docker user)
│       │   └── vault.yml          # Encrypted secrets (Ansible Vault)
│       ├── proxy/
│       │   ├── services.yml       # Caddy container definition
│       │   └── firewall.yml       # Port 80/443 access rules
│       ├── streaming/
│       │   ├── services.yml       # Jellyfin, Jellyseerr, Cloudflared
│       │   └── firewall.yml
│       ├── arr/
│       │   ├── services.yml       # Radarr, Sonarr, Prowlarr, Bazarr
│       │   └── firewall.yml
│       ├── downloader/
│       │   ├── services.yml       # qBittorrent + Gluetun VPN
│       │   └── firewall.yml
│       └── monitoring/
│           ├── services.yml       # Uptime Kuma, Homepage, Speedtest
│           └── firewall.yml
├── playbooks/
│   ├── all.yml                    # Master playbook (imports all others)
│   ├── base.yml                   # System updates + SSH hardening + Docker
│   ├── proxy.yml                  # Caddy deployment
│   ├── streaming.yml              # Media stack deployment
│   ├── arr.yml                    # Library automation deployment
│   ├── downloader.yml             # VPN + torrent deployment
│   ├── monitoring.yml             # Monitoring stack deployment
│   └── firewall.yml               # UFW rules for all VMs
└── roles/
    ├── ssh_hardening/             # Disables password auth, root login, limits retries
    ├── docker_compose/            # Generic role: templates + deploys any Docker stack
    ├── nfs_media/                 # Mounts ZFS NFS shares on VMs that need media access
    └── firewall/                  # Applies per-VM UFW rules from group_vars
```

### Reusable Docker Compose Role

The core of the automation is a generic `docker_compose` role that can deploy any stack. Services are defined as data in `group_vars`, and the role uses Jinja2 templates to generate `docker-compose.yml` files and systemd unit files for each VM:

```yaml
# Example: inventory/group_vars/monitoring/services.yml
docker_compose_stack_name: monitoring

docker_compose_services:
- name: uptime-kuma
  image: louislam/uptime-kuma:latest
  ports:
  - "3001:3001"
  volumes:
  - "{{ docker_compose_base_dir }}/{{ docker_compose_stack_name }}/uptime-kuma:/app/data"
  environment:
    TZ: "{{ timezone }}"
```

This approach means adding a new service to any VM is just a matter of adding an entry to the YAML file.

### Systemd Integration

Each Docker Compose stack is managed as a systemd service, ensuring containers start automatically on boot and can be controlled with standard Linux service management:

```ini
[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/bin/docker compose up -d --remove-orphans
ExecStop=/usr/bin/docker compose down
```


## Security

Security is applied at multiple layers across the infrastructure:

- **SSH Hardening**: Password authentication disabled, root login blocked, maximum 3 authentication attempts
- **Network Segmentation**: Homelab VMs isolated on their own subnet (`192.168.100.0/24`), separated from the main home network
- **Per-VM Firewall Rules**: UFW rules defined per VM in `group_vars`, restricting each service port to only the source IPs that need access (specific VMs, main LAN, or Netbird VPN)
- **VPN-Tunneled Downloads**: qBittorrent traffic is routed through a Gluetun container connected to ProtonVPN via WireGuard, ensuring all download traffic is encrypted
- **Secret Management**: All sensitive values (VPN keys, Cloudflare tokens, passwords) stored in Ansible Vault
- **Remote Access**: Netbird (WireGuard-based mesh VPN) for secure access from outside the home network


## What I Learned

This project gave me hands-on experience with skills directly applicable to professional infrastructure work:

- Designing and managing a segmented network with proper routing between subnets
- Writing reusable, idempotent Ansible roles with Jinja2 templating
- Managing secrets securely with Ansible Vault
- Running and maintaining containerized services with Docker Compose
- Implementing defense-in-depth security (network isolation, firewall rules, SSH hardening, VPN tunneling)
- Working with ZFS for reliable storage and NFS for shared media access across VMs
- Troubleshooting real infrastructure issues across networking, DNS, storage, and containerization