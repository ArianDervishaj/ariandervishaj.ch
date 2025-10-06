---
layout: /src/layouts/ProjectLayout.astro
title: 'MAC Flooding Attack Lab'
description: 'A hands-on lab demonstrating MAC flooding attacks to saturate switch CAM tables and implementing mitigation solutions using Port Security.'
languages: ["gns3","wireshark","networking"]
category: "lab"
--- 

**MAC Flooding Attack Lab** is a practical cybersecurity lab exploring network switch vulnerabilities through MAC flooding attacks. This hands-on implementation demonstrates how attackers can saturate CAM tables to compromise network segmentation, and showcases defense mechanisms using Cisco Port Security features.

Built with **Cisco switches**, **Wireshark**, and **macof.py**, this project provides real-world experience with layer 2 network attacks and enterprise security controls.

## Project Objective

The goal was to understand and implement layer 2 security concepts, including:
- Switch CAM table operation and vulnerabilities
- MAC flooding attack execution and analysis
- Port Security configuration for attack mitigation
- Network traffic analysis during security incidents

## Network Topology

![Network Topology](/images/projects/macflood/topo_1.png)

## Host Configuration

### Attacker Host (H5) Setup

**Network Interface Configuration**

Modified `/etc/network/interfaces` for persistent configuration:

```bash
# Management interface (used for dhclient)
auto mgmt0
iface mgmt0 inet dhcp

# Ethernet interface eth0
auto eth0
iface eth0 inet static
address 10.0.0.5
netmask 255.255.255.0
hwaddress ether 00:00:00:00:00:05
```

**Configuration Details:**
- `mgmt0`: Configured for DHCP to enable remote management and internet access
- `eth0`: Static IP assignment (10.0.0.5/24) for consistent lab environment
- Custom MAC address (00:00:00:00:00:05) for tracking in CAM tables

**Hostname Configuration**

Set permanent hostname in `/etc/hostname`:

```bash
H5
```

**Attack Tool Installation**

Installed macof.py for MAC flooding attacks:

```bash
apt update
apt -y --no-install-recommends install git python3-pip python-is-python3 tcpreplay
pip3 install scapy
git clone https://github.com/WhiteWinterWolf/macof.py.git
cd macof.py
chmod 755 macof.py && cp macof.py /usr/local/bin/
```

### Victim Hosts (H4, H6, H7) Setup

Configured victim hosts with simplified network settings (no management interface needed):

```bash
# Ethernet interface eth0 
auto eth0
iface eth0 inet static
    address 10.0.0.X 
    netmask 255.255.255.0 
    hwaddress ether 00:00:00:00:00:XX
```

## Normal Switch Operation

### Theory: CAM Table Learning Process

**Initial State - Learning Mode**

When a network is first configured, switch CAM (Content Addressable Memory) tables are empty. Switches enter learning mode to build their MAC address tables:

1. **MAC Learning Process:**
   - Switch examines the source MAC address of incoming frames
   - Associates this MAC address with the receiving port
   - Stores the mapping in its CAM table for future forwarding decisions

2. **Frame Flooding for Unknown Destinations:**
   - When a frame arrives with an unknown destination MAC address, the switch floods it to all ports in the same VLAN (except the incoming port)
   - This flooding continues until the destination host responds, allowing the switch to learn its location

3. **Traffic Optimization:**
   - Once CAM tables are populated through ARP traffic and normal communications, switches can forward unicast frames directly to the appropriate port
   - Flooding becomes rare as most MAC addresses are learned

### Practical Demonstration

**Initial CAM Table State**

Viewed empty CAM table on switch S2:

![Empty CAM Table](/images/projects/macflood/20250103205517.png)

**First Ping - Observing Flooding Behavior**

Executed ping from H5 to H6:

```bash
ping 10.0.0.6 -c 1
```

**Result:** Since the CAM table was empty, the ICMP Request was broadcast to all ports in the VLAN.

Wireshark capture on S2-H6 and S2-H7 links confirmed the broadcast behavior:

![Broadcast Traffic](/images/projects/macflood/20250103210027.png)

**CAM Table After First Ping**

Viewed updated CAM table showing learned MAC addresses:

![Updated CAM Table](/images/projects/macflood/20250103210343.png)

**Observation:** Switch learned MAC addresses for both H5 and H6, associating each with its respective port.

**Second Ping - Optimized Forwarding**

Repeated ping from H5 to H6:

![Optimized Traffic](/images/projects/macflood/20250103210959.png)

**Results:**
- S2-H6 link: Both ICMP Request and Reply visible (proper forwarding)
- S2-H7 link: No traffic observed (no unnecessary flooding)

**Conclusion:** Switch now uses its populated CAM table to forward frames efficiently to specific ports only.

## MAC Flooding Attack

### Attack Theory

**MAC Flooding** is a layer 2 network attack that exploits switch CAM table vulnerabilities. The attack aims to saturate the CAM table, forcing the switch into fail-open mode.

**Attack Mechanism:**

- **Exploitation Method:**
  - Attacker sends numerous frames with randomized, spoofed source MAC addresses
  - Switch attempts to learn and store all these fake MAC addresses in its CAM table
  - CAM table quickly reaches maximum capacity and can no longer store legitimate entries

- **Attack Impact:**
  - When CAM table is full, switch enters **fail-open mode**:
    - Cannot associate MAC addresses with specific ports
    - Begins broadcasting all frames to all ports (hub-like behavior)
  - This allows the attacker to:
    - **Intercept network traffic** destined for other devices (man-in-the-middle capability)
    - **Create network congestion**, degrading overall performance

### Attack Implementation

**Launching the MAC Flood Attack**

Executed attack from H5 using macof.py:

```bash
macof.py -i eth0 -c 8192 -w 1
```

**Command Parameters:**
- `-i eth0`: Specifies the interface for flooding
- `-c 8192`: Generates 8192 random MAC addresses
- `-w 1`: Sets 1 second delay between frames

**Attack Traffic Capture:**

![MAC Flooding Traffic](/images/projects/macflood/20250103214321.png)

**Verified CAM Table Saturation**

Checked CAM table entries on switch:

![Saturated CAM Table](/images/projects/macflood/20250103214416.png)

**Analysis:**
- CAM table entries approaching maximum capacity
- Switch forced into fail-open mode, broadcasting all traffic like a hub
- 3-entry difference from maximum (requires further investigation)

**Demonstrating Attack Impact**

During active MAC flooding, tested normal network communication with ping from H6 to H7:

![Attack Impact - Request](/images/projects/macflood/20250103214734.png)

![Attack Impact - Reply](/images/projects/macflood/20250103214757.png)

**Observed Effects:**
- Both ICMP Request and Reply broadcast to all ports throughout the topology
- Even the H5-S2 link (unrelated to the ping) received the traffic
- Network operating in hub mode, completely compromising switch segmentation

## Mitigation Implementation

### Port Security Configuration

To defend against MAC flooding attacks, Cisco **Port Security** limits the number of MAC addresses learned per port and defines actions for security violations. Logging enables detection and monitoring of attack attempts.

**Available Violation Actions:**

| **Mode**   | **Description**                                                                 |
|------------|---------------------------------------------------------------------------------|
| `protect`  | Drops frames from unauthorized MAC addresses without logging or port shutdown    |
| `restrict` | Drops frames from unauthorized MACs and generates security violation logs        |
| `shutdown` | Completely disables the port when a violation occurs (most secure)               |

### Mitigation Topology

![Mitigation Topology](/images/projects/macflood/topo_2.png)

### Port Security Implementation

**Configured Port Security on S1 Interface Gi0/1 (H1 connection):**

```shell
enable
configure terminal
interface GigabitEthernet0/1
switchport mode access
switchport port-security
switchport port-security maximum 8 
switchport port-security violation shutdown
switchport port-security aging time 1
switchport port-security aging type inactivity
exit
errdisable recovery cause psecure-violation
errdisable recovery interval 60
logging console 7
end
```

**Configuration Explanation:**

- `switchport port-security maximum 8`: Limits dynamic MAC address learning to 8 addresses per port
- `switchport port-security violation shutdown`: Disables port immediately upon violation (strongest protection)
- `switchport port-security aging time 1` + `aging type inactivity`: Removes inactive MAC addresses after 1 minute of inactivity
- `errdisable recovery cause psecure-violation`: Enables automatic recovery from err-disabled state
- `errdisable recovery interval 60`: Automatically re-enables port after 60 seconds
- `logging console 7`: Enables detailed debugging logs (level 7) for all security events

**Verification - Port Security Status**

Confirmed Port Security configuration:

```shell
show port-security
```

![Port Security Status](/images/projects/macflood/20250103222318.png)

**Detailed Interface Security Settings:**

```shell
show port-security interface GigabitEthernet 0/1
```

![Interface Security Settings](/images/projects/macflood/20250103222354.png)

**Testing Mitigation Effectiveness**

Launched MAC flooding attack from H1:

```bash
macof.py -i eth0 -c 1000 -w 1
```

**Verified Port Shutdown Response**

Checked interface status after attack:

```shell
show interfaces status
```

![Port Shutdown](/images/projects/macflood/20250103222507.png)

**Result:** Interface Gi0/1 automatically entered err-disabled state, successfully blocking the attack.

**Monitoring Auto-Recovery**

Reviewed system logs after 1-minute recovery interval:

```shell
show logging
```

![Recovery Logs](/images/projects/macflood/20250103222638.png)

**Observed Behavior:**
- Interface Gi0/1 transitioned to "down" state upon violation detection
- Automatic recovery triggered after 60 seconds
- Interface returned to "up" state, resuming normal operation

## Outcome

Successfully demonstrated a complete network security attack and defense scenario, including:
- Understanding switch CAM table vulnerabilities and operation
- Executing layer 2 MAC flooding attacks with traffic analysis
- Implementing enterprise-grade Port Security mitigation controls
- Configuring automated security response and recovery mechanisms
- Analyzing attack patterns through network traffic inspection