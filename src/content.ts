/* ============================================================================
   content.ts: every word on the site lives here.
   Edit this file to change text, links, numbers, projects, and diagrams.
   You never need to touch the components to update content.

   Search for "PLACEHOLDER" to find everything that still needs your input.
   ========================================================================== */

// ---------------------------------------------------------------------------
// Profile and links
// ---------------------------------------------------------------------------
export const profile = {
  name: "Shambhavi Upadhyay",
  firstName: "Shambhavi",
  headline:
    "Forward Deployed Engineer — AI Agents, Enterprise Integration & Data Platforms",
  // Hero one-liner, condensed from your summary.
  valueStatement:
    "I ship production AI agents, and the integrations and pipelines behind them, for teams that need AI to be measurable, safe, and efficient.",
  roles: ["Forward Deployed Engineer", "AI Agent Builder", "Integration Architect"],
  location: "New Jersey, USA",
  email: "shambhavi5320@gmail.com",
  linkedin: "https://www.linkedin.com/in/shambhavi-upadhyay5320",
  github: "https://github.com/ushambhavi14-coder",
  // Generated from your uploaded resume with the phone number removed.
  // Replace public/resume.pdf any time you update your resume.
  resume: "resume.pdf",
  photo: {
    src: "images/shambhavi-960.webp",
    srcSmall: "images/shambhavi-560.webp",
    alt: "Shambhavi Upadhyay smiling in a striped sweater, with autumn trees and mountains behind her",
  },
  // Used for <title>, social previews, and search engines.
  siteUrl: "https://your-domain.com", // PLACEHOLDER: set after you deploy (e.g. https://shambhavi.vercel.app)
};

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
export const about = {
  title: "About",
  paragraphs: [
    "Senior software engineer with 5+ years building AI agents, enterprise integrations, ServiceNow solutions, and data platforms for consumer goods, retail, financial services, insurance, and healthcare clients.",
    "I ship production AI (multi-agent orchestration, RAG, MCP, evaluation, guardrails) and the integrations and pipelines behind it in Python, Java, and SQL on MuleSoft, Boomi, Azure, AWS, and Google Cloud.",
    "I work directly with clients from discovery to renewal, and I care about building AI that is measurable, safe, and efficient.",
  ],
};

// ---------------------------------------------------------------------------
// Impact numbers
// Each stat renders as: lead + prefix + value (counted up) + suffix.
// The text must match your numbers exactly, so check `display` after editing.
// ---------------------------------------------------------------------------
export type Stat = {
  id: string;
  lead?: string; // static text before the counting number
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
};

export const stats: Stat[] = [
  { id: "businesses", value: 16, suffix: "+", label: "businesses run on my AI agent platform" },
  { id: "handling", value: 40, suffix: "%", label: "lower handling time from AI agents" },
  { id: "intent", lead: "~85% → ", prefix: "~", value: 92, suffix: "%", label: "intent accuracy through evaluation" },
  { id: "savings", prefix: "$", value: 25000, suffix: "+", label: "saved a year from a zero-downtime migration" },
  { id: "integrity", value: 50, suffix: "%", label: "better data integrity from event-driven pipelines" },
  { id: "renewal", prefix: "~", value: 90, suffix: "%", label: "client renewal rate across 16+ accounts" },
  { id: "security", value: 100, suffix: "%", label: "of client security reviews cleared" },
  { id: "mentored", value: 7, suffix: "+", label: "engineers mentored; led a team of 6+" },
];

// The four counters shown in the About section (by id).
export const aboutStatIds = ["businesses", "handling", "savings", "renewal"];

export const impact = {
  title: "Impact in numbers",
};

// ---------------------------------------------------------------------------
// Experience (newest first)
// A role can list `highlights` directly, or split them into titled `groups`.
// ---------------------------------------------------------------------------
export type Role = {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights?: string[];
  groups?: { title: string; items: string[] }[];
};

export const experience: Role[] = [
  {
    role: "Software Engineer, Integration Tech Lead",
    company: "CyntraLabs",
    location: "New Jersey, USA",
    period: "Jul 2026 – Present",
    highlights: [
      "Ran discovery and demos that helped win 6 client engagements; cut time to first value from ~4 weeks to ~2.",
      "Built always-on agents with Claude, N8N, and webhooks across NetSuite and Salesforce, removing ~15 hours of manual work a week.",
      "Built MCP servers and tools so Claude agents can query NetSuite, Salesforce, and Snowflake with scoped permissions, cutting routine lookups ~40%.",
      "Designed an ERP procure-to-pay AI agent: invoice extraction, 3-way matching, exception handling, approval guardrails, audit logging, and fraud and prompt-injection safeguards.",
      "Built Copilot Studio agents and M365 Copilot extensions, and a chatbot over a Power BI dashboard.",
      "Led a zero-downtime migration from MuleSoft to Azure Logic Apps and API Management, saving $25,000+ a year.",
      "Built Python and TypeScript services on Docker and Kubernetes in Google Cloud and AWS with Terraform and ArgoCD, and shipped 25+ production releases through GitHub Actions and Azure DevOps CI/CD.",
      "Designed ~15 secure APIs in Azure API Management; led a team of 6+ engineers.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "CyntraLabs",
    location: "Noida, India",
    period: "Sep 2021 – Jun 2026",
    groups: [
      {
        title: "AI agents & platforms",
        items: [
          "Built a multi-agent voice AI platform (router agent + booking, menu, availability agents) on GPT-4, Claude, Retell, Vapi, and Twilio; 16+ clients, handling time down 40%, escalations under 10%.",
          "Built an evaluation harness (LLM-as-judge on ~300 benchmark conversations, A/B tests, red-teaming), lifting intent accuracy from ~85% to ~92%.",
          "Added RAG, semantic caching, and a fine-tuned smaller model, cutting per-call LLM cost ~20%.",
          "Built guardrails (PII redaction, prompt-injection and jailbreak defense, hallucination validation, human escalation) and tracing across 30+ agents that surfaced failures ~50% faster.",
        ],
      },
      {
        title: "Integration & data",
        items: [
          "Designed API-led integrations across SAP, Salesforce, and Snowflake (MuleSoft, Boomi), lifting connectivity 40%; EDI flows processing ~5,000 documents a month with ~30% fewer rejections.",
          "Rebuilt batch jobs as event-driven pipelines into Snowflake, lifting data integrity 50% and efficiency 35%.",
          "Built a deterministic Python rules engine instead of an LLM where exact results mattered, cutting rule rollout from ~2 weeks to ~3 days.",
        ],
      },
      {
        title: "ServiceNow",
        items: [
          "Built scoped applications and customized ITSM, SPM, and Test Management 2.0 (business rules, script includes, client scripts, UI policies, UI scripts, ACLs) to bring fragmented delivery and test tracking together, cutting manual ticket effort 30%.",
          "Automated Incident, Problem, Change, and Request with Flow Designer approvals and SLAs, and built Service Catalog items, Knowledge bases, and Workspace views, cutting request fulfillment time ~20%.",
          "Built an AI-powered business portal (Service Portal, UI Builder, Now Assist, Flow Designer, external LLM over REST) for 200+ users, cutting high-priority acknowledgment time ~25%.",
          "Led an ITOM implementation: Discovery through MID Servers and cloud-native Discovery across AWS, Azure, and GCP, Service Mapping, Event Management with AIOps alert correlation, a CSDM-aligned CMDB, and HAM and SAM.",
          "Implemented HR Service Delivery and SecOps (Security Incident Response, Vulnerability Response), and built Virtual Agent topics for routine IT and HR requests.",
          "Ran upgrades, patches, and clones with ATF regression tests, and integrated ServiceNow with Datadog, GitHub, Workday, and Okta through IntegrationHub, REST, SOAP, and MID Server.",
        ],
      },
      {
        title: "DevOps & operations",
        items: [
          "Owned 24/7 on-call and performance tuning for business-critical integrations with SLOs, alerting, and root-cause analysis in Datadog, Splunk, Dynatrace, Anypoint Monitoring, and Azure Monitor, cutting repeat incidents ~40%.",
        ],
      },
      {
        title: "Clients & team",
        items: [
          "Owned 16+ client accounts at a ~90% renewal rate, turned feedback into 10+ shipped features, and mentored 7+ engineers.",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Projects: each one opens as a "white paper" with an animated figure.
//
// status: "shipped" | "design" | "in-progress"
// diagram: nodes are cards placed on a 720 × 380 canvas (x, y = top-left;
//   each card is 76px tall). Nodes are listed in the order the case study
//   walks through them as the reader scrolls.
//   icon: one of the IconName values above (each has its own small animation)
//   kind: "agent" (teal), "system", "data" (dashed), "guard" (amber),
//         "threat" (red), "person", "legacy" (faded)
//   edges connect node ids; `dashed` draws a dotted line, `label` adds a caption,
//   `at` sets the step at which an edge appears (default: when both ends are shown).
// links: add demo / repo / video URLs; empty ones are hidden on the site.
//
// NOTE: The "problem" lines for projects 2–12 are my wording, drawn only
// from your descriptions. Please read them and adjust if needed.
// ---------------------------------------------------------------------------
export type NodeKind = "agent" | "system" | "data" | "guard" | "threat" | "person" | "legacy";
export type IconName =
  | "phone" | "wave" | "router" | "database" | "brain" | "calendar" | "menu" | "clock"
  | "user" | "users" | "bot" | "sync" | "chart" | "edit" | "layers" | "target" | "scale"
  | "gauge" | "plug" | "key" | "cloud" | "snow" | "file" | "scan" | "checks" | "stamp"
  | "shield" | "alert" | "list" | "window" | "workflow" | "sparkle" | "bolt" | "server"
  | "gateway" | "globe" | "wrench" | "book" | "box" | "tag" | "check" | "eye";
export type DiagramNode = {
  id: string;
  icon: IconName;
  x: number;
  y: number;
  w?: number;
  label: string;
  sub?: string;
  kind?: NodeKind;
};
export type DiagramEdge = { from: string; to: string; label?: string; dashed?: boolean; fading?: boolean; at?: number };
export type Diagram = {
  caption: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  frame?: string; // optional dashed frame around the whole figure, with this caption
};
export type ProjectLink = { label: string; href: string };
export type Project = {
  slug: string;
  title: string;
  status: "shipped" | "design" | "in-progress";
  summary: string; // one line on the card
  problem: string;
  built: string;
  stack: string[];
  results: string[];
  diagram: Diagram;
  links: ProjectLink[];
};

export const projectsIntro = {
  title: "Featured projects",
  lede: "Each one opens as a short white paper: the problem, what I built, the stack, and what changed. Client names are left out on purpose.",
  inProgressTitle: "Currently building",
};

export const projects: Project[] = [
  {
    slug: "voice-agent-platform",
    title: "Multi-Industry AI Voice Agent Platform",
    status: "shipped",
    summary: "A router agent that hands calls to booking, menu, and availability agents.",
    problem: "Salons, cafés, and clinics were missing calls.",
    built:
      "A multi-agent voice platform where a router agent delegates to booking, menu, and availability agents, with short- and long-term memory over live data.",
    stack: ["GPT-4", "Claude", "Retell", "Vapi", "Twilio", "Speech-to-text", "Kafka", "Docker", "Kubernetes", "Supabase", "MongoDB"],
    results: ["16+ businesses", "Handling time down 40%", "Escalations under 10% of calls"],
    diagram: {
      caption: "A caller reaches the router agent, which delegates to a specialist agent that reads live data and shared memory.",
      nodes: [
        { id: "caller", x: 20, y: 164, w: 130, icon: "phone", label: "Caller", sub: "Twilio", kind: "person" },
        { id: "stt", x: 190, y: 164, w: 140, icon: "wave", label: "Speech-to-text", sub: "Retell / Vapi" },
        { id: "router", x: 370, y: 164, w: 140, icon: "router", label: "Router agent", sub: "GPT-4 / Claude", kind: "agent" },
        { id: "live", x: 370, y: 30, w: 140, icon: "database", label: "Live data", sub: "Supabase / MongoDB", kind: "data" },
        { id: "memory", x: 370, y: 296, w: 140, icon: "brain", label: "Memory", sub: "short- and long-term", kind: "data" },
        { id: "booking", x: 560, y: 54, w: 140, icon: "calendar", label: "Booking agent", kind: "agent" },
        { id: "menu", x: 560, y: 164, w: 140, icon: "menu", label: "Menu agent", kind: "agent" },
        { id: "avail", x: 560, y: 274, w: 140, icon: "clock", label: "Availability agent", kind: "agent" },
      ],
      edges: [
        { from: "caller", to: "stt" },
        { from: "stt", to: "router" },
        { from: "router", to: "booking" },
        { from: "router", to: "menu" },
        { from: "router", to: "avail" },
        { from: "live", to: "router", dashed: true },
        { from: "memory", to: "router", dashed: true },
      ],
    },
    links: [], // PLACEHOLDER: demo video or recording, if you can share one
  },
  {
    slug: "salon-scheduling",
    title: "Salon Scheduling Platform & Agent Dashboard",
    status: "shipped",
    summary: "One live schedule for direct and voice bookings, plus a dashboard across 30+ agents.",
    problem: "Appointments came in two ways, booked directly or by the voice agent, and both had to land in one live schedule.",
    built:
      "A full-stack scheduling app where appointments booked directly or by the voice agent sync in real time, plus a live dashboard across 30+ agents.",
    stack: ["React", "TypeScript", "PostgreSQL", "Docker"],
    results: ["~1,500 appointments a month for 40+ staff", "~30% booked by voice", "Failures surfaced ~50% faster"],
    diagram: {
      caption: "Direct and voice bookings sync into one schedule in real time; the dashboard watches every agent.",
      nodes: [
        { id: "direct", x: 20, y: 60, w: 150, icon: "user", label: "Direct booking", sub: "React + TypeScript", kind: "person" },
        { id: "voice", x: 20, y: 270, w: 150, icon: "bot", label: "Voice agent", sub: "~30% of bookings", kind: "agent" },
        { id: "app", x: 260, y: 164, w: 160, icon: "sync", label: "Scheduling app", sub: "real-time sync" },
        { id: "db", x: 520, y: 60, w: 170, icon: "database", label: "PostgreSQL", sub: "~1,500 appts / month", kind: "data" },
        { id: "dash", x: 520, y: 270, w: 170, icon: "chart", label: "Live dashboard", sub: "30+ agents" },
      ],
      edges: [
        { from: "direct", to: "app" },
        { from: "voice", to: "app" },
        { from: "app", to: "db" },
        { from: "app", to: "dash" },
        { from: "voice", to: "dash", dashed: true, label: "status" },
      ],
    },
    links: [], // PLACEHOLDER: screenshot or demo link
  },
  {
    slug: "llm-eval-harness",
    title: "LLM Evaluation Harness",
    status: "shipped",
    summary: "LLM-as-judge on ~300 real caller conversations, run on every prompt change.",
    problem: "Every prompt change needed to be checked against real caller questions before it shipped.",
    built:
      "LLM-as-judge on ~300 benchmark conversations built from real caller questions, plus A/B tests and red-teaming, run on every prompt change.",
    stack: ["LLM-as-judge", "Benchmark conversations", "A/B testing", "Red-teaming"],
    results: ["Intent accuracy ~85% → ~92%"],
    diagram: {
      caption: "Each prompt change runs against the benchmark and attack sets, and a judge model scores the result.",
      nodes: [
        { id: "change", x: 20, y: 164, w: 140, icon: "edit", label: "Prompt change", sub: "triggers a run" },
        { id: "bench", x: 200, y: 36, w: 170, icon: "layers", label: "Benchmark set", sub: "~300 conversations", kind: "data" },
        { id: "red", x: 200, y: 292, w: 170, icon: "target", label: "A/B + red-teaming", kind: "threat" },
        { id: "agent", x: 200, y: 164, w: 170, icon: "bot", label: "Agent under test", kind: "agent" },
        { id: "judge", x: 410, y: 164, w: 130, icon: "scale", label: "LLM-as-judge", kind: "guard" },
        { id: "score", x: 580, y: 164, w: 120, icon: "gauge", label: "Intent accuracy", sub: "~85% → ~92%" },
      ],
      edges: [
        { from: "change", to: "agent" },
        { from: "bench", to: "agent", dashed: true },
        { from: "red", to: "agent", dashed: true },
        { from: "agent", to: "judge" },
        { from: "judge", to: "score" },
      ],
    },
    links: [],
  },
  {
    slug: "mcp-enterprise-data",
    title: "MCP Tools for Enterprise Data",
    status: "shipped",
    summary: "MCP servers that let Claude agents query NetSuite, Salesforce, and Snowflake safely.",
    problem: "Claude agents needed to look up NetSuite, Salesforce, and Snowflake data without broad access to any of them.",
    built:
      "MCP servers letting Claude agents query NetSuite, Salesforce, and Snowflake with permissions scoped per tool call. Includes open-source MCP contributions.",
    stack: ["Claude", "MCP", "NetSuite", "Salesforce", "Snowflake"],
    results: ["Routine lookups down ~40%"],
    diagram: {
      caption: "Every tool call passes a permission scope before it reaches a system of record.",
      nodes: [
        { id: "agent", x: 20, y: 164, w: 140, icon: "bot", label: "Claude agent", kind: "agent" },
        { id: "mcp", x: 200, y: 164, w: 140, icon: "plug", label: "MCP servers", sub: "custom tools" },
        { id: "scope", x: 380, y: 164, w: 150, icon: "key", label: "Scoped permissions", sub: "per tool call", kind: "guard" },
        { id: "ns", x: 580, y: 54, w: 120, icon: "database", label: "NetSuite", kind: "data" },
        { id: "sf", x: 580, y: 164, w: 120, icon: "cloud", label: "Salesforce", kind: "data" },
        { id: "snow", x: 580, y: 274, w: 120, icon: "snow", label: "Snowflake", kind: "data" },
      ],
      edges: [
        { from: "agent", to: "mcp" },
        { from: "mcp", to: "scope" },
        { from: "scope", to: "ns" },
        { from: "scope", to: "sf" },
        { from: "scope", to: "snow" },
      ],
    },
    links: [
      // PLACEHOLDER: add your open-source MCP contribution links, e.g.
      // { label: "MCP contribution", href: "https://github.com/..." },
    ],
  },
  {
    slug: "procure-to-pay-agent",
    title: "Procure-to-Pay AI Agent",
    status: "design",
    summary: "An invoice-to-approval agent designed with guardrails and audit logging built in from the start.",
    problem: "Procure-to-pay automation has to stay auditable and hold up against fraud and prompt injection.",
    built:
      "A design covering invoice extraction, 3-way matching, exception handling, approval guardrails, audit logging, KPIs, and fraud and prompt-injection safeguards, with a phased rollout plan.",
    stack: ["Invoice extraction", "3-way matching", "Exception handling", "Approval guardrails", "Audit logging", "KPIs"],
    results: ["Delivered as a design with KPIs and a phased rollout plan"],
    diagram: {
      caption: "Invoices are extracted and matched; mismatches go to exception handling, and every step writes to the audit log.",
      nodes: [
        { id: "inv", x: 20, y: 60, w: 120, icon: "file", label: "Invoice", kind: "person" },
        { id: "extract", x: 180, y: 60, w: 140, icon: "scan", label: "Extraction", kind: "agent" },
        { id: "safe", x: 150, y: 270, w: 200, icon: "shield", label: "Fraud + prompt-injection", sub: "safeguards", kind: "guard" },
        { id: "match", x: 360, y: 60, w: 150, icon: "checks", label: "3-way match", sub: "PO / receipt / invoice", kind: "agent" },
        { id: "exc", x: 380, y: 270, w: 150, icon: "alert", label: "Exception handling" },
        { id: "approve", x: 550, y: 60, w: 150, icon: "stamp", label: "Approval", sub: "guardrails", kind: "guard" },
        { id: "audit", x: 560, y: 270, w: 140, icon: "list", label: "Audit log", kind: "data" },
      ],
      edges: [
        { from: "inv", to: "extract" },
        { from: "extract", to: "match" },
        { from: "match", to: "approve" },
        { from: "match", to: "exc", dashed: true, label: "mismatch" },
        { from: "safe", to: "extract", dashed: true },
        { from: "exc", to: "audit" },
        { from: "approve", to: "audit" },
      ],
    },
    links: [],
  },
  {
    slug: "servicenow-portal",
    title: "AI-Powered ServiceNow Business Portal",
    status: "shipped",
    summary: "A ServiceNow portal with Now Assist and an external LLM, used by 200+ people.",
    problem: "High-priority requests from 200+ users needed to be acknowledged faster.",
    built:
      "An AI-powered business portal built with Service Portal, UI Builder, Now Assist, and Flow Designer, calling an external LLM over REST.",
    stack: ["Service Portal", "UI Builder", "Now Assist", "Flow Designer", "External LLM over REST"],
    results: ["200+ users", "High-priority acknowledgment time down ~25%"],
    diagram: {
      caption: "Requests enter through the portal; flows and Now Assist route them, with an external LLM called over REST.",
      nodes: [
        { id: "users", x: 20, y: 164, w: 130, icon: "users", label: "200+ users", kind: "person" },
        { id: "portal", x: 190, y: 164, w: 160, icon: "window", label: "Service Portal", sub: "UI Builder" },
        { id: "flow", x: 400, y: 60, w: 150, icon: "workflow", label: "Flow Designer" },
        { id: "assist", x: 400, y: 270, w: 150, icon: "sparkle", label: "Now Assist", kind: "agent" },
        { id: "llm", x: 590, y: 60, w: 110, icon: "cloud", label: "External LLM", kind: "agent" },
      ],
      edges: [
        { from: "users", to: "portal" },
        { from: "portal", to: "flow" },
        { from: "portal", to: "assist" },
        { from: "flow", to: "llm", label: "REST" },
      ],
    },
    links: [],
  },
  {
    slug: "servicenow-spm-test-management",
    title: "SPM & Test Management on ServiceNow",
    status: "shipped",
    summary: "Scoped apps that bring fragmented delivery and test tracking into one place.",
    problem: "Delivery and test tracking was fragmented.",
    built:
      "Scoped applications, plus ITSM, SPM, and Test Management 2.0 customized with business rules, script includes, client scripts, UI policies, UI scripts, and ACLs.",
    stack: ["Scoped apps", "SPM", "Test Management 2.0", "ITSM", "Business rules", "Script includes", "Client scripts", "UI policies", "ACLs"],
    results: ["Manual ticket effort down 30%"],
    diagram: {
      caption: "SPM, Test Management 2.0, and ITSM records meet in a scoped app, customized with scripts, UI policies, and ACLs.",
      nodes: [
        { id: "spm", x: 20, y: 40, w: 160, icon: "layers", label: "SPM", sub: "delivery tracking" },
        { id: "tm", x: 20, y: 164, w: 160, icon: "checks", label: "Test Management 2.0", sub: "test tracking" },
        { id: "itsm", x: 20, y: 288, w: 160, icon: "list", label: "ITSM", sub: "tickets" },
        { id: "app", x: 230, y: 164, w: 180, icon: "window", label: "Scoped application", sub: "business rules, scripts", kind: "agent" },
        { id: "ui", x: 450, y: 40, w: 150, icon: "edit", label: "Client scripts", sub: "UI policies" },
        { id: "acl", x: 450, y: 288, w: 150, icon: "key", label: "ACLs", sub: "access control", kind: "guard" },
        { id: "out", x: 590, y: 164, w: 120, icon: "gauge", label: "Ticket effort", sub: "down 30%", kind: "data" },
      ],
      edges: [
        { from: "spm", to: "app" },
        { from: "tm", to: "app" },
        { from: "itsm", to: "app" },
        { from: "app", to: "ui", dashed: true },
        { from: "app", to: "acl", dashed: true },
        { from: "app", to: "out" },
      ],
    },
    links: [],
  },
  {
    slug: "servicenow-itsm-automation",
    title: "ITSM Automation with Flow Designer",
    status: "shipped",
    summary: "Incident, Problem, Change, and Request automated with approvals and SLAs.",
    problem: "Service delivery across Incident, Problem, Change, and Request needed to move faster.",
    built:
      "Automated Incident, Problem, Change, and Request with Flow Designer approvals and SLAs, and built Service Catalog items, Knowledge bases, and Workspace views.",
    stack: ["ITSM", "Flow Designer", "SLAs", "Service Catalog", "Knowledge", "Workspace"],
    results: ["Request fulfillment time down ~20%"],
    diagram: {
      caption: "Requests enter through the catalog; Flow Designer runs approvals under SLAs across Incident, Problem, Change, and Request, surfaced in Workspace views.",
      nodes: [
        { id: "kb", x: 20, y: 36, w: 150, icon: "book", label: "Knowledge base", kind: "data" },
        { id: "cat", x: 20, y: 200, w: 150, icon: "list", label: "Service Catalog", sub: "requests", kind: "person" },
        { id: "flow", x: 220, y: 200, w: 150, icon: "workflow", label: "Flow Designer", sub: "approvals", kind: "agent" },
        { id: "sla", x: 220, y: 36, w: 150, icon: "clock", label: "SLAs", kind: "guard" },
        { id: "inc", x: 420, y: 60, w: 160, icon: "alert", label: "Incident & Problem" },
        { id: "chg", x: 420, y: 290, w: 160, icon: "sync", label: "Change & Request" },
        { id: "ws", x: 610, y: 176, w: 100, icon: "chart", label: "Workspace", sub: "views" },
      ],
      edges: [
        { from: "kb", to: "cat", dashed: true },
        { from: "cat", to: "flow" },
        { from: "sla", to: "flow", dashed: true },
        { from: "flow", to: "inc" },
        { from: "flow", to: "chg" },
        { from: "inc", to: "ws" },
        { from: "chg", to: "ws" },
      ],
    },
    links: [],
  },
  {
    slug: "servicenow-itom",
    title: "ITOM & AIOps Implementation",
    status: "shipped",
    summary: "Discovery, Service Mapping, and event correlation on a CSDM-aligned CMDB.",
    problem: "Infrastructure across AWS, Azure, and GCP needed to be discovered, mapped, and monitored in one place.",
    built:
      "Led an ITOM implementation: Discovery through MID Servers and cloud-native Discovery across AWS, Azure, and GCP; cloud and tag-based Service Mapping; Event Management with AIOps alert correlation; a CSDM-aligned CMDB; and HAM and SAM.",
    stack: ["Discovery", "MID Server", "Service Mapping", "Event Management", "AIOps", "CMDB", "CSDM", "HAM", "SAM"],
    results: [],
    diagram: {
      caption: "Discovery fills a CSDM-aligned CMDB, which feeds Service Mapping, event correlation, and asset management.",
      nodes: [
        { id: "cloud", x: 20, y: 40, w: 160, icon: "cloud", label: "AWS / Azure / GCP", sub: "cloud-native discovery" },
        { id: "mid", x: 20, y: 288, w: 160, icon: "server", label: "MID Servers", sub: "discovery" },
        { id: "disc", x: 225, y: 164, w: 150, icon: "scan", label: "Discovery", kind: "agent" },
        { id: "cmdb", x: 420, y: 164, w: 150, icon: "database", label: "CMDB", sub: "CSDM-aligned", kind: "data" },
        { id: "map", x: 420, y: 30, w: 150, icon: "router", label: "Service Mapping", sub: "cloud + tag-based" },
        { id: "event", x: 420, y: 298, w: 150, icon: "bolt", label: "Event Management", sub: "AIOps correlation", kind: "guard" },
        { id: "itam", x: 610, y: 164, w: 100, icon: "box", label: "HAM + SAM" },
      ],
      edges: [
        { from: "cloud", to: "disc" },
        { from: "mid", to: "disc" },
        { from: "disc", to: "cmdb" },
        { from: "cmdb", to: "map" },
        { from: "cmdb", to: "event" },
        { from: "cmdb", to: "itam" },
      ],
    },
    links: [],
  },
  {
    slug: "mulesoft-azure-migration",
    title: "MuleSoft → Azure Migration",
    status: "shipped",
    summary: "Legacy integrations moved to Azure with zero downtime.",
    problem: "Legacy MuleSoft integrations had to move to Azure without any downtime.",
    built: "A zero-downtime move of legacy integrations to Azure Logic Apps and API Management.",
    stack: ["MuleSoft", "Azure Logic Apps", "Azure API Management"],
    results: ["100% of milestones met", "$25,000+ saved a year"],
    diagram: {
      caption: "Traffic shifts from the legacy MuleSoft path to Azure API Management and Logic Apps with no downtime.",
      nodes: [
        { id: "traffic", x: 20, y: 164, w: 150, icon: "bolt", label: "Integration traffic", kind: "person" },
        { id: "mule", x: 250, y: 54, w: 160, icon: "server", label: "MuleSoft", sub: "legacy", kind: "legacy" },
        { id: "apim", x: 250, y: 274, w: 160, icon: "gateway", label: "API Management", sub: "Azure", kind: "guard" },
        { id: "logic", x: 450, y: 274, w: 140, icon: "workflow", label: "Logic Apps", sub: "Azure", kind: "agent" },
        { id: "down", x: 560, y: 54, w: 140, icon: "globe", label: "Connected systems", sub: "no downtime", kind: "data" },
      ],
      edges: [
        { from: "traffic", to: "mule", fading: true, at: 1 },
        { from: "mule", to: "down", fading: true, at: 1 },
        { from: "traffic", to: "apim" },
        { from: "apim", to: "logic" },
        { from: "logic", to: "down" },
      ],
    },
    links: [],
  },
  {
    slug: "hermes-assistant",
    title: "Autonomous Assistant on Hermes Agent",
    status: "shipped",
    summary: "An always-on agent with its own tools, memory, and schedule.",
    problem: "Routine business work needed an assistant that runs on a schedule, not only when someone prompts it.",
    built:
      "An always-on agent with custom tools, MCP servers, persistent memory, and scheduled runs that acts in business systems.",
    stack: ["Hermes Agent", "Custom tools", "MCP servers", "Persistent memory", "Scheduled runs"],
    results: [],
    diagram: {
      caption: "Scheduled runs wake the agent, which uses its memory and tools to act in business systems.",
      nodes: [
        { id: "sched", x: 20, y: 164, w: 140, icon: "clock", label: "Scheduled runs" },
        { id: "agent", x: 200, y: 164, w: 150, icon: "bot", label: "Hermes agent", sub: "always on", kind: "agent" },
        { id: "mem", x: 200, y: 296, w: 150, icon: "brain", label: "Persistent memory", kind: "data" },
        { id: "tools", x: 400, y: 70, w: 140, icon: "wrench", label: "Custom tools" },
        { id: "mcp", x: 400, y: 258, w: 140, icon: "plug", label: "MCP servers" },
        { id: "biz", x: 580, y: 164, w: 120, icon: "globe", label: "Business systems", kind: "data" },
      ],
      edges: [
        { from: "sched", to: "agent" },
        { from: "mem", to: "agent", dashed: true },
        { from: "agent", to: "tools" },
        { from: "agent", to: "mcp" },
        { from: "tools", to: "biz" },
        { from: "mcp", to: "biz" },
      ],
    },
    links: [],
  },
  {
    slug: "prompt-injection-robustness",
    title: "Prompt-Injection Robustness of Tool-Using Agents",
    status: "in-progress",
    summary: "Measuring how often hidden instructions in tool outputs hijack agents, and which defenses work.",
    problem: "Instructions hidden in tool outputs can hijack tool-using agents.",
    built:
      "A study that measures how often instructions hidden in tool outputs hijack agents across models, and which defenses cut attack success.",
    stack: ["Tool-using agents", "Multiple models", "Prompt-injection defenses"],
    results: ["In progress"],
    diagram: {
      caption: "A poisoned tool output tries to redirect the agent; each defense is scored by how much it cuts attack success.",
      nodes: [
        { id: "agent", x: 20, y: 120, w: 130, icon: "bot", label: "Agent", sub: "per model", kind: "agent" },
        { id: "tool", x: 190, y: 120, w: 130, icon: "wrench", label: "Tool call" },
        { id: "out", x: 360, y: 120, w: 160, icon: "alert", label: "Tool output", sub: "+ hidden instruction", kind: "threat" },
        { id: "def", x: 560, y: 120, w: 140, icon: "shield", label: "Defense", kind: "guard" },
        { id: "measure", x: 360, y: 290, w: 160, icon: "gauge", label: "Attack success", sub: "measured per model", kind: "data" },
      ],
      edges: [
        { from: "agent", to: "tool" },
        { from: "tool", to: "out" },
        { from: "out", to: "def" },
        { from: "out", to: "measure", dashed: true },
        { from: "def", to: "measure", dashed: true },
      ],
    },
    links: [],
  },
  {
    slug: "agentic-reference-architecture",
    title: "Agentic AI Reference Architecture",
    status: "in-progress",
    summary: "A multi-agent blueprint with guardrails for identity, audit, evaluation, and cost.",
    problem: "Teams adopting agents need one design that covers identity, audit, evaluation, and cost.",
    built:
      "A multi-agent design with MCP, RAG, human review, and guardrails for identity, audit, evaluation, and cost, mapped to NIST AI RMF.",
    stack: ["Multi-agent", "MCP", "RAG", "Human review", "NIST AI RMF"],
    results: ["In progress"],
    diagram: {
      caption: "Agents reach tools through MCP and knowledge through RAG, with human review and guardrails around every action.",
      frame: "Mapped to NIST AI RMF",
      nodes: [
        { id: "mcp", x: 40, y: 70, w: 140, icon: "plug", label: "MCP tools" },
        { id: "rag", x: 40, y: 250, w: 140, icon: "book", label: "RAG", kind: "data" },
        { id: "core", x: 280, y: 160, w: 160, icon: "router", label: "Multi-agent core", kind: "agent" },
        { id: "human", x: 540, y: 70, w: 140, icon: "user", label: "Human review", kind: "person" },
        { id: "guard", x: 520, y: 250, w: 180, icon: "shield", label: "Guardrails", sub: "identity / audit / eval / cost", kind: "guard" },
      ],
      edges: [
        { from: "mcp", to: "core" },
        { from: "rag", to: "core" },
        { from: "core", to: "human" },
        { from: "core", to: "guard" },
      ],
    },
    links: [],
  },
  {
    slug: "product-enrichment-agent",
    title: "Product Enrichment Agent",
    status: "in-progress",
    summary: "Maps raw product data to a taxonomy and scores every attribute.",
    problem: "Raw product data has to be mapped to a category taxonomy, and some mappings are uncertain.",
    built:
      "An agent that maps raw product data to a category taxonomy and scores each attribute by precision, recall, and F1, routing low-confidence items to review.",
    stack: ["Category taxonomy", "Precision / recall / F1", "Human review"],
    results: ["In progress"],
    diagram: {
      caption: "Each attribute is scored; confident matches pass and low-confidence items go to a person.",
      nodes: [
        { id: "raw", x: 20, y: 164, w: 140, icon: "box", label: "Raw product data", kind: "data" },
        { id: "tax", x: 200, y: 36, w: 150, icon: "tag", label: "Category taxonomy", kind: "data" },
        { id: "agent", x: 200, y: 164, w: 150, icon: "bot", label: "Mapping agent", kind: "agent" },
        { id: "score", x: 390, y: 164, w: 150, icon: "gauge", label: "Attribute scoring", sub: "precision / recall / F1", kind: "guard" },
        { id: "ok", x: 580, y: 60, w: 120, icon: "check", label: "Confident", sub: "passes" },
        { id: "review", x: 580, y: 270, w: 120, icon: "eye", label: "Review", sub: "low confidence", kind: "person" },
      ],
      edges: [
        { from: "raw", to: "agent" },
        { from: "tax", to: "agent", dashed: true },
        { from: "agent", to: "score" },
        { from: "score", to: "ok" },
        { from: "score", to: "review", dashed: true },
      ],
    },
    links: [],
  },
  {
    slug: "event-driven-agent-triggers",
    title: "Event-Driven Agent Triggers",
    status: "in-progress",
    summary: "Agents started by business events, with identity checked on every tool call.",
    problem: "Agents should start from business events, and every action they take must be checked and logged.",
    built:
      "Agents started by Service Bus or EventBridge events, with identity checked on every tool call and full audit logs.",
    stack: ["Service Bus", "EventBridge", "Identity checks", "Audit logs"],
    results: ["In progress"],
    diagram: {
      caption: "An event wakes the agent; each tool call is identity-checked and written to the audit log.",
      nodes: [
        { id: "sb", x: 20, y: 60, w: 140, icon: "bolt", label: "Service Bus", sub: "event" },
        { id: "eb", x: 20, y: 270, w: 140, icon: "bolt", label: "EventBridge", sub: "event" },
        { id: "agent", x: 210, y: 164, w: 130, icon: "bot", label: "Agent", kind: "agent" },
        { id: "id", x: 390, y: 164, w: 150, icon: "key", label: "Identity check", sub: "every tool call", kind: "guard" },
        { id: "tools", x: 590, y: 164, w: 110, icon: "wrench", label: "Tools" },
        { id: "audit", x: 390, y: 296, w: 150, icon: "list", label: "Audit log", kind: "data" },
      ],
      edges: [
        { from: "sb", to: "agent" },
        { from: "eb", to: "agent" },
        { from: "agent", to: "id" },
        { from: "id", to: "tools" },
        { from: "id", to: "audit", dashed: true },
      ],
    },
    links: [],
  },
];

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export const skills: { group: string; items: string[] }[] = [
  {
    group: "AI & Agents",
    items: ["Claude", "GPT-4", "Gemini", "Azure OpenAI", "Multi-agent orchestration", "Tool calling", "RAG", "MCP", "LangGraph", "LangChain", "Evaluation", "Guardrails", "Fine-tuning", "Claude Code", "Cursor"],
  },
  {
    group: "Integration",
    items: ["MuleSoft", "Boomi", "Workato", "Azure Logic Apps", "Azure API Management", "SAP BTP", "REST", "GraphQL", "Kafka", "EDI (X12, EDIFACT)"],
  },
  {
    group: "Data",
    items: ["Snowflake", "Databricks", "Azure Data Factory", "SQL", "PostgreSQL", "Power BI", "Microsoft Fabric"],
  },
  {
    group: "Languages",
    items: ["Python", "Java", "Spring Boot", "TypeScript", "JavaScript", "React", "SQL", "Apex"],
  },
  {
    group: "Cloud & DevOps",
    items: ["AWS", "Azure", "Google Cloud", "OpenShift", "Docker", "Kubernetes", "Terraform", "ArgoCD (GitOps)", "GitHub Actions", "Azure DevOps", "Jenkins", "CI/CD", "Datadog", "Splunk", "Dynatrace"],
  },
  {
    group: "ServiceNow",
    items: ["ITSM", "ITOM", "SPM / ITBM", "Test Management 2.0", "CMDB & CSDM", "Discovery", "Service Mapping", "Event Management & AIOps", "ITAM (HAM, SAM)", "HR Service Delivery", "CSM", "SecOps (SIR, VR)", "Virtual Agent", "Now Assist", "Service Portal", "UI Builder", "Workspace", "Flow Designer", "IntegrationHub", "ATF", "Scoped apps", "Performance Analytics"],
  },
  {
    group: "Platforms",
    items: ["Salesforce", "SAP", "NetSuite", "Workday", "Jira"],
  },
];

// ---------------------------------------------------------------------------
// Certifications & education
// ---------------------------------------------------------------------------
export const certifications: { name: string; year?: string; inProgress?: boolean }[] = [
  { name: "MuleSoft Certified Developer – Level 1" },
  { name: "Boomi Runtime Architect", year: "2025" },
  { name: "ServiceNow Certified System Administrator", year: "2026" },
  { name: "ServiceNow Certified Application Developer", inProgress: true },
  { name: "Databricks Lakehouse Fundamentals" },
];

export const education = [
  {
    degree: "B.Tech in Computer Science Engineering",
    school: "Shri Shankaracharya Technical Campus",
    period: "2017–2021",
  },
];

// ---------------------------------------------------------------------------
// Contact
// The form opens the visitor's email app with everything filled in (mailto).
// To switch to Formspree later, see README → "Switch the form to Formspree".
// ---------------------------------------------------------------------------
export const contact = {
  title: "Say hello",
  lede: "Hiring for a forward deployed role, scoping an agent project, or just curious how something here works? Compose a request below and it lands in my inbox.",
  intents: [
    { id: "hiring", label: "Hiring", subject: "Role opportunity" },
    { id: "project", label: "Agent project", subject: "Agent project" },
    { id: "integration", label: "Integration work", subject: "Integration work" },
    { id: "hello", label: "Just saying hi", subject: "Hello" },
  ],
};

export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];
