---

title: "Homelab Foundation"

date: "2025-08-04"

readTime: "10 min read"

excerpt: "Building my homelab started with the most crucial decision: choosing the right hardware. In this post, I'll walk through my initial planning process, my thought process in picking out components, and the troubles I faced getting everything set up."

tags: ["Blog", "Homelab", "Proxmox"]

published: true

author: "Luke Johnson"

---

# Homelab Foundation

Building my homelab started with the most crucial decision: choosing the right hardware. In this post, I'll walk through my initial planning process, my thought process in picking out components, and the troubles I faced getting everything set up.

## Goals and Use Cases

Throughout the planning process, three core requirements shaped every decision I made:

### Small Form Factor
The biggest requirement was that the server needed to be in a [Small Form Factor](https://en.wikipedia.org/wiki/Small_form_factor_PC). Because as a student moving in and out of dorms, I needed a computer that was easily portable so I could take it with me whenever I moved and fit wherever I needed to put it in my cramped dorm. This requirement added significant complexity to the planning since I was very limited in my choice of hardware. Additionally, since it would be running inside my dorm, managing noise became a huge hurdle.

### Powerful, Upgradable, and Expandable
My next requirement was that I wanted this server to be powerful. Services I planned on self-hosting like a Jellyfin media server, Wazuh and other security tooling, game servers, and processing large databases all required significant resources and performance. I refused to compromise on capability just because of the size constraint.

### Enterprise Features 
Lastly, I wanted to work with as many enterprise features as possible like IPMI for remote management, ECC to catch bit flips, and good Ethernet bandwidth. If I was investing time and money into this project, it needed to teach me skills I could use professionally.

## Building My Custom Server

**Important Note**: For a homelab, you do not by any means need to spend this much money for a good setup to learn and self-host. This server is very overkill for most use cases, and I would recommend starting with whatever you can get your hands on.

Here's the hardware I ended up going with:

- Case: [Ncase T1 v2.5](https://ncased.com/products/t1-sandwich-kit-black-color)
- Motherboard: [ASRock Rack W680D4ID-2T/G5/X550](https://www.asrockrack.com/general/productdetail.asp?Model=W680D4ID-2T/G5/X550#Specifications)
- CPU: [Intel i9 14900k](https://www.intel.com/content/www/us/en/products/sku/236773/intel-core-i9-processor-14900k-36m-cache-up-to-6-00-ghz/specifications.html)
- RAM: [Nemix 64 GB UDIMM ECC 4800mhz RAM](https://nemixram.com/products/ddr5-4800mhz-pc5-38400-ecc-288-pin-udimm?variant=47518240768312)
- PSU: [Corsair SF750](https://www.corsair.com/us/en/p/psu/cp-9020186-na/sf-series-sf750-750-watt-80-plus-platinum-certified-high-performance-sfx-psu-cp-9020186-na)
- Storage: [990 EVO Plus 4TB NVMe SSD](https://www.samsung.com/us/computing/memory-storage/solid-state-drives/990-evo-plus-gen5-pcie-nvmetm-ssd-4tb-mz-v9s4t0b-am/)
- AIO Cooler: [NZXT Kraken 240 Plus](https://nzxt.com/products/kraken-plus-240)
- Radiator Fans: [Noctua NF-A12x15 x2](https://noctua.at/en/products/fan/nf-a12x15-pwm-chromax-black-swap)
- Custom PSU Cables: [Cablester PSU Cables](https://www.etsy.com/shop/CablesterCustom)

Total final cost: $2000~

### Part Breakdown

#### Case
The first decision I needed to make was which case to pick. With my requirements, I needed a very small case that was easy to build in, allowed for expansion, and supported the widest variety of parts. The Ncase T1 Sandwich V2.5 was the clear winner.

This case, which is the same as the FormD T1 Sandwich V2.1 (just made by different people), is the gold standard when it comes to SFF builds since it's highly customizable, easy to build in, and incredibly small. It's so compact that it can fit most GPUs and an AIO inside just under 10 liters, which is smaller than an Xbox.

#### Motherboard 
With the case picked, I needed to find a server motherboard that would fit inside. The ASRock Rack W680D4ID-2T/G5/X550 was the clear winner out of all the motherboards I looked at. This board offers amazing features crammed into the Deep Mini-ITX form factor, which the T1 case conveniently supports, and allows for 4 slots of RAM instead of the traditional 2 on standard Mini-ITX motherboards.

The board has built-in IPMI for remote management, dual 10GbE ports for networking, support for ECC memory, vPro support, 2 M.2 slots, 6 SATA ports, and more. All of these features make this board more than capable for what I planned to do. While this motherboard wasn't cheap, the features crammed into this tiny board more than made up for the cost.

#### CPU 
For the CPU, this may be controversial, but I went with the Intel i9-14900K. Even though this isn't a server CPU and it faced significant challenges when it was released due to stability issues, I believed that for my requirements, the pros outweighed the cons, especially with recent firmware updates addressing the problems.

The main reason I went with Intel was for QuickSync, which allows for excellent hardware transcoding without needing a dedicated graphics card. This freed up space in my build for other components and made the overall build cheaper. The 14900K gives me 24 threads (8P + 16E cores), which is perfect for running multiple VMs simultaneously. More importantly, it supports all the enterprise features I wanted: ECC memory, vPro/IPMI integration, and excellent virtualization performance. The high single-thread performance also helps with game servers and applications that don't scale well across multiple cores.

#### RAM
The RAM was one of the easier choices since I could choose any UDIMM DDR5 RAM, but wanting ECC to help prevent data corruption made things more complex. I ended up going with 2x32GB Nemix RAM since it's a decent budget option for ECC RAM and comes with a lifetime warranty. If you want peace of mind, I would recommend sticking with what's on the Qualified Vendors List, but after running memtest, everything looked good.

#### PSU 
One of the most important components I needed to choose was my PSU. This single component powers everything else, so it was crucial that I didn't cheap out and went with something solid and reliable. I chose the SF750, which is the gold standard for most SFF builds since it's incredibly reliable, quiet, efficient, and most importantly, an SFX PSU that fits inside the case.

I calculated my power requirements by determining the average power draw of my components, which came to about 365W, then roughly doubling that for what I needed. This is because most PSUs have peak efficiency at around half load, meaning they waste less power and run quieter than at full load.

The cable management consideration I initially put off became critical later. Inside this small case, managing cables is very difficult, especially when they're long with nowhere to go. Originally I didn't plan on buying custom cables, but eventually decided it was necessary, as I'll discuss later.

#### Storage
Storage requirements really depend on your specific needs. For my homelab, I went with one 4TB NVMe SSD. This isn't a huge amount of storage, but my main goal was speed and upgradability. I chose this because I expected to do heavy reading and writing for databases, and NVMe drives make bulk operations much faster. My motherboard has 2 M.2 slots, so if I need more space, my next expansion would be another 4TB of NVMe storage. Any additional space after that would be high-capacity SATA SSDs or, if needed, a PCIe expansion M.2 card. Since I don't expect to have critical data initially and I'm fine with losing current data for learning purposes, I'm not concerned with redundant storage for now. As my homelab expands though, this will become a priority.

#### AIO Cooler + Fans
Since I went with a very power-hungry CPU, I needed liquid cooling, especially in such a cramped case. Initially, I chose the ARCTIC Liquid Freezer 3 Pro 240mm, but this was a mistake since I didn't do my due diligence regarding radiator clearance inside the case. After research, I found that the maximum thickness for radiator and fans was 46mm, and the Liquid Freezer has a radiator thickness of 38mm, which would mean 63mm total with standard fans and 53mm with slim fans. This was way too thick, so I had to choose a slimmer AIO, which led me to the NZXT Kraken Plus with a thickness of 27mm and just under the maximum at 42mm with slim fans.

Thickness matters significantly in this build since the radiator can't interfere with the motherboard, and there must be clearance for cables since the PSU cables face directly toward the radiator. If I was building this again, I would get a fan grill for the radiator fans to ensure no cables get caught in the fans.

#### Custom PSU Cables
Custom cables aren't necessary in this build but are heavily encouraged since the normal PSU cables are very thick, messy, and have unnecessary length. Getting custom-length cables ensures they aren't floating around inside the case waiting to get stuck in other parts, and also helps with airflow since the cables bunch up near the radiator fans. Getting these cables from Cablester transformed the inside of my case from looking like a rat's nest, and he does all the measurements and cabling himself, ensuring they're perfect.

## Proxmox Setup

With the hardware sorted, I needed to choose my bare metal hypervisor platform. After evaluating several options, I decided on Proxmox for several key reasons.

### Why Proxmox
I considered a couple different options like VMWare ESXi, Hyper-V, and KVM, but I did not want to deal with licensing requirements and the complexity of KVM was too much for right now. Proxmox offed an all-in-one platform that was free, open source, very easy to setup, extensive features, and had a lot of community support. 

### Installation Process
After turning on the server, making sure that it was working and bios was updated, I installed Proxmox through IPMI web interface using ZFS for the root filesystem. ZFS provides snapshot capabilities, compression, and checksumming - features that proved invaluable during constant experimentation in addition to easy scalability and adding redundancy.

## Lessons Learned

### Understand Component Compatibility Beyond Specifications 
Using a Deep Mini-ITX motherboard taught me that "compatible" doesn't always mean "fits."
Even though the T1 case says that it is compatible with that form factor, what I didn't know was that I needed to do some improvising to make it work and use 20mm standoffs to make the PSU seat on top of the extended region of the motherboard. I now double check whenever I am doing something non-standard if there is anything that may cause issues. Component compatibility extends beyond basic specs, understanding how parts interact is crucial.

### Read the Motherboard Manual Thoroughly 
The ASRock Rack motherboard manual became essential during setup. Server-grade hardware often includes features and configuration options not found in consumer components. Reading the manual revealed optimization opportunities I would have missed otherwise, from memory channel configuration to IPMI setup procedures. The manual also explained which ports were available and their specific limitations.

### Cable Management Directly Impacts Functionality
Custom cables were were essential for maintenance access and thermal performance. Standard cables designed for spacious tower cases become major obstacles in small form factor builds. Planning cable routes during the design phase, not after assembly, makes the difference between a clean build and a rats nest.

### Start Simple, Scale Complexity Gradually
My initial networking plans involved VLANs, pfSense, and complex segmentation from day one. Starting with basic connectivity and adding complexity gradually proved much more educational. Each layer of complexity should solve a specific problem, not just demonstrate capability.

### Power Efficiency Matters for 24/7 Operation
Running a high-performance system continuously adds up quickly on electricity bills. Understanding idle power consumption and implementing proper power management strategies becomes important for both cost and noise management, especially in shared living spaces like dorms.

This foundation provides a robust platform for the experiments and learning ahead. The real adventure begins now - turning this expensive hardware into valuable skills and useful services.

---
&#x200B;
**Current Homelab Status**: View my latest setup →  [GitHub Repository](https://github.com/yourusername/homelab)

_Last updated: August 6, 2025_