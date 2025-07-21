"use client"

import Link from "next/link"
import { Terminal, ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"

// Synchronized decoding text animation component
function DecodingText({ 
  children: text, 
  className = "", 
  delay = 0 
}: { 
  children: string; 
  className?: string; 
  delay?: number;
}) {
  const [displayWords, setDisplayWords] = useState<Array<{ word: string; chars: string[]; resolved: boolean }>>([])
  const [isGlitching, setIsGlitching] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const animationFrameId = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const wordResolveTimes = useRef<number[]>([])

  const ANIMATION_DURATION_MS = 1500
  const GLITCH_CHANCE = 0.02

  const getRandomChar = () => {
    const hackChars = "!@#$%^&*()_+-=[]{}|;:,.<>?~`"
    const alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const specialChars = "█▓▒░▄▀■□▪▫"
    const allChars = hackChars + alphaNum + specialChars
    return allChars[Math.floor(Math.random() * allChars.length)]
  }

  useEffect(() => {
    const words = text.split(/(\s+)/)
    const initialWords = words.map(word => ({
      word,
      chars: word.split('').map(() => getRandomChar()),
      resolved: false
    }))
    setDisplayWords(initialWords)

    const timer = setTimeout(() => {
      setIsVisible(true)
      wordResolveTimes.current = words.map((_, i) => {
        const baseTime = (i / words.length) * ANIMATION_DURATION_MS * 0.8
        const randomVariation = Math.random() * ANIMATION_DURATION_MS * 0.4
        return baseTime + randomVariation
      })

      startTimeRef.current = performance.now()
      let frameCount = 0

      const animate = () => {
        const elapsed = performance.now() - (startTimeRef.current || 0)

        if (elapsed >= ANIMATION_DURATION_MS) {
          setDisplayWords(words.map(word => ({
            word,
            chars: word.split(''),
            resolved: true
          })))
          setIsGlitching(false)
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current)
          }
          return
        }

        frameCount++
        if (Math.random() < GLITCH_CHANCE) {
          setIsGlitching(true)
          setTimeout(() => setIsGlitching(false), 100)
        }

        setDisplayWords(prevWords => 
          prevWords.map((wordObj, wordIndex) => {
            if (elapsed >= wordResolveTimes.current[wordIndex]) {
              return {
                ...wordObj,
                chars: wordObj.word.split(''),
                resolved: true
              }
            } else {
              if (frameCount % 2 === 0) {
                return {
                  ...wordObj,
                  chars: wordObj.word.split('').map(char => 
                    char === ' ' ? ' ' : getRandomChar()
                  ),
                  resolved: false
                }
              }
              return wordObj
            }
          })
        )

        animationFrameId.current = requestAnimationFrame(animate)
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [text, delay])

  return (
    <span 
      className={`${className} ${isGlitching ? 'animate-pulse text-red-400' : ''} transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        wordBreak: 'break-word', 
        overflowWrap: 'anywhere',
        lineHeight: '1.5'
      }}
    >
      {displayWords.map((wordObj, wordIndex) => (
        <span 
          key={wordIndex}
          className="inline"
          style={{
            textShadow: isGlitching && !wordObj.resolved ? '2px 0 #ff0000, -2px 0 #00ffff' : 'none'
          }}
        >
          {wordObj.chars.join('')}
        </span>
      ))}
    </span>
  )
}

interface BlogPost {
  id: string
  title: string
  date: string
  readTime: string
  excerpt: string
  tags: string[]
  content: string
  slug: string
  published: boolean
}

// Mock blog posts data - in a real app, this would come from an API or database
const getBlogPost = (slug: string): BlogPost | null => {
  const posts: Record<string, BlogPost> = {
    "advanced-sql-injection": {
      id: "advanced-sql-injection",
      title: "Advanced SQL Injection in Modern Applications",
      date: "2024-01-15",
      readTime: "8 min read",
      excerpt: "Deep dive into bypassing modern WAFs and exploiting blind SQL injection vulnerabilities in contemporary web applications.",
      tags: ["sql-injection", "web-security", "penetration-testing"],
      slug: "advanced-sql-injection",
      published: true,
      content: `
▸ Introduction

SQL injection remains one of the most critical vulnerabilities in web applications, despite being well-documented for over two decades. In this post, we'll explore advanced SQL injection techniques that are still effective against modern applications.

▸ Understanding the Basics

Before diving into advanced techniques, let's review the fundamentals:

1. SQL injection occurs when user input is improperly sanitized
2. Attackers can manipulate SQL queries to access unauthorized data
3. Modern frameworks provide protection, but misconfigurations are common

▸ Advanced Techniques

◆ Blind SQL Injection

When applications don't return database errors, we can use blind techniques:

\`\`\`sql
' AND (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a'--
\`\`\`

This payload checks if the first character of the username for user ID 1 is 'a'. By iterating through all possible characters, we can extract the entire username.

◆ Time-Based Attacks

Using database-specific functions to create delays:

\`\`\`sql
'; WAITFOR DELAY '00:00:05'--
\`\`\`

If the application takes 5 seconds to respond, we know our injection was successful.

◆ Boolean-Based Blind Injection

When error messages aren't displayed, we can use boolean logic:

\`\`\`sql
' AND (SELECT COUNT(*) FROM users) > 10--
\`\`\`

◆ Union-Based Injection

Combining results from multiple queries:

\`\`\`sql
' UNION SELECT username, password FROM admin_users--
\`\`\`

▸ Bypassing WAFs and Filters

Modern Web Application Firewalls (WAFs) attempt to block malicious SQL injection attempts. Here are some bypass techniques:

1. **Encoding**: URL encoding, hex encoding, or unicode encoding
2. **Comment variations**: Using different comment styles (/**/, --, #)
3. **Case manipulation**: Mixing upper and lowercase letters
4. **Whitespace alternatives**: Using tabs, newlines, or other whitespace characters

▸ Prevention Strategies

1. **Use parameterized queries**: Always use prepared statements with parameter binding
2. **Input validation**: Implement strict input validation and sanitization
3. **Principle of least privilege**: Database users should have minimal necessary permissions
4. **Regular security testing**: Conduct periodic penetration testing and code reviews
5. **WAF implementation**: Deploy and properly configure Web Application Firewalls

▸ Detection and Monitoring

Set up monitoring for:
- Unusual database query patterns
- Multiple failed authentication attempts
- Unexpected data access patterns
- Error messages that might reveal database structure

▸ Real-World Examples

Recent SQL injection vulnerabilities have affected major applications, including:
- E-commerce platforms exposing customer data
- Government websites leaking sensitive information
- Financial applications compromising transaction data

▸ Conclusion

While SQL injection is an old vulnerability, it continues to plague modern applications due to developer oversight and complex application architectures. Understanding these techniques helps both attackers and defenders stay ahead of the curve.

Remember: This information is for educational and defensive purposes only. Always ensure you have proper authorization before testing any systems.
      `,
    },
    "vulnhunter-scanner": {
      id: "vulnhunter-scanner",
      title: "Building VulnHunter: A Python Security Scanner",
      date: "2024-01-08",
      readTime: "12 min read",
      excerpt: "Complete guide to building an automated vulnerability scanner using Python with async capabilities and custom payload generation.",
      tags: ["python", "automation", "security-tools"],
      slug: "vulnhunter-scanner",
      published: true,
      content: `
▸ Introduction

Building your own vulnerability scanner is an excellent way to understand security testing at a deeper level. In this guide, we'll create VulnHunter, a Python-based scanner with async capabilities and modular architecture.

▸ Project Architecture

Our scanner will be built with the following components:
- Core scanner engine
- Plugin system for different vulnerability types
- Async HTTP client for performance
- Reporting module

▸ Setting Up the Environment

First, let's set up our development environment:

\`\`\`bash
mkdir vulnhunter
cd vulnhunter
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install aiohttp asyncio beautifulsoup4 requests
\`\`\`

▸ Core Scanner Architecture

\`\`\`python
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import re
from typing import List, Dict, Any
import json
import time

class VulnHunter:
    def __init__(self, target_url: str, threads: int = 10):
        self.target = target_url
        self.threads = threads
        self.session = None
        self.vulnerabilities = []
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={'User-Agent': 'VulnHunter/1.0'}
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
\`\`\`

▸ Implementing Detection Modules

◆ SQL Injection Detection

\`\`\`python
class SQLInjectionDetector:
    def __init__(self, session):
        self.session = session
        self.payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT NULL--",
            "' AND 1=1--",
            "' AND 1=2--"
        ]
    
    async def test_parameter(self, url: str, param: str, value: str):
        vulnerabilities = []
        
        for payload in self.payloads:
            test_value = value + payload
            params = {param: test_value}
            
            try:
                async with self.session.get(url, params=params) as response:
                    content = await response.text()
                    
                    # Check for SQL error patterns
                    error_patterns = [
                        r"SQL syntax.*MySQL",
                        r"Warning.*mysql_.*",
                        r"ORA-[0-9]{5}",
                        r"SQLite error",
                        r"PostgreSQL.*ERROR"
                    ]
                    
                    for pattern in error_patterns:
                        if re.search(pattern, content, re.IGNORECASE):
                            vulnerabilities.append({
                                'type': 'SQL Injection',
                                'url': url,
                                'parameter': param,
                                'payload': payload,
                                'confidence': 'High'
                            })
                            break
                            
            except Exception as e:
                print(f"Error testing {url}: {e}")
                
        return vulnerabilities
\`\`\`

◆ XSS Detection

\`\`\`python
class XSSDetector:
    def __init__(self, session):
        self.session = session
        self.payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "'\"><script>alert('XSS')</script>",
            "<svg onload=alert('XSS')>"
        ]
    
    async def test_parameter(self, url: str, param: str, value: str):
        vulnerabilities = []
        
        for payload in self.payloads:
            test_value = payload
            params = {param: test_value}
            
            try:
                async with self.session.get(url, params=params) as response:
                    content = await response.text()
                    
                    # Check if payload is reflected in response
                    if payload in content:
                        vulnerabilities.append({
                            'type': 'Cross-Site Scripting (XSS)',
                            'url': url,
                            'parameter': param,
                            'payload': payload,
                            'confidence': 'Medium'
                        })
                        
            except Exception as e:
                print(f"Error testing {url}: {e}")
                
        return vulnerabilities
\`\`\`

▸ Form Discovery and Testing

\`\`\`python
async def discover_forms(self, url: str):
    forms = []
    
    try:
        async with self.session.get(url) as response:
            content = await response.text()
            soup = BeautifulSoup(content, 'html.parser')
            
            for form in soup.find_all('form'):
                form_data = {
                    'action': form.get('action', ''),
                    'method': form.get('method', 'GET').upper(),
                    'inputs': []
                }
                
                for input_tag in form.find_all(['input', 'textarea', 'select']):
                    input_data = {
                        'name': input_tag.get('name', ''),
                        'type': input_tag.get('type', 'text'),
                        'value': input_tag.get('value', 'test')
                    }
                    form_data['inputs'].append(input_data)
                
                forms.append(form_data)
                
    except Exception as e:
        print(f"Error discovering forms: {e}")
        
    return forms
\`\`\`

▸ Main Scanning Logic

\`\`\`python
async def scan(self):
    print(f"Starting scan of {self.target}")
    
    # Discover forms
    forms = await self.discover_forms(self.target)
    print(f"Found {len(forms)} forms")
    
    # Initialize detectors
    sql_detector = SQLInjectionDetector(self.session)
    xss_detector = XSSDetector(self.session)
    
    # Test each form
    tasks = []
    for form in forms:
        for input_field in form['inputs']:
            if input_field['name']:
                # Test for SQL injection
                tasks.append(sql_detector.test_parameter(
                    self.target, 
                    input_field['name'], 
                    input_field['value']
                ))
                
                # Test for XSS
                tasks.append(xss_detector.test_parameter(
                    self.target, 
                    input_field['name'], 
                    input_field['value']
                ))
    
    # Run all tests concurrently
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Collect vulnerabilities
    for result in results:
        if isinstance(result, list):
            self.vulnerabilities.extend(result)
    
    return self.vulnerabilities
\`\`\`

▸ Reporting

\`\`\`python
def generate_report(self):
    report = {
        'target': self.target,
        'scan_time': time.strftime('%Y-%m-%d %H:%M:%S'),
        'vulnerabilities_found': len(self.vulnerabilities),
        'vulnerabilities': self.vulnerabilities
    }
    
    # Save to JSON file
    with open(f'vulnhunter_report_{int(time.time())}.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\\n--- VulnHunter Scan Report ---")
    print(f"Target: {self.target}")
    print(f"Vulnerabilities found: {len(self.vulnerabilities)}")
    
    for vuln in self.vulnerabilities:
        print(f"\\n[{vuln['type']}] {vuln['confidence']} confidence")
        print(f"URL: {vuln['url']}")
        print(f"Parameter: {vuln['parameter']}")
        print(f"Payload: {vuln['payload']}")
\`\`\`

▸ Usage Example

\`\`\`python
async def main():
    target_url = "http://testphp.vulnweb.com/listproducts.php"
    
    async with VulnHunter(target_url) as scanner:
        vulnerabilities = await scanner.scan()
        scanner.generate_report()

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

▸ Advanced Features

To make VulnHunter more robust, consider adding:
- Directory enumeration
- SSL/TLS testing
- Authentication bypass testing
- Rate limiting and stealth mode
- Custom payload generation
- Integration with vulnerability databases

▸ Conclusion

Building security tools helps you understand both offensive and defensive security better. VulnHunter provides a solid foundation that you can extend with additional modules and detection capabilities.

Remember to only use this tool on systems you own or have explicit permission to test.
      `,
    },
    "malware-analysis-setup": {
      id: "malware-analysis-setup",
      title: "Setting Up a Home Malware Analysis Lab",
      date: "2024-01-01",
      readTime: "15 min read",
      excerpt: "Step-by-step guide to building an isolated malware analysis environment using virtual machines and specialized tools.",
      tags: ["malware-analysis", "homelab", "virtualization"],
      slug: "malware-analysis-setup",
      published: true,
      content: `
▸ Introduction

Setting up a proper malware analysis lab is crucial for safely examining suspicious files and understanding malware behavior. This guide will walk you through creating an isolated environment using virtual machines and specialized tools.

▸ Lab Requirements

◆ Hardware Requirements
- Minimum 16GB RAM (32GB recommended)
- 500GB+ available storage
- Multi-core processor with virtualization support
- Dedicated network interface (optional but recommended)

◆ Software Requirements
- VMware Workstation Pro or VirtualBox
- Windows 10/11 analysis VM
- Linux analysis VM (Ubuntu/Kali)
- Network monitoring tools

▸ Network Isolation Setup

Creating proper network isolation is critical:

\`\`\`bash
# Create isolated virtual network
sudo ip link add br-isolated type bridge
sudo ip addr add 192.168.100.1/24 dev br-isolated
sudo ip link set br-isolated up

# Block internet access
sudo iptables -I FORWARD -i br-isolated -j DROP
sudo iptables -I FORWARD -o br-isolated -j DROP
\`\`\`

▸ Windows Analysis VM Setup

◆ Base Configuration
1. Install Windows 10/11 in VM
2. Disable Windows Defender and automatic updates
3. Install analysis tools
4. Create clean snapshot before analysis

◆ Essential Tools Installation

\`\`\`powershell
# Disable Windows Defender via PowerShell
Set-MpPreference -DisableRealtimeMonitoring $true
Set-MpPreference -DisableBehaviorMonitoring $true
Set-MpPreference -DisableIOAVProtection $true

# Install Chocolatey for package management
Set-ExecutionPolicy Bypass -Scope Process -Force
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install analysis tools
choco install procexp procmon autoruns tcpview wireshark
\`\`\`

◆ Registry Modifications for Analysis

\`\`\`batch
REM Disable Windows Error Reporting
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f

REM Enable hidden files and extensions
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v Hidden /t REG_DWORD /d 1 /f
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideFileExt /t REG_DWORD /d 0 /f
\`\`\`

▸ Linux Analysis VM Setup

◆ Base Configuration
1. Install Ubuntu 20.04+ or Kali Linux
2. Update system and install essential packages
3. Configure analysis tools

◆ Tool Installation Script

\`\`\`bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install basic analysis tools
sudo apt install -y \\
    binwalk \\
    hexedit \\
    strings \\
    file \\
    yara \\
    clamav \\
    wireshark \\
    tcpdump \\
    python3-pip \\
    git \\
    volatility \\
    radare2

# Install Python analysis libraries
pip3 install \\
    pefile \\
    yara-python \\
    oletools \\
    pycryptodome \\
    requests \\
    beautifulsoup4

# Install additional security tools
git clone https://github.com/volatilityfoundation/volatility3.git
git clone https://github.com/fireeye/flare-vm.git
\`\`\`

▸ Analysis Workflow Setup

◆ Sample Collection and Storage

\`\`\`bash
# Create organized directory structure
mkdir -p ~/malware-lab/{samples,reports,tools,iocs}
mkdir -p ~/malware-lab/samples/{exe,pdf,doc,scripts,mobile}

# Set up sample password protection
echo "Creating encrypted storage for samples..."
gpg --symmetric --cipher-algo AES256 sample.zip
\`\`\`

◆ Automated Analysis Script

\`\`\`python
#!/usr/bin/env python3
import os
import hashlib
import subprocess
import json
from datetime import datetime

class MalwareAnalyzer:
    def __init__(self, sample_path):
        self.sample_path = sample_path
        self.report = {
            'timestamp': datetime.now().isoformat(),
            'sample': os.path.basename(sample_path),
            'hashes': {},
            'static_analysis': {},
            'dynamic_analysis': {}
        }
    
    def calculate_hashes(self):
        """Calculate file hashes"""
        with open(self.sample_path, 'rb') as f:
            content = f.read()
            
        self.report['hashes'] = {
            'md5': hashlib.md5(content).hexdigest(),
            'sha1': hashlib.sha1(content).hexdigest(),
            'sha256': hashlib.sha256(content).hexdigest()
        }
    
    def static_analysis(self):
        """Perform static analysis"""
        # File type detection
        file_cmd = subprocess.run(['file', self.sample_path], 
                                capture_output=True, text=True)
        self.report['static_analysis']['file_type'] = file_cmd.stdout.strip()
        
        # Strings extraction
        strings_cmd = subprocess.run(['strings', self.sample_path], 
                                   capture_output=True, text=True)
        strings_output = strings_cmd.stdout.split('\\n')
        
        # Filter interesting strings
        interesting_strings = []
        patterns = ['http', 'ftp', 'smtp', '.exe', '.dll', 'cmd', 'powershell']
        
        for string in strings_output:
            for pattern in patterns:
                if pattern.lower() in string.lower() and len(string) > 4:
                    interesting_strings.append(string.strip())
                    break
        
        self.report['static_analysis']['interesting_strings'] = interesting_strings[:50]
    
    def generate_report(self):
        """Generate analysis report"""
        report_filename = f"analysis_{self.report['hashes']['sha256'][:8]}.json"
        report_path = os.path.join('~/malware-lab/reports', report_filename)
        
        with open(report_path, 'w') as f:
            json.dump(self.report, f, indent=2)
        
        print(f"Report saved to: {report_path}")
        return report_path

# Usage
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python3 analyzer.py <sample_path>")
        sys.exit(1)
    
    analyzer = MalwareAnalyzer(sys.argv[1])
    analyzer.calculate_hashes()
    analyzer.static_analysis()
    analyzer.generate_report()
\`\`\`

▸ Dynamic Analysis Environment

◆ Process Monitoring Setup

\`\`\`bash
# Monitor process creation
sudo sysdig -p "%evt.time %proc.name %proc.cmdline" proc.name contains malware

# Network monitoring
sudo tcpdump -i any -w capture.pcap &

# File system monitoring
sudo inotifywait -m -r /home/analyst/samples --format '%w%f %e' &
\`\`\`

◆ Behavioral Analysis Script

\`\`\`python
import psutil
import time
import json

class BehaviorMonitor:
    def __init__(self, duration=300):  # 5 minutes
        self.duration = duration
        self.baseline = self.get_system_baseline()
        
    def get_system_baseline(self):
        return {
            'processes': [p.info for p in psutil.process_iter(['pid', 'name', 'cmdline'])],
            'network_connections': psutil.net_connections(),
            'open_files': []
        }
    
    def monitor_execution(self, executable_path):
        # Execute sample in controlled environment
        # Monitor changes during execution
        changes = {
            'new_processes': [],
            'network_activity': [],
            'file_modifications': []
        }
        
        start_time = time.time()
        
        # Start monitoring
        while time.time() - start_time < self.duration:
            current_processes = [p.info for p in psutil.process_iter(['pid', 'name', 'cmdline'])]
            # Compare with baseline and log differences
            
            time.sleep(1)
        
        return changes
\`\`\`

▸ Safety Considerations

1. **Network Isolation**: Always ensure complete network isolation
2. **Snapshots**: Take VM snapshots before and after analysis
3. **Host Protection**: Never run samples on host system
4. **Legal Compliance**: Ensure proper authorization for sample analysis
5. **Data Sanitization**: Properly clean up after analysis

▸ Advanced Techniques

◆ Memory Analysis with Volatility

\`\`\`bash
# Create memory dump
sudo dd if=/dev/mem of=memory_dump.raw

# Analyze with Volatility
volatility -f memory_dump.raw --profile=Win10x64_19041 pslist
volatility -f memory_dump.raw --profile=Win10x64_19041 netscan
volatility -f memory_dump.raw --profile=Win10x64_19041 malfind
\`\`\`

◆ YARA Rules for Detection

\`\`\`yara
rule Suspicious_Executable {
    meta:
        description = "Detects suspicious executable patterns"
        author = "Malware Analyst"
        
    strings:
        $s1 = "cmd.exe /c" nocase
        $s2 = "powershell.exe" nocase
        $s3 = "CreateRemoteThread" nocase
        $s4 = { 4D 5A 90 00 }  // PE header
        
    condition:
        $s4 at 0 and any of ($s1, $s2, $s3)
}
\`\`\`

▸ Conclusion

A well-configured malware analysis lab is essential for understanding threats and developing effective defenses. Remember to always follow ethical guidelines and legal requirements when analyzing samples.

This setup provides a solid foundation for malware analysis that can be expanded with additional tools and techniques as your skills develop.
      `,
    }
  }

  return posts[slug] || null
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const slug = params?.slug as string
    if (slug) {
      const blogPost = getBlogPost(slug)
      if (blogPost) {
        setPost(blogPost)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
  }, [params])

  // Render content with proper formatting
  const renderContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("▸ ") && line.length > 2) {
        return (
          <h2
            key={index}
            className="text-xl font-bold text-white mt-8 mb-4 border-l-2 border-purple-600 pl-4"
          >
            {line.substring(2)}
          </h2>
        )
      } else if (line.startsWith("◆ ")) {
        return (
          <h3 key={index} className="text-lg font-semibold text-purple-300 mt-6 mb-3">
            {line.substring(2)}
          </h3>
        )
      } else if (line.startsWith("```")) {
        const language = line.replace(/```/, "").trim()
        return (
          <div key={index} className="bg-gray-900 border border-purple-500/30 p-4 rounded font-mono text-sm mt-4 mb-4 overflow-x-auto">
            {language && (
              <div className="text-purple-400 text-xs mb-2 border-b border-purple-500/20 pb-1">
                {language}
              </div>
            )}
          </div>
        )
      } else if (line.trim().match(/^\d+\./)) {
        return (
          <li key={index} className="ml-4 text-gray-300 my-2">
            {line.trim().substring(line.indexOf(".") + 1).trim()}
          </li>
        )
      } else if (line.trim() && !line.startsWith("`") && !line.startsWith("```") && line.trim() !== "EOF") {
        // Handle code blocks differently
        if (line.includes("```")) {
          const parts = line.split("```")
          return (
            <div key={index} className="my-4">
              {parts.map((part, partIndex) => {
                if (partIndex % 2 === 1) {
                  return (
                    <code key={partIndex} className="bg-gray-900 border border-purple-500/30 px-2 py-1 rounded text-purple-300 font-mono text-sm">
                      {part}
                    </code>
                  )
                } else {
                  return <span key={partIndex}>{part}</span>
                }
              })}
            </div>
          )
        }
        
        return (
          <p key={index} className="leading-relaxed my-4 text-gray-300">
            {line.trim()}
          </p>
        )
      }
      return null
    }).filter(Boolean)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">
            <DecodingText>Loading...</DecodingText>
          </h1>
          <p className="text-gray-300">
            ▸ <DecodingText>Fetching blog post data...</DecodingText>
          </p>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">
            <DecodingText>404 - Post Not Found</DecodingText>
          </h1>
          <p className="text-gray-300">
            ▸ <DecodingText>The requested blog post could not be found.</DecodingText>
          </p>
          <Link href="/blog" className="text-purple-300 hover:text-white transition-colors">
            ▸ <DecodingText>back to blog</DecodingText>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-purple-500/30 p-4 backdrop-blur-sm bg-black/80">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">
              <DecodingText>{`rikjimue@sec:~/blog/${post.slug}$`}</DecodingText>
            </span>
          </div>
          <Link href="/blog" className="flex items-center gap-2 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <DecodingText>back to blog</DecodingText>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Article Header */}
        <article className="py-8">
          <header className="space-y-4 mb-8">
            <div className="flex items-center gap-4 text-sm text-purple-300">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white leading-tight">{post.title}</h1>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2 py-1 border border-purple-600/50 text-purple-300"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300">
              {renderContent(post.content)}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-purple-500/30">
            <div className="flex justify-between items-center">
              <div className="text-purple-300">
                <p>▸ Found this helpful? Share it with others.</p>
              </div>
              <div className="flex gap-4">
                <button className="text-gray-300 hover:text-white transition-colors">▸ previous post</button>
                <button className="text-gray-300 hover:text-white transition-colors">next post ▸</button>
              </div>
            </div>
          </footer>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 p-4 mt-12 backdrop-blur-sm bg-black/80">
        <div className="max-w-4xl mx-auto text-center text-purple-300">
          <p>◈ © 2025 Luke Johnson. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}