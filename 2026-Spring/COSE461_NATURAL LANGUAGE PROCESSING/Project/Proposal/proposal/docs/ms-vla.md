# MS-VLA: Ambiguity-Aware Multimodal Instruction Following

This document provides a slide layout and speaking script for a short proposal presentation on **MS-VLA (Manifold-Steered Vision-Language-Action)**.  
To match short pitch constraints, the deck is structured so the **3 core claims** are repeated and visually reinforced.

> [!IMPORTANT]
> **3 Core Presentation Points (to reinforce in all slides)**
> 1. Language ambiguity is the main source of unsafe or unstable robotic execution.
> 2. Existing VLA approaches do not provide reliable **inference-time language steering**.
> 3. MS-VLA addresses this with **manifold-coordinate steering + entropy-gated clarification**.

---

## Slide 1. Title / Problem Setting

**[ Visual & Layout Guide ]**
* **Layout**: Keep the title large and centered. Place a red-highlighted "Core Question" callout on the right or bottom-right.
* **Design Point**: Use keyword cards to show concrete ambiguous commands and a short causal arrow (ambiguity increase -> execution stability decrease).

**[ Slide Content ]**
### Can ambiguous language be converted into safe execution?

**Research Objectives**
* Diagnose why ambiguity causes failure and latency in VLA execution
* Learn a runtime mapping from semantic uncertainty to manifold uncertainty
* Design a clarification-aware control loop without full replanning

> 💡 **Core Question**
> "If instruction semantics are under-specified, can we still execute safely without expensive replanning?"

**[ Presentation Script ]**
The key issue is not that current VLAs are weak in absolute accuracy, but that they lack a control structure for uncertainty.  
Ambiguous commands such as "pick the cup," "prepare the table," or "place it somewhere safe" trigger mis-execution, unnecessary stopping, or high latency.  
Our proposal asks whether ambiguity can be transformed into a controllable execution signal rather than treated as noise.

---

## Slide 2. Core Thesis: Semantic Uncertainty -> Geometric Uncertainty

**[ Visual & Layout Guide ]**
* **Layout**: Two-column composition. Left shows language ambiguity distribution (single vs multi-interpretation), right shows manifold coordinate spread (narrow vs wide).
* **Design Point**: Use two mapping arrows to emphasize correspondence from semantic uncertainty to geometric uncertainty.

**[ Slide Content ]**
### Core Thesis: Semantic Uncertainty to Geometric Uncertainty

**Key Idea**
* Higher semantic ambiguity leads to higher entropy over manifold coordinate deltas
* This entropy can directly drive steering and clarification gating decisions

$$
u_s(x)\uparrow \Rightarrow H\big(p(\Delta c \mid x)\big)\uparrow
$$
$$
\mathrm{Gate}(x)=\mathbf{1}\!\left[H\big(p(\Delta c \mid x)\big)>\tau\right]
$$

**[ Presentation Script ]**
Our central claim is measurable: when language is ambiguous, the action manifold coordinate distribution becomes diffuse.  
By modeling this distribution explicitly, we can compute entropy and decide whether to execute immediately or request clarification.  
This turns linguistic ambiguity into a quantitative control signal.

---

## Slide 3. Limitations of Existing Methods

**[ Visual & Layout Guide ]**
* **Layout**: Three parallel cards for direct comparison.
* **Design Point**: Mark each card's critical weakness with warning/cross indicators to make failure modes explicit.

**[ Slide Content ]**
### Why existing approaches are insufficient

1. **Text-only or LLM-only execution**
   * Hallucination and weak grounding
   * No stable physical action linkage
2. **Standard VLA without runtime steering**
   * Learned manifold is fixed at inference
   * Limited control over language-conditioned trajectory shift
3. **Simulation-heavy steering/verification**
   * Better alignment but high runtime overhead
   * Not suitable for low-latency deployment

**[ Presentation Script ]**
Existing methods fail for different reasons.  
LLM-only systems are linguistically fluent but physically unreliable.  
Many VLA policies learn powerful priors, yet cannot be steered by language at runtime.  
Verification-heavy methods improve safety but pay substantial latency costs.

---

## Slide 4. Proposed Idea: MS-VLA Pipeline

**[ Visual & Layout Guide ]**
* **Layout**: Place the full pipeline figure in the center-left and a checklist of module functions on the right.
* **Design Point**: Highlight the classifier/gating and manifold-steering blocks with pastel accents.

**[ Slide Content ]**
### Proposed Idea: MS-VLA

```mermaid
flowchart TD
    I([Instruction + Observation]) --> B[Base VLA Policy]
    B --> A[Manifold Coordinate Adapter (Delta c)]
    A --> R[Residual Correction Head (Delta a)]
    R --> G{Entropy / AMBG Gate}
    G -->|Low entropy| E([Execute Action])
    G -->|High entropy| C[Clarification Dialogue]
    C --> U([Updated Instruction])
    U --> A
```

**Core Modules**
* **Manifold Coordinate Adapter**: language-conditioned inference-time steering
* **Residual Correction Head**: online local correction during execution
* **Entropy-Gated Clarification**: pause/ask/resume loop for ambiguous instructions

**[ Presentation Script ]**
MS-VLA combines three components into one control framework.  
The adapter moves execution coordinates on the manifold from language cues.  
The residual head handles local online perturbations.  
The gate couples entropy with dialogue, so clarification is triggered exactly when uncertainty is too high.

---

## Slide 5. Experiment Plan

**[ Visual & Layout Guide ]**
* **Layout**: Three equal cards (Dataset, Query Types, Baselines).
* **Design Point**: Use a neutral palette for baselines and accent-highlight the proposed model.

**[ Slide Content ]**
### Experiment Plan

**1️⃣ Dataset**
* Ambiguity-injected manipulation instructions
* Scene-grounded object/action prompts
* Multi-turn clarification episodes

**2️⃣ Query / Instruction Types**
* Referential ambiguity
* Procedural ambiguity
* Semantic ambiguity
* Mixed ambiguity

**3️⃣ Baselines**
* Base VLA without adapter
* Base + residual correction only
* Clarification-only controller
* Simulation-verified steering baseline
* 🌟 **Ours: MS-VLA (Adapter + Residual + Entropy Gate)**

**[ Presentation Script ]**
We evaluate under controlled ambiguity injection across three ambiguity families.  
Baselines are designed to isolate each contribution: steering, correction, and gating.  
This setup lets us verify not only whether MS-VLA works, but why it works.

---

## Slide 6. Evaluation / Expected Contribution

**[ Visual & Layout Guide ]**
* **Layout**: Top row split into metrics and research questions; bottom row for expected contributions and references.
* **Design Point**: Keep references visually light but always visible for credibility.

**[ Slide Content ]**
### Evaluation and Expected Contribution

**📊 Evaluation Metrics**
* Task Success Rate (ambiguous vs clarified)
* Clarification Precision / Recall (AMBG gate quality)
* Latency breakdown (base, adapter+residual, clarification cost)
* Safety and intervention count

**❓ Research Questions**
* Does manifold-coordinate steering recover success under ambiguity?
* Does entropy-gated clarification reduce unsafe execution?
* Can we retain low-latency behavior without full replanning?

**✨ Expected Contribution**
1. A formal uncertainty bridge: semantic uncertainty -> manifold uncertainty
2. A practical runtime steering design for VLA inference
3. A safety-aware dialogue loop integrated into action control

---
<div style="font-size: 12px; color: gray; margin-top: 40px; border-top: 1px solid #ccc; padding-top: 10px;">
<b>References</b>
<br />- Point-VLA (arXiv:2512.18933)
<br />- ABot-M0 (arXiv:2602.11236)
<br />- A2C2 (arXiv:2509.23224)
<br />- Ask-to-Clarify (arXiv:2509.15061)
<br />- SEAL (arXiv:2510.16281)
</div>

**[ Presentation Script ]**
We evaluate not only final task success, but also uncertainty handling quality and runtime cost structure.  
The goal is to prove that ambiguity-aware control can improve both safety and practical deployability.  
The main value of MS-VLA is a controllable uncertainty-processing architecture, not just a single-point accuracy gain.

---

## Slide 7. Implementation Roadmap

**[ Visual & Layout Guide ]**
* **Layout**: Timeline format with three phases (left to right) and one deliverable block below.
* **Design Point**: Use consistent step markers and short milestone labels to keep scheduling clear.

**[ Slide Content ]**
### Implementation Roadmap

**Phase A — Adapter Pre-Alignment**
* Build synthetic steering pairs
* Train Delta c projection with bounded outputs

**Phase B — Joint Runtime Tuning**
* Attach residual correction head
* Stabilize adapter/correction interaction

**Phase C — Entropy-Gated Dialogue**
* Couple AMBG gate with coordinate entropy
* Validate pause-clarify-resume policy

**Deliverables**
* Public benchmark splits and ambiguity protocol
* Runtime latency decomposition report
* Ablation for adapter, correction, and gate modules

**[ Presentation Script ]**
The roadmap is staged to isolate risk.  
We first establish coordinate steering, then combine online correction, and finally integrate entropy-gated dialogue.  
Each phase produces measurable deliverables, so failure points are visible early.

---

## Slide 8. Risk and Mitigation

**[ Visual & Layout Guide ]**
* **Layout**: Two-column matrix (Risks vs Mitigations) with a final takeaway strip at the bottom.
* **Design Point**: Keep each risk-mitigation pair one line each for fast presentation pacing.

**[ Slide Content ]**
### Risk and Mitigation

**Risks**
* Base model checkpoint availability risk
* Adapter over-steering instability risk
* Clarification overhead risk in time-critical tasks

**Mitigations**
* Base-model-agnostic adapter interface with fallback backbones
* Bounded Delta c and staged training constraints
* Entropy threshold tuning with max-turn policy

**Final Takeaway**
Language is the decision interface, and manifold steering is the execution control surface.

**[ Presentation Script ]**
The proposal is designed with practical deployment constraints in mind.  
If checkpoints are delayed, fallback backbones are supported.  
If steering becomes unstable, bounded outputs and staged tuning limit drift.  
If dialogue overhead grows, entropy thresholds and turn caps maintain runtime feasibility.
