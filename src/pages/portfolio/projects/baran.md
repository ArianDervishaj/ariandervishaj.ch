---
layout: /src/layouts/ProjectLayout.astro
title: 'Paul Baran Network Resilience Reproduction'
description: "An academic laboratory project reproducing Paul Baran's foundational research on distributed network robustness using Monte Carlo simulations."
languages: ["python","networkx"]
category: "lab"
--- 

**Paul Baran Network Resilience Reproduction** is an academic laboratory project completed as part of my Network Architecture course at HEPIA. It aims to reproduce the foundational results of Paul Baran on distributed network robustness presented in his paper "On Distributed Communication Networks."

Paul Baran demonstrated in the 1960s that networks built with fragile components could nevertheless be extremely robust through link redundancy. The goal of this project is to experimentally reproduce part of his results using Monte Carlo simulations, studying different network topologies and their resistance to node and link failures.

## Project Structure

```
baran-lab/
├── main.py              # Main simulation launcher
├── simulation.py        # Failure management and survival metrics
├── topologies.py        # Network topology generation
├── visualisation.py     # Results visualization and plotting
├── requirements.txt     # Python dependencies
└── Rapport_Baran.pdf    # Complete analysis report
```

## Prerequisites

- Python 3.8+

### Python dependencies:

```bash
pip install -r requirements.txt
```

## Running a Simulation

To execute the simulation with default parameters:
```bash
python3 main.py
```

You can also customize execution by adding arguments:
```bash
python3 main.py -s 18 -p 25 -n 15 -v 6
```
**Command-Line Parameters:**
- `-s`: grid size (default: 18, i.e., an 18×18 node network as in Baran's paper)
- `-p`: number of failure probability points to test (default: 25)
- `-n`: number of Monte Carlo trials per probability (default: 15)
- `-v`: reduced size used for topology visualization (default: 6)

### Example Output

The program generates:

Topology visualizations with node importance (degree centrality + betweenness centrality)

![Topology visualizations](/images/projects/baran/image.png)

Curves comparing network survival level as a function of failure probability for each topology

![Curves comparaisons](/images/projects/baran/image1.png)

## Results

Complete results, analyses, and comparisons with Paul Baran's findings are available in the [GitHub repository](https://github.com/ArianDervishaj/Baran-Lab/tree/main) or directly in [my report](https://github.com/ArianDervishaj/Baran-Lab/blob/main/Rapport_Baran.pdf).

