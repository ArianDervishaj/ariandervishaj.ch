---
layout: /src/layouts/ProjectLayout.astro
title: 'Information Gathering CTF'
description: 'A web application reconnaissance challenge demonstrating passive and active information gathering techniques to identify vulnerabilities and capture hidden flags.'
languages: ["nmap","dirb", "httrack"]
category: "ctf"
--- 

**Information Gathering CTF** is a practical web application security challenge from the eLearnSecurity Junior Penetration Tester (eJPT) certification path. This hands-on exercise demonstrates comprehensive reconnaissance methodologies used to enumerate web applications, discover hidden files, and identify configuration weaknesses.

This challenge showcases essential penetration testing skills including service enumeration, directory brute-forcing, and static content analysis using industry-standard tools like Nmap, dirb, curl, and HTTrack.

## Challenge Objective

The goal was to perform thorough information gathering on a WordPress target and capture five hidden flags through:
- Web server and CMS version identification
- Directory enumeration and browsing
- Backup file discovery
- Static content mirroring and analysis

## Challenge Environment

**Target System:** `target.ine.local` (http://target.ine.local)  
**Attack Platform:** Kali Linux  
**Target Application:** WordPress 6.5.3 on Apache 2.4.41 (Ubuntu)

## Information Gathering Methodology

### Flag 1 - Search Engine Directives Analysis

**Hint:** This tells search engines what to and what not to avoid.

**Robots.txt Enumeration**

Retrieved the robots.txt file to identify restricted directories:

```bash
curl -s http://target.ine.local/robots.txt
```

**Result:** The `robots.txt` file contained Flag 1 directly in its contents.

**Security Impact:** While `robots.txt` is intended to guide search engine crawlers, it often reveals sensitive directories that administrators want to keep hidden, making it a valuable reconnaissance target.

### Flag 2 - Web Server and CMS Fingerprinting

**Hint:** What website is running on the target, and what is its version?

**Service Version Detection**

Performed comprehensive service enumeration with version detection:

```bash
nmap -A -p80 target.ine.local
```

**Scan Parameters:**
- `-A`: Enables OS detection, version detection, script scanning, and traceroute
- `-p80`: Targets HTTP service specifically

**Enumeration Results:**

```plaintext
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
| http-robots.txt: 1 disallowed entry 
|_/wp-admin/
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-generator: WordPress 6.5.3 - FL@G2{XXXXX}
|_http-title: INE
```

**Findings:**
- **Web Server:** Apache 2.4.41 running on Ubuntu
- **CMS:** WordPress 6.5.3 identified via HTTP generator meta tag
- **Flag Location:** Nmap's http-generator script extracted Flag 2 from the HTML meta tag

**Security Impact:** Version information in HTTP headers and meta tags enables attackers to identify specific vulnerabilities associated with known software versions.

### Flag 3 - Directory Browsing Vulnerability

**Hint:** Directory browsing might reveal where files are stored.

**Directory Enumeration**

Performed automated directory discovery using dirb with default wordlist:

```bash
dirb http://target.ine.local
```

**Directory Brute-Force Results:**

```bash
-----------------
DIRB v2.22    
By The Dark Raver
-----------------

---- Entering directory: http://target.ine.local/wp-content/uploads/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                               
-----------------
END_TIME: Sun Sep 21 20:33:41 2025
DOWNLOADED: 32284 - FOUND: 13
```

**Vulnerability Discovery:**

The `/wp-content/uploads/` directory had directory listing enabled, allowing direct browsing of uploaded files.

**Result:** Navigated to `http://target.ine.local/wp-content/uploads/` in a browser and retrieved Flag 3 from the exposed file listing.

**Security Impact:** Directory listing vulnerabilities expose the entire directory structure and file names, potentially revealing sensitive documents, backup files, or information about the application's architecture.

### Flag 4 - Backup File Discovery

**Hint:** An overlooked backup file in the webroot can be problematic if it reveals sensitive configuration details.

**Targeted Backup File Enumeration**

Performed directory brute-forcing with custom extensions targeting common backup file formats:

```bash
dirb http://target.ine.local -w /usr/share/dirb/wordlists/big.txt -X .bak,.tar.gz,.zip
```

**Command Parameters:**
- `-w`: Specifies custom wordlist (big.txt for comprehensive coverage)
- `-X`: File extension filter to specifically search for `.bak`, `.tar.gz`, and `.zip` files

**Discovery:**

Found `wp-config.bak` exposed in the webroot - a backup of WordPress's main configuration file.

**Configuration File Retrieval**

Downloaded and inspected the backup configuration file:

```bash
curl http://target.ine.local/wp-config.bak
cat wp-config.bak
```

**Result:** The `wp-config.bak` file contained Flag 4 along with sensitive configuration data.

**Security Impact:** Backup files (`.bak`, `.old`, `.backup`) left in web-accessible directories are critical vulnerabilities. WordPress's `wp-config.php` typically contains:
- Database credentials
- Authentication keys and salts
- Database connection details
- Other sensitive configuration parameters

Exposing this file provides attackers with everything needed to compromise the database and potentially the entire application.

### Flag 5 - Static Content Analysis

**Hint:** Certain files may reveal something interesting when mirrored.

**Website Mirroring**

Used HTTrack to create a complete local mirror of the target website for offline analysis:

```bash
httrack
# Follow interactive prompts:
# Project name: ctf
# Base path: ./websites
# URL: http://target.ine.local
```

**HTTrack Parameters:**
HTTrack recursively downloads the entire website, including HTML, CSS, JavaScript, images, and other linked resources.

**Static Content Search**

Navigated to the mirrored site and performed pattern matching for the flag:

```bash
cd websites/ctf/target.ine.local
cat * | grep FLAG5
```

**Result:** Flag 5 was embedded in one of the static files downloaded during the mirroring process.

![Flag 5 Discovery](/images/projects/info-gathering-ctf/image-6.png)
