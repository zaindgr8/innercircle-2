'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, AlertCircle, Check } from 'lucide-react';

const NAV = [
  { href: '#circle', label: 'The Circle' },
  { href: '#members', label: 'Members' },
  { href: '#process', label: 'Process' },
  { href: '#faq', label: 'FAQ' },
];

const PILLARS = [
  {
    index: 'I',
    title: 'The table',
    body: 'Private dinners across Dubai, kept small on purpose. Small enough that every person at the table is part of the same conversation.',
  },
  {
    index: 'II',
    title: 'The people',
    body: 'Founders running real companies and the investors who back them. Every seat arrives through someone already here — never through a list.',
  },
  {
    index: 'III',
    title: 'What follows',
    body: 'Partnerships, co-investments and hires that begin over dinner and close months later. Made directly between members. Nothing brokered.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'An introduction',
    body: 'A member puts your name forward. Tell us who they are and how you know them.',
  },
  {
    num: '02',
    title: 'A short conversation',
    body: 'We confirm the introduction and make sure the fit runs both ways. Usually two to three days.',
  },
  {
    num: '03',
    title: 'A seat',
    body: 'You receive your first dinner invitation and access to the member channel.',
  },
];

const FAQS = [
  {
    q: 'Do I really need a referral?',
    a: 'Yes — without exception. The circle only grows by introduction, and that is the entire reason it is worth being in. Every member is accountable for the people they bring.',
  },
  {
    q: 'I don’t know a member yet.',
    a: 'Then this isn’t the moment, and we would rather tell you plainly than keep you waiting. If someone you know is already here, ask them to put your name forward.',
  },
  {
    q: 'What actually happens at a dinner?',
    a: 'Dinner. No panels, no pitch decks, no name badges, no rotating speed-networking. Members talk about what they are genuinely working on, and the useful introductions make themselves.',
  },
  {
    q: 'How long does the review take?',
    a: 'Two to three business days in most cases. We reply either way — a decision you can act on is more useful than silence.',
  },
  {
    q: 'Is there anything to pay?',
    a: 'Nothing to apply. If a seat is offered, we will walk you through how dinners are handled before you commit to anything.',
  },
  {
    q: 'How discreet is this?',
    a: 'We do not publish the member list, we do not sell or share your details, and what is said at the table stays there. Your application is read only by the people reviewing it.',
  },
];

const CRITERIA_FOR = [
  'Founders and operators running a company with real revenue or backing',
  'Investors deploying their own capital or a fund’s',
  'People who bring something specific to a room, not just a title',
  'Anyone who would rather have four good conversations than forty',
];

const CRITERIA_NOT_FOR = [
  'Recruiters and agencies working the room',
  'Anyone whose opening line is a deck',
  'Collectors of contacts and follower counts',
  'People looking for an audience rather than peers',
];

const EMPTY_FORM = {
  referenceName: '',
  referenceRelationship: '',
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  title: '',
  linkedinUrl: '',
  contributionReason: '',
  location: 'Dubai, UAE',
};

export default function Home() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    referenceId: string;
    applicantName: string;
    sponsorName: string;
  } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  // Hairline under the header only once the page has moved
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal sections as they come into view
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.reveal');

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [submitted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
  };

  const fail = (message: string, focusField?: keyof typeof EMPTY_FORM) => {
    setSubmitError(message);
    // Wait for the alert to paint before scrolling to it, then put the cursor
    // in the field that needs fixing.
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (focusField) {
        document.getElementById(focusField)?.focus({ preventScroll: true });
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.referenceName.trim()) {
      return fail('Please tell us who introduced you.', 'referenceName');
    }
    if (!formData.referenceRelationship.trim()) {
      return fail('Please tell us how you know them.', 'referenceRelationship');
    }
    if (!formData.fullName.trim()) {
      return fail('Please enter your full name.', 'fullName');
    }
    if (!formData.email.trim()) {
      return fail('Please enter an email address we can reply to.', 'email');
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'We could not send your request. Please try again.');
      }

      setSubmitted({
        referenceId: data.referenceId || 'TIC-PENDING',
        applicantName: formData.fullName,
        sponsorName: formData.referenceName,
      });
      setFormData(EMPTY_FORM);

      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" data-scrolled={scrolled}>
        <div className="wrap header__inner">
          <a href="#top" className="brand" aria-label="The Inner Circle DXB — home">
            <span className="brand__mark">
              <Image src="/logo.jpg" alt="" width={60} height={60} priority />
            </span>
            <span className="brand__name">The Inner Circle</span>
          </a>

          <nav className="nav" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <a href="#apply" className="btn btn--primary">
            Apply
          </a>
        </div>
      </header>

      <main id="top">
        {/* ---------------------------------------------------- Hero */}
        <section className="wrap hero">
          {/* The brand mark, set as type rather than a cropped photo — crisp at
              any size and the true focal point of the hero. Decorative: the
              header's brand link already gives screen readers the name. */}
          <div className="wordmark" aria-hidden="true">
            <div className="wordmark__flank">
              <span className="wordmark__rule" />
              <span className="wordmark__the">The</span>
              <span className="wordmark__rule" />
            </div>
            <div className="wordmark__main gold-grad">Inner Circle</div>
            <div className="wordmark__flank">
              <span className="wordmark__rule" />
              <span className="wordmark__tag">Dubai</span>
              <span className="wordmark__rule" />
            </div>
          </div>

          <h1 className="hero__tagline">
            Dubai’s founders and investors,{' '}
            <em className="italic gold-grad">at one table</em>
          </h1>

          <p className="lede">
            A private circle that meets over dinner. No panels, no pitching, no badges —
            just people worth knowing, introduced by people who know them.
          </p>

          <div className="hero__actions">
            <a href="#apply" className="btn btn--primary">
              Request an introduction
              <ArrowRight size={14} strokeWidth={2} />
            </a>
            <a href="#circle" className="btn btn--ghost">
              What this is
            </a>
          </div>

          <p className="hero__note micro">
            <span className="dot" aria-hidden="true" />
            Dubai · By introduction only
          </p>
        </section>

        {/* ---------------------------------------------- Statement */}
        <section className="section statement reveal">
          <div className="wrap wrap--narrow">
            <hr className="hairline" />
            <p className="h-statement">
              Most networking is a numbers game. This is the opposite.
            </p>
            <p className="body">
              A room of five hundred gives you a stack of cards and nothing by Monday.
              We do the reverse — a small table, the right people, and conversations that
              carry on long after the plates are cleared.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------- Pillars */}
        <section id="circle" className="section reveal">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">The Circle</span>
              <h2 className="h-section">Three things, done properly</h2>
            </div>

            <div className="cols">
              {PILLARS.map((pillar) => (
                <article className="col" key={pillar.title}>
                  <span className="col__index">{pillar.index}</span>
                  <h3 className="h-item">{pillar.title}</h3>
                  <p className="body">{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ Criteria */}
        <section id="members" className="section reveal">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Members</span>
              <h2 className="h-section">Who belongs at the table</h2>
              <p className="lede" style={{ marginTop: '20px' }}>
                A circle is defined as much by who is not in it. We would rather be clear
                now than waste your time later.
              </p>
            </div>

            <div className="criteria">
              <div>
                <h3 className="criteria__title criteria__title--yes">This is for</h3>
                <ul>
                  {CRITERIA_FOR.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true">
                        <Check size={13} strokeWidth={2.2} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="criteria--no">
                <h3 className="criteria__title criteria__title--no">This is not for</h3>
                <ul>
                  {CRITERIA_NOT_FOR.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Steps */}
        <section id="process" className="section reveal">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Process</span>
              <h2 className="h-section">How a seat is offered</h2>
            </div>

            <div className="steps">
              {STEPS.map((step) => (
                <article className="step" key={step.num}>
                  <span className="step__num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p className="body">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Apply */}
        <section id="apply" className="section reveal">
          <div className="wrap wrap--narrow">
            {submitted ? (
              <div className="receipt">
                <span className="receipt__mark">
                  <Check size={22} strokeWidth={1.5} color="var(--gold)" />
                </span>

                <span className="eyebrow" style={{ marginBottom: '18px' }}>
                  Request received
                </span>

                <h2>Thank you, {submitted.applicantName}.</h2>

                <p className="body">
                  We have your request and the introduction from{' '}
                  <strong style={{ color: 'var(--ivory)', fontWeight: 400 }}>
                    {submitted.sponsorName}
                  </strong>
                  . We will confirm it and come back to you by email within two to three
                  business days — either way.
                </p>

                <div className="receipt__ref">
                  <div className="micro">Your reference</div>
                  <code>{submitted.referenceId}</code>
                </div>
              </div>
            ) : (
              <>
                <div className="section-head center">
                  <span className="eyebrow">Membership</span>
                  <h2 className="h-section">Request an introduction</h2>
                  <p className="lede" style={{ marginTop: '20px' }}>
                    Two minutes. The name of the member introducing you is required —
                    it is the first thing we check.
                  </p>
                </div>

                <form className="form" onSubmit={handleSubmit} noValidate>
                  <div ref={errorRef}>
                    {submitError && (
                      <div className="alert" role="alert">
                        <AlertCircle size={15} strokeWidth={2} />
                        <span>{submitError}</span>
                      </div>
                    )}
                  </div>

                  <fieldset className="fieldset">
                    <legend className="fieldset__legend">
                      01 — Your introduction
                    </legend>

                    <div className="grid-2">
                      <div className="field">
                        <label htmlFor="referenceName">
                          Who introduced you<span className="req">*</span>
                        </label>
                        <input
                          id="referenceName"
                          name="referenceName"
                          type="text"
                          value={formData.referenceName}
                          onChange={handleChange}
                          placeholder="Their full name"
                          autoComplete="off"
                          required
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="referenceRelationship">
                          How you know them<span className="req">*</span>
                        </label>
                        <input
                          id="referenceRelationship"
                          name="referenceRelationship"
                          type="text"
                          value={formData.referenceRelationship}
                          onChange={handleChange}
                          placeholder="Co-investor, former colleague…"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset__legend">
                      02 — You <em>(optional fields help us decide faster)</em>
                    </legend>

                    <div className="grid-2">
                      <div className="field">
                        <label htmlFor="fullName">
                          Full name<span className="req">*</span>
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Your name"
                          autoComplete="name"
                          required
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="email">
                          Email<span className="req">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@company.com"
                          autoComplete="email"
                          required
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="companyName">Company or fund</label>
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Where you spend your days"
                          autoComplete="organization"
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="title">Role</label>
                        <input
                          id="title"
                          name="title"
                          type="text"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Founder, Partner…"
                          autoComplete="organization-title"
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="phone">Phone or WhatsApp</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+971 50 000 0000"
                          autoComplete="tel"
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="linkedinUrl">LinkedIn or website</label>
                        <input
                          id="linkedinUrl"
                          name="linkedinUrl"
                          type="url"
                          value={formData.linkedinUrl}
                          onChange={handleChange}
                          placeholder="https://"
                          autoComplete="url"
                        />
                      </div>

                      <div className="field field--full">
                        <label htmlFor="contributionReason">
                          What are you building right now?
                        </label>
                        <textarea
                          id="contributionReason"
                          name="contributionReason"
                          rows={3}
                          value={formData.contributionReason}
                          onChange={handleChange}
                          placeholder="Two or three lines is plenty."
                        />
                      </div>
                    </div>
                  </fieldset>

                  <div className="form__footer">
                    <button
                      type="submit"
                      className="btn btn--primary btn--block"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending…' : 'Send request'}
                    </button>
                    <p className="form__consent">
                      Read only by the people reviewing applications. Never shared, never sold.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>

        {/* ----------------------------------------------------- FAQ */}
        <section id="faq" className="section reveal">
          <div className="wrap wrap--narrow">
            <div className="section-head center">
              <span className="eyebrow">Questions</span>
              <h2 className="h-section">Before you ask</h2>
            </div>

            <div className="faq">
              {FAQS.map((faq, i) => (
                <details key={faq.q} name="faq" open={i === 0}>
                  <summary>
                    {faq.q}
                    <span className="sign" aria-hidden="true" />
                  </summary>
                  <p className="body">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* -------------------------------------------------- Footer */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <a href="#top" className="brand">
              <span className="brand__mark">
                <Image src="/logo.jpg" alt="" width={60} height={60} />
              </span>
              <span className="brand__name">The Inner Circle DXB</span>
            </a>

            <nav className="footer__links" aria-label="Footer">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className="link">
                  {item.label}
                </a>
              ))}
              <a href="#apply" className="link-gold">
                Apply
              </a>
            </nav>
          </div>

          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} The Inner Circle DXB. Dubai, UAE.</span>
            <span>
              <a href="mailto:contact@devmatesolutions.com" className="link">
                contact@devmatesolutions.com
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
