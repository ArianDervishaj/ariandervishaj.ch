---
layout: /src/layouts/ProjectLayout.astro
title: 'Footprinting and Scanning CTF'
description: 'A reconnaissance and enumeration challenge demonstrating network scanning, service fingerprinting, and information gathering techniques to capture hidden flags.'
languages: ["nmap","mysql"]
category: "ctf"
--- 

Footprinting and Scanning CTF is a practical penetration testing challenge from the eLearnSecurity Junior Penetration Tester (eJPT) certification path. This hands-on exercise demonstrates systematic information gathering techniques used in the initial phases of security assessments to identify attack vectors and uncover sensitive information.

## Challenge Objective

The goal was to perform comprehensive reconnaissance on a target system and capture four hidden flags through:
- Network port scanning and service enumeration
- HTTP reconnaissance and web directory discovery
- Anonymous FTP access exploitation
- Database enumeration using discovered credentials

## Challenge Environment

**Target System:** `target.ine.local` (http://target.ine.local)  
**Attack Platform:** Kali Linux with GUI access  
**Scope:** Full network and service enumeration

## Flag Hints Provided

| **Flag** | **Hint** |
|--------------|----------|
| Flag 1 | The server proudly announces its identity in every response. Look closely for unusual information. |
| Flag 2 | The gatekeeper's instructions often reveal what should remain unseen. Read between the lines. |
| Flag 3 | Anonymous access sometimes leads to forgotten treasures. Connect and explore the directory. |
| Flag 4 | A well-named database can be quite revealing. Peek at the configurations to discover the treasure. |

## Reconnaissance Methodology

### Step 1 - Host Discovery

**Verified Target Availability**

Confirmed the target was reachable using ICMP ping:

```bash
ping -c 4 target.ine.local
```

**Result:** Host responded successfully, confirming network connectivity to the target.

### Step 2 - Comprehensive Port Scanning

**Full TCP Port Enumeration**

Performed a complete TCP port scan to identify all listening services:

```bash
nmap -T4 -sS -p- target.ine.local
```

**Scan Parameters:**
- `-p-`: Scans all 65,535 TCP ports (complete coverage)
- `-sS`: SYN scan (stealth mode, requires root privileges)
- `-T4`: Aggressive timing template for faster results

**Discovered Open Ports:**

```
PORT      STATE SERVICE
21/tcp    open  ftp
22/tcp    open  ssh
25/tcp    open  smtp
80/tcp    open  http
143/tcp   open  imap
993/tcp   open  imaps
3306/tcp  open  mysql 
33060/tcp open  mysqlx
MAC Address: 02:42:C0:66:E4:03 (Unknown)
```

**Analysis:** Multiple interesting services discovered, including FTP, HTTP, and MySQL - all potential attack vectors based on the challenge hints.

### Step 3 - Service Fingerprinting

**Detailed Service Version Detection**

Performed targeted service enumeration and OS fingerprinting on discovered ports:

```bash
nmap -T4 -sV -O -p 21,22,25,80,143,993,3306,33060 -v target.ine.local
```

**Scan Parameters:**
- `-sV`: Service version detection
- `-O`: Operating system detection
- `-v`: Verbose output for detailed results

**Service Identification Results:**

```
21/tcp    open  ftp      vsftpd 3.0.5
80/tcp    open  http     Werkzeug/3.0.6 Python/3.10.12
3306/tcp  open  mysql    MySQL 8.0.40-0ubuntu0.22.04.1
```

## Flag Capture Process

### Flag 1 - HTTP Server Header Disclosure

**Information Disclosure via HTTP Headers**

The service version scan revealed custom HTTP response headers:

```
|_http-server-header: Werkzeug/3.0.6 Python/3.10.12
...
|     Server: FLAG1_XXXX
```

**Finding:** The web server included the first flag directly in its HTTP response headers - a classic example of information disclosure through verbose server configurations.

**Security Impact:** Custom or verbose server headers can leak sensitive information to attackers during reconnaissance.

### Flag 2 - Robots.txt Enumeration

**Web Crawling Directives Analysis**

The Nmap HTTP scripts detected a `robots.txt` file with restricted directories:

```
| http-robots.txt: 3 disallowed entries 
|_/photos /secret-info/ /data/
```

**Web Application Investigation**

Navigated to the disallowed path `/secret-info/` using Firefox:

![Robots.txt Discovery](/images/projects/footprinting-ctf/image-1.png)

**Result:** Found Flag 2 hidden in the restricted directory content.

![Flag 2 Captured](/images/projects/footprinting-ctf/image-3.png)

**Security Impact:** `robots.txt` files are publicly accessible and often reveal sensitive directories that administrators want hidden from search engines, making them prime reconnaissance targets.

### Flag 3 - Anonymous FTP Exploitation

**FTP Service Enumeration**

The port scan identified anonymous FTP access was enabled:

```
21/tcp    open  ftp      vsftpd 3.0.5
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-r--r--    1 0        0              22 Oct 28  2024 creds.txt
|_-rw-r--r--    1 0        0              39 Sep 28 18:54 flag.txt
```

**Anonymous FTP Connection**

Connected to the FTP server without authentication and retrieved available files:

```bash
ftp anonymous@192.102.228.3
# Password: <blank or any value>
# 230 Login successful.

ftp> ls
ftp> get creds.txt
ftp> get flag.txt
ftp> quit
```

**Flag Retrieval**

Examined the downloaded flag file:

```bash
cat flag.txt
FLAG3_XXXXX
```

**Credentials Discovery**

Additionally discovered database credentials in `creds.txt`:

```bash
cat creds.txt
db_admin:password@123
```

**Security Impact:** Anonymous FTP access is a critical misconfiguration that can expose sensitive files and credentials. This finding enabled access to the database in the next stage.

### Flag 4 - MySQL Database Enumeration

**Database Connection Using Discovered Credentials**

Connected to the MySQL instance using credentials obtained from FTP:

```bash
mysql -h 192.102.228.3 -u db_admin -p
# Enter password: password@123
```

**Database Enumeration**

Listed all available databases:

```sql
SHOW DATABASES;
```

**Flag Discovery**

The database listing revealed the final flag:

![MySQL Connection](/images/projects/footprinting-ctf/image-4.png)

![Flag 4 in Database Name](/images/projects/footprinting-ctf/image-5.png)

**Result:** The fourth flag was embedded directly in a database name, demonstrating the importance of thorough enumeration of all discovered services.

**Security Impact:** Weak database credentials combined with network exposure allow attackers to enumerate database structures and potentially access sensitive data.

## Attack Chain Summary

The complete exploitation chain followed this sequence:

1. **Network Discovery** → Identified accessible target
2. **Port Scanning** → Discovered multiple open services
3. **Service Fingerprinting** → Identified specific versions and configurations
4. **HTTP Enumeration** → Found Flag 1 in headers, Flag 2 in robots.txt
5. **FTP Exploitation** → Retrieved Flag 3 and database credentials
6. **Database Access** → Used credentials to find Flag 4
