---
layout: /src/layouts/ProjectLayout.astro
title: 'Auto-Resilient Infrastructure - SOAR Decision Engine'
description: 'A semester project building an automated security orchestration and response (SOAR) system that receives attack alerts, scores their severity, and executes CACAO playbooks for auto-remediation with minimal human intervention.'
languages: ["python","wazuh","proxmox"]
category: "project"
sortOrder: 2
--- 

> **Status: In Progress** - October 2025 to March 2026

**Auto-Resilient Infrastructure** is a semester project at HEPIA, conducted in a team of 3. The goal is to build an infrastructure that can detect, evaluate, and respond to security threats automatically with minimal human intervention.

The project is split into three parts across the team:

- **Infrastructure inventory and deployment** (Puppet, Proxmox)
- **Attack detection** (Wazuh SIEM, OpenVAS vulnerability scanning)
- **Decision engine and automated response** (my part : Python SOAR engine with CACAO playbooks)

The full project is available on [GitHEPIA](https://githepia.hesge.ch/projets-tudiants/2025/infra-auto-resiliente-arian).

## My Contribution: The Decision Engine

I built a custom SOAR (Security Orchestration, Automation and Response) engine in Python that sits between Wazuh (detection) and the infrastructure (remediation). When Wazuh detects a threat, it sends an alert via webhook to my engine, which processes it through a 4-stage pipeline:

```
Wazuh Alert -> Parse -> Enrich -> Decide -> Execute
```

### 1. Parse

Incoming Wazuh alerts are parsed to extract key information: rule ID, severity level, attacker IP, victim hostname, and agent ID.

### 2. Enrich

The engine enriches the alert with context from three sources:

- **PuppetDB** - queries host facts to get the environment (prod/staging/dev), role, and whether auto-remediation is allowed on that host
- **Wazuh** - CIS compliance score
- **Proxmox API** - resolves the VM ID, node, network configuration, and latest snapshot name (for potential rollback)

### 3. Decide (Severity Scoring)

The engine calculates a severity score from 0 to 100 using an additive weighted model:

```
SEVERITY = 50 x ImpactScore + 25 x (1 - CIS_Score) + 25 x ContextFactor
```

Where:

- **ImpactScore (50%)** - derived from the Wazuh alert level (0-15 scale), because the threat itself should be the primary driver
- **CIS Compliance Gap (25%)** - a poorly hardened system amplifies the risk of any alert
- **ContextFactor (25%)** - environment type (production vs. dev), with production weighing more heavily

The scoring model was chosen after evaluating CREF-based impact scoring (MITRE), CVSS sub-scores, and SecurityScorecard's multiplicative model. The additive approach was selected for its transparency, explainability, and avoidance of the zero-multiplication problem.

The severity score combined with the alert category determines the action:

| Category | Severity | Action | Human Involved? |
|----------|----------|--------|----------------|
| Intrusion / Malware | < 80 | Auto-remediate | No |
| Intrusion / Malware | >= 80 | Auto-remediate + escalate | Notified after |
| Vulnerability | < 60 | Notify only | No |
| Vulnerability | >= 60 | Isolate + escalate | Yes (must patch manually) |
| Any (remediation disabled) | Any | Notify + escalate | Yes |

For intrusions and malware, the engine always acts first and never waits for human approval, escalation is purely informational. Vulnerabilities require human intervention for patching, so the engine only isolates the machine and escalates.

An additional safety constraint ensures that hosts with `auto_remediation_allowed = false` are never auto-remediated regardless of score.

### 4. Execute (CACAO Playbooks)

When the decision is to act, the engine executes CACAO 2.0 playbooks - a standardized format for security automation workflows. I built a custom CACAO executor that supports SSH commands, bash execution, and HTTP API calls.

Current playbooks cover:

- **Brute force** - blocks attacker IP via iptables, waits a configured duration, then unblocks
- **Malware** - takes a forensic snapshot of the VM, isolates it by disconnecting the network interface via Proxmox API, then restores from the latest clean snapshot
- **CVE vulnerability** - isolates the VM and escalates to a human for manual patching

## Architecture

```
+-------------+     webhook     +--------------------------+
|   Wazuh     | ----------------->  Flask Server            |
|   (SIEM)    |                 |  +-- Parser               |
+-------------+                 |  +-- Enricher             |
                                |  |   +-- PuppetDB query   |
+-------------+                 |  |   +-- Proxmox API      |
|  PuppetDB   |<----------------|  +-- Decision Engine      |
|  (facts)    |                 |  +-- CACAO Executor       |
+-------------+                 |      +-- SSH commands     |
                                |      +-- Bash execution   |
+-------------+                 |      +-- Proxmox API     |
|  Proxmox    |<----------------|         (isolate/restore) |
|  (VMs)      |                 +--------------------------+
+-------------+
```

## Technologies Used

- **Python** (Flask) - SOAR engine and webhook server
- **CACAO 2.0** - Standardized security playbook format
- **Wazuh** - SIEM and alert source
- **PuppetDB** - Host fact enrichment (environment, role)
- **Proxmox VE API** - VM management (snapshots, network isolation, restoration)
- **OpenVAS** - CVE vulnerability detection (teammate's part)

## Current Progress and Next Steps

**Completed:**
- Full decision engine pipeline (parse, enrich, decide, execute)
- Severity scoring model with literature-backed weight justification
- CACAO executor supporting SSH, bash, and HTTP API commands
- Playbooks for brute force, malware, and CVE response
- Webhook server with alert cooldown to prevent duplicate processing
- Proxmox integration for VM snapshots, isolation, and restoration

**In progress:**
- Refining OpenVAS rule ID mappings for CVE playbooks
- Additional CACAO playbooks
- Refining the decision logic with additional context factors
- End-to-end testing with live Wazuh alerts