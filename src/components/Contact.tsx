"use client";

import { AnimatePresence, m, useAnimationControls, useReducedMotion } from "framer-motion";
import { useId, useMemo, useState } from "react";
import { contact, profile } from "@/content";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { fadeUp, Reveal, SectionHeading } from "./Reveal";

/**
 * A contact form styled as an API request. Visitors fill in the fields,
 * watch the JSON body build itself, then "send": a paper plane takes off
 * and their email app opens with everything filled in (mailto).
 */

type Status = "idle" | "error" | "sending" | "sent";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function JsonLine({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div className="pl-4">
      <span className="text-[var(--json-key)]">&quot;{k}&quot;</span>
      <span className="text-muted">: </span>
      <span className={v ? "text-accent" : "text-muted/60"}>&quot;{v || "…"}&quot;</span>
      {!last && <span className="text-muted">,</span>}
    </div>
  );
}

export default function Contact() {
  const uid = useId();
  const reduce = useReducedMotion();
  const plane = useAnimationControls();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState(contact.intents[0].id);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [copied, setCopied] = useState(false);

  const bytes = useMemo(() => new TextEncoder().encode(message).length, [message]);
  const intentObj = contact.intents.find((i) => i.id === intent)!;
  const preview = message.length > 60 ? message.slice(0, 60).replace(/\s+\S*$/, "") + "…" : message;

  const check = {
    name: (v: string) => (v.trim() ? undefined : "Add your name so I know who's writing."),
    email: (v: string) => (emailOk(v) ? undefined : "Add a valid email so I can reply."),
    message: (v: string) => (v.trim().length >= 10 ? undefined : "Write at least a sentence (10+ characters)."),
  };

  const validate = () => {
    const e: typeof errors = { name: check.name(name), email: check.email(email), message: check.message(message) };
    setErrors(e);
    return !e.name && !e.email && !e.message;
  };

  // Once a field has shown an error, re-check it as the visitor types so it clears when fixed.
  const update = (key: keyof typeof check, value: string, set: (v: string) => void) => {
    set(value);
    if (errors[key]) {
      const next = { ...errors, [key]: check[key](value) };
      setErrors(next);
      if (!next.name && !next.email && !next.message) setStatus("idle");
    }
  };

  const send = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const subject = `${intentObj.subject} from ${name.trim()}`;
    const body = `${message.trim()}\n\n${name.trim()}\n${email.trim()}`;
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (!reduce) {
      await plane.start({
        x: [0, 40, 260, 520],
        y: [0, -30, -140, -320],
        rotate: [0, -10, -18, -24],
        scale: [1, 1.4, 1.8, 2],
        // leaves the button, so it switches from button-ink to the accent colour
        color: [null, "#2ee6d0", "#2ee6d0", "#2ee6d0"],
        opacity: [1, 1, 1, 0],
        transition: { duration: 1.1, ease: [0.5, 0, 0.75, 0] },
      });
    }
    window.location.href = href;
    setStatus("sent");
    // a fresh plane slides back in, ready for another message
    plane.set({ x: -18, y: 10, rotate: 0, scale: 1, opacity: 0, color: "currentColor" });
    plane.start({ x: 0, y: 0, opacity: 1, transition: { delay: 0.6, duration: 0.4 } });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const field =
    "w-full rounded-xl border bg-bg px-4 py-3 text-fg placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none focus-visible:outline-none";

  const statusLine =
    status === "error"
      ? { code: "400", text: "Bad Request: fix the highlighted fields.", tone: "text-[#ff8a8a]" }
      : status === "sending"
        ? { code: "102", text: "Processing: folding the paper plane…", tone: "text-warn" }
        : status === "sent"
          ? { code: "202", text: "Accepted: opening your email app with everything filled in. Nothing opened? Use \"Or copy my email\".", tone: "text-accent" }
          : { code: "···", text: "Ready when you are.", tone: "text-muted" };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading id="contact" title={contact.title} lede={contact.lede} />
            <Reveal as="ul" className="space-y-3">
              {[
                { href: `mailto:${profile.email}`, label: profile.email, Icon: MailIcon, ext: false },
                { href: profile.linkedin, label: "LinkedIn", Icon: LinkedInIcon, ext: true },
                { href: profile.github, label: "GitHub", Icon: GitHubIcon, ext: true },
              ].map(({ href, label, Icon, ext }) => (
                <m.li key={label} variants={fadeUp}>
                  <a
                    href={href}
                    {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex items-center gap-3 text-lg text-fg transition-colors hover:text-accent"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent">
                      <Icon />
                    </span>
                    <span className="break-all">{label}</span>
                  </a>
                </m.li>
              ))}
            </Reveal>
          </div>

          {/* the request composer */}
          <m.div
            initial={{ opacity: 0, y: 30, rotate: 1.2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[1.5rem] border border-line bg-panel shadow-[0_40px_80px_-50px_var(--accent)]"
          >
            {/* request bar */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
              <span className="rounded-md bg-accent px-2 py-0.5 font-mono text-xs font-bold text-accent-ink">POST</span>
              <span className="truncate font-mono text-sm text-fg">
                /hello/<span className="text-accent">shambhavi</span>
              </span>
              <span className="ml-auto flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
              </span>
            </div>

            <form noValidate onSubmit={send} className="space-y-5 p-5 sm:p-7" aria-describedby={`${uid}-status`}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-medium text-fg">
                    Your name
                  </label>
                  <input
                    id={`${uid}-name`}
                    value={name}
                    onChange={(e) => update("name", e.target.value, setName)}
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                    className={`${field} ${errors.name ? "border-[#ff8a8a]" : "border-line"}`}
                  />
                  {errors.name && (
                    <p id={`${uid}-name-err`} className="mt-1.5 text-sm text-[#ff8a8a]">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`${uid}-email`} className="mb-1.5 block text-sm font-medium text-fg">
                    Your email
                  </label>
                  <input
                    id={`${uid}-email`}
                    type="email"
                    value={email}
                    onChange={(e) => update("email", e.target.value, setEmail)}
                    autoComplete="email"
                    placeholder="you@company.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                    className={`${field} ${errors.email ? "border-[#ff8a8a]" : "border-line"}`}
                  />
                  {errors.email && (
                    <p id={`${uid}-email-err`} className="mt-1.5 text-sm text-[#ff8a8a]">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-fg">What&apos;s this about?</legend>
                <div className="flex flex-wrap gap-2">
                  {contact.intents.map((it) => {
                    const on = it.id === intent;
                    return (
                      <label key={it.id} className="relative cursor-pointer">
                        <input type="radio" name={`${uid}-intent`} value={it.id} checked={on} onChange={() => setIntent(it.id)} className="peer sr-only" />
                        <m.span
                          animate={on && !reduce ? { rotate: [0, -4, 4, -2, 0], scale: [1, 1.06, 1] } : { rotate: 0, scale: 1 }}
                          transition={{ duration: 0.45 }}
                          className={`inline-flex rounded-full border px-3.5 py-1.5 text-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                            on ? "border-accent bg-accent text-accent-ink" : "border-line text-fg hover:border-accent/60"
                          }`}
                        >
                          {it.label}
                        </m.span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label htmlFor={`${uid}-msg`} className="text-sm font-medium text-fg">
                    Message
                  </label>
                  <span className="tabular font-mono text-xs text-muted" aria-live="off">
                    payload {bytes} B
                  </span>
                </div>
                <textarea
                  id={`${uid}-msg`}
                  value={message}
                  onChange={(e) => update("message", e.target.value, setMessage)}
                  rows={5}
                  placeholder="Hi Shambhavi, we're building…"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? `${uid}-msg-err` : undefined}
                  className={`${field} resize-y ${errors.message ? "border-[#ff8a8a]" : "border-line"}`}
                />
                {errors.message && (
                  <p id={`${uid}-msg-err`} className="mt-1.5 text-sm text-[#ff8a8a]">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* live request body (decorative; the form above is the real input) */}
              <div aria-hidden="true" className="overflow-hidden rounded-xl border border-line bg-bg p-4 font-mono text-[0.8rem] leading-relaxed">
                <div className="mb-1 text-muted">request body</div>
                <div className="text-muted">{"{"}</div>
                <JsonLine k="from" v={name.trim()} />
                <JsonLine k="reply_to" v={email.trim()} />
                <JsonLine k="intent" v={intentObj.label} />
                <JsonLine k="message" v={preview} last />
                <div className="text-muted">
                  {"}"}
                  <span className="caret ml-0.5 inline-block h-[1em] w-[7px] translate-y-[0.15em] bg-accent/80" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <m.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.96 }}
                  className="relative inline-flex h-12 items-center gap-2.5 rounded-full bg-accent px-6 font-semibold text-accent-ink disabled:opacity-80"
                >
                  Send request
                  <span className="relative inline-flex h-5 w-5 items-center justify-center">
                    <m.svg
                      animate={plane}
                      initial={{ opacity: 1 }}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="absolute"
                    >
                      <path d="M2.4 10.6 21 3.2c.6-.2 1.1.3.9.9l-7.4 18.6c-.2.6-1.1.6-1.3 0l-2.6-7.6-7.6-2.6c-.6-.2-.6-1.1-.6-1.3z" />
                    </m.svg>
                  </span>
                </m.button>

                <button type="button" onClick={copyEmail} className="text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent">
                  <AnimatePresence mode="wait" initial={false}>
                    <m.span key={copied ? "c" : "n"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-block">
                      {copied ? "Copied to clipboard" : "Or copy my email"}
                    </m.span>
                  </AnimatePresence>
                </button>
              </div>

              <p id={`${uid}-status`} role="status" aria-live="polite" className={`flex items-baseline gap-2 border-t border-line pt-4 font-mono text-sm ${statusLine.tone}`}>
                <span className="font-bold">{statusLine.code}</span>
                <span>{statusLine.text}</span>
              </p>
            </form>
          </m.div>
        </div>
      </div>
    </section>
  );
}
