---
layout: /src/layouts/ProjectLayout.astro
title: 'Self-Hosted Homelab Infrastructure'
description: 'A fully automated self-hosted infrastructure running on Proxmox, provisioned with Terraform and configured with Ansible for reproducible deployments of media, monitoring, and networking services.'
languages: ["ansible","terraform","docker","proxmox","linux"]
category: "project"
sortOrder: 0
github: 'https://github.com/ArianDervishaj/homelab'
---

This is a personal infrastructure project built to self-host services and practice real-world system administration and Infrastructure as Code. The entire stack runs on a Dell OptiPlex 7020 Micro with Proxmox VE. VMs are provisioned with [Terraform](https://github.com/ArianDervishaj/homelab-infra) and configured with [Ansible](https://github.com/ArianDervishaj/homelab), making every deployment reproducible from bare metal to running services.

The project covers VM provisioning, network segmentation, service containerization with Docker Compose, secret management with Ansible Vault, firewall hardening, and remote access.

## Hardware

- **Dell OptiPlex 7020 Micro**: Intel Core i5-12500T, 64GB RAM, 512GB SSD
- **Proxmox VE 8.4**: Type-1 hypervisor hosting all VMs
- **5TB ZFS pool ("tank")**: Provides NFS shares for media storage across VMs
- **Raspberry Pi 4B 8GB**: Dedicated Pi-hole DNS server for ad blocking and local DNS resolution

## Architecture

### Physical Layer

![Physical Layer](/images/projects/homelab/physical-layer.png)

### Logical Network

![Logical Network](/images/projects/homelab/logical-network.png)

The infrastructure is split into two networks:
- **Main LAN** (`192.168.1.0/24`): Home devices and router
- **Homelab subnet** (`192.168.100.0/24`): Isolated VM network for all services

A router VM bridges the two, keeping homelab traffic separated from the rest of the home network.

## Virtual Machines & Services

| **VM** | **IP** | **Services** | **Purpose** |
|--------|--------|-------------|-------------|
| router | 192.168.1.159 / 192.168.100.1 | gateway, NAT | Network bridge between subnets |
| proxy | 192.168.100.10 | Caddy | Reverse proxy for internal .lan services |
| streaming | 192.168.100.11 | Jellyfin, Jellyseerr, Cloudflared | Media streaming, external access via Cloudflare Tunnel |
| arr | 192.168.100.12 | Radarr, Sonarr, Prowlarr, Bazarr | Media library automation |
| downloader | 192.168.100.13 | qBittorrent, Gluetun | Downloads tunneled through ProtonVPN (WireGuard) |
| monitoring | 192.168.100.14 | Uptime Kuma, Homepage, Speedtest Tracker | Service monitoring and dashboard |
| library | 192.168.100.15 | Calibre-Web, Audiobookshelf | Ebook and audiobook library |

## Infrastructure as Code

The project is split into two repos, each handling a different layer.

### Terraform (VM Provisioning)

VMs are defined as a map and provisioned through a reusable module using the [bpg/proxmox](https://registry.terraform.io/providers/bpg/proxmox) provider. Each VM is cloned from a cloud-init template, gets a static IP, and is bootstrapped with an SSH user and qemu-guest-agent. Adding a new VM is one entry:
```hcl
"monitoring" = {
  ip_address = "192.168.100.14/24"
  tags       = ["terraform", "monitoring"]
}
```

### Ansible (Configuration Management)

Once provisioned, Ansible configures every VM. The core of the automation is a generic `docker_compose` role that can deploy any stack. Services are defined as data in `group_vars`, and the role templates out `docker-compose.yml` files and systemd units:
```yaml
docker_compose_stack_name: monitoring

docker_compose_services:
- name: uptime-kuma
  image: louislam/uptime-kuma:2
  ports:
  - "3001:3001"
  volumes:
  - "{{ docker_compose_base_dir }}/{{ docker_compose_stack_name }}/uptime-kuma:/app/data"
  environment:
    TZ: "{{ timezone }}"
```

Adding a new service to any VM is just adding an entry to the YAML file. Each stack runs as a systemd service so containers come up on boot.

## Security

- **Network isolation:** Homelab VMs live on a dedicated `192.168.100.0/24` subnet behind a router VM that bridges to the main LAN. Inter-network traffic is controlled at the routing layer.
- **Host firewalls:** Each VM has iptables rules defined in Ansible with a default INPUT policy of DROP. Only explicitly allowed ports and sources are permitted, scoped per host.
- **SSH hardening:** Password auth disabled, root login denied, max 3 attempts. Key-only access everywhere.
- **VPN kill switch:** The downloader VM routes all traffic through ProtonVPN via gluetun. If the VPN drops, traffic is blocked.
- **Service segmentation:** Each service category gets its own VM to limit blast radius if one gets compromised.
- **Reverse proxy:** Caddy handles internal routing for all `.lan` services.
- **External access:** Public-facing services (streaming) go through a Cloudflare Tunnel. No inbound ports opened on the home network.
- **Secrets management:** All sensitive values (API keys, tunnel credentials) encrypted with Ansible Vault.

## What I Learned

- Provisioning infrastructure with Terraform using reusable modules and cloud-init
- Designing and managing a segmented network with proper routing between subnets
- Writing reusable, idempotent Ansible roles with Jinja2 templating
- Managing secrets with Ansible Vault
- Running containerized services with Docker Compose and systemd
- Implementing defense-in-depth (network isolation, per-host firewalls, SSH hardening, VPN tunneling)
- Working with ZFS and NFS for shared storage across VMs
- Debugging real infrastructure problems across networking, DNS, storage, and containers