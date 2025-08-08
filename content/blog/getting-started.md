---

title: "Getting Started"

date: "2025-07-28"

readTime: "5 min read"

excerpt: "I’ve been building a homelab for the past few months, and I figured it was time to document what I’m working on. This site is just a place to share the cool stuff I’m building, the problems I’m solving, and maybe help anyone trying to do similar things."

tags: ["Blog"]

published: true

author: "Luke Johnson"

---

# Welcome to my blog!
I’ve been building a homelab for the past few months, and I figured it was time to document what I’m working on. This site is just a place to share the cool stuff I’m building, the problems I’m solving, and maybe help anyone trying to do similar things.

## What This Is About
I built a server at home and I’m running all sorts of interesting projects on it. Right now I’ve got Proxmox handling virtualization, a WireGuard VPN for remote access, a Sons of the Forest game server for friends, and I’m hosting this website on it too. There’s more planned: a media server, some cybersecurity lab environments, projects in development, and whatever else seems interesting to build (and break).

The projects range from practical infrastructure stuff to security research. I’m particularly interested in malware analysis and setting up environments where I can safely poke at suspicious files and learn how they work. Having everything running on my own hardware gives me the freedom to experiment without worrying about cloud costs or platform restrictions, the ability to customize it however I want, and the freedom to govern my data.

## Why I’m Sharing This
When I was getting started, I found that the best resources were from people actually building things and sharing their authentic experiences, both the successes and the failures. So that’s what I’m doing here.

I don’t expect this to be a very polished blog, but mainly a workspace to document my projects as I work on them and share difficulties so others can learn with me and I can learn from my what I’ve done in the past if I have to revisit previous projects. If it helps someone else with their own build or gives them ideas for new projects, that’s awesome.

## What You’ll Find Here
Most posts will fall into a few categories. There will be build logs as I set up new services or expand the infrastructure. I’ll share configurations that work well, problems I’ve run into, and how I’ve solved them. When I’m working on cybersecurity projects or malware analysis, I’ll document the interesting findings and techniques and the occasional write-ups for CTF challenges.

I’m also planning to showcase some things I’ve built. As I get more development environments set up, I’ll host demos and examples of projects I’m working on. Having your own server makes it easy to spin up whatever you want to experiment with.

The technical stuff will be detailed enough to be useful if you want to replicate something, but I’m not going to assume you want to read a novel about every configuration decision. Just the important parts and the things that took me a while to figure out.

## The Setup
This website is running on the same homelab server I’ll be writing about. It’s a pretty straightforward setup - static site generation for speed, pm2 and CloudFlare tunnel that is connected to my domain for web hosting, and automatic SSL certificates. The whole thing is self-hosted from my home connection.

I like that everything is under my control. No platform changes, no arbitrary restrictions, and no wondering if my content will still be accessible years from now. Plus, it’s fun to build the entire stack yourself. Just don’t be surprised if something breaks and the website is down for a bit, haha.

## What’s Coming
I’ve got several posts already planned out. First up is the story of building the server hardware and getting Proxmox installed and configured. After that, I’ll cover the WireGuard VPN setup, then move into some of the more interesting services.

The cybersecurity content will ramp up as I get deeper into malware analysis, CTF challenges, and start building out proper lab environments. I’m particularly excited about setting up a SOC-style monitoring environment and sharing what I learn from that process.

There’s also a media server project in the works with Jellyfin and the full automation stack. And I want to experiment with hosting development project demos and maybe some security tools I’m building.

## A Few Notes
Everything I write about here is stuff I’m actually running and using. The configurations I share are the real files from my setup, and the problems I describe are ones I’ve actually encountered and solved. I think that makes the content more useful than theoretical discussions.

I’ll be putting configuration files and scripts in a public repository as things develop, so you can see exactly how everything is set up. The goal is to make it easy for anyone to replicate or build on what I’m doing.

If you’re working on similar projects or have ideas for interesting things to try, feel free to reach out. I’m always curious to hear what other people are building in their labs.

## Getting Started
If you want to follow along with what I’m building, the best approach is probably to check back occasionally or subscribe to the RSS/JSON feed. I’ll be posting regularly as projects reach interesting milestones or when I solve problems that might be useful to share.

The next post will be about building the server hardware and the initial Proxmox setup. It’s been a fun project, and there are definitely some lessons learned worth sharing.

Thanks for checking out the site. Let’s see what we can build.

---
&#x200B;
*This site is hosted on my homelab server. All the configuration files and setup details will be shared as I write about each project. If you’re curious about anything specific, just ask.*
