---
layout: /src/layouts/ProjectLayout.astro
title: 'SIEM Implementation with ELK Stack'
description: 'A SIEM infrastructure deployment for network and system monitoring using the open-source ELK Stack (Elasticsearch, Logstash, Kibana).'
languages: ["elk","proxmox"]
category: "lab"
sortOrder: 3
--- 

**SIEM Implementation with ELK Stack** is a security monitoring project completed as part of the Security Workshop course at HEPIA (Geneva School of Engineering, Architecture and Landscape). This team project was conducted by me and two other students.

The objective was to design and deploy a network and system monitoring infrastructure using open-source tools.

## Project Objectives

* Implement a SIEM (Security Information and Event Management) system
* Collect, store, and analyze security events in a simulated network
* Deploy and configure the ELK Stack (Elasticsearch, Logstash, Kibana)
* Create Kibana dashboards to visualize logs and monitor network activity

## Technologies Used

* **Proxmox VE**: Open-source hypervisor for virtualization
* **Debian**: Operating system for VMs (workstations, servers, routers)
* **ELK Stack**: Elasticsearch, Logstash, Kibana
* **Beats**: Filebeat, Metricbeat, Packetbeat, Heartbeat
* **NetBird (WireGuard VPN)**: Collaborative and secure infrastructure access

## Network Topology

![Network Infrastructure](/images/projects/siem/topology.png)

The infrastructure simulates a small-to-medium enterprise (SME) network with:
- Multiple VLANs (IT, Sales, Communications)
- DMZ with web and guest servers
- Admin network
- Routers and switches

## Implementation

### 1. Virtual Network Setup

Deployed a complete network infrastructure simulating an SME environment:
- Segregated VLANs for different departments
- DMZ for public-facing services
- Administrative network for management
- Multi-tier routing architecture

### 2. Beats Agent Deployment

Installed and configured monitoring agents across all machines:
- **Filebeat**: Log file collection and forwarding
- **Metricbeat**: System and service metrics collection
- **Packetbeat**: Network traffic analysis
- **Heartbeat**: Service availability monitoring

### 3. ELK Stack Configuration

Set up centralized logging and analysis platform:
- **Elasticsearch**: Data storage and indexing
- **Logstash**: Log processing and transformation
- **Kibana**: Visualization and dashboard creation

### 4. Kibana Dashboard Creation

Developed comprehensive monitoring dashboards to track:
- **Machine Availability**: Real-time host uptime status

![Host Availability Dashboard](/images/projects/siem/availability.png)

- **System Resources**: RAM, and storage utilization

![System Resources Monitoring](/images/projects/siem/resources.png)

- **Network Traffic**: Protocol analysis, source/destination IPs, traffic patterns

![Network Traffic Analysis](/images/projects/siem/network_traffic.png)

- **Failed Authentication Attempts**: Security event detection and alerting

![Failed Authentication Attempts](/images/projects/siem/failed_auth.png)

## Results and Future Improvements

### Achievements

* Centralized monitoring of the entire infrastructure
* Operational dashboards for analysis and real-time monitoring
* Successful demonstration of attack scenarios and detection capabilities
* Complete visibility into network traffic and system performance

### Potential Improvements

Possible enhancements for future iterations include:
- Implementation of automated alerting mechanisms
- Enhanced security hardening of the ELK Stack
- Deployment automation using configuration management tools
- Integration of threat intelligence feeds
- Advanced correlation rules for complex attack detection

## Project Resources

Complete methodology, detailed results, and technical documentation are available in the [GitHub repository](https://github.com/ArianDervishaj/SIEM-ELK) or directly in [the project report](https://github.com/ArianDervishaj/SIEM-ELK/blob/main/Rendu_rapport.pdf).