import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scorr — AP Physics AI Tutor | Score a 5',
  description:
    'The only AI tutor that grades your FRQs against the real AP rubric, tracks your weak topics, and predicts your exam score — updated after every practice session.',
}

export default function HomePage() {
  return (
    <div className="bg-white text-[#0F172A]">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold text-[#0F172A]">Scorr</span>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm text-gray-600 hover:text-[#0F172A]">Features</a>
            <a href="#" className="text-sm text-gray-600 hover:text-[#0F172A]">Pricing</a>
            <a href="#" className="text-sm text-gray-600 hover:text-[#0F172A]">Free Trial</a>
            <a
              href="#"
              className="rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Start Free
            </a>
          </nav>
          {/* Mobile hamburger — static */}
          <button className="flex flex-col gap-1 md:hidden" aria-label="Menu">
            <span className="h-0.5 w-5 bg-gray-600" />
            <span className="h-0.5 w-5 bg-gray-600" />
            <span className="h-0.5 w-5 bg-gray-600" />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-[#0D9488]">
            AP Physics 1 · Now Available
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-tight text-[#0F172A] md:text-6xl">
            Know your score before<br />exam day
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            The only AI tutor that grades your FRQs against the real AP rubric, tracks your weak
            topics, and predicts your exam score — updated after every practice session.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="rounded-lg bg-[#0D9488] px-6 py-3 font-semibold text-white hover:bg-teal-700"
            >
              Start Free Trial
            </a>
            <a
              href="#"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-[#0F172A] hover:bg-gray-50"
            >
              See How It Works
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Free for 3 lessons · No credit card required · AP Physics 1 &amp; Chemistry
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            {[
              '300,000+ AP Physics students yearly',
              '50% of exam is FRQ',
              '97% of students improve',
            ].map((stat) => (
              <div key={stat} className="text-sm font-medium text-gray-500">{stat}</div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bg-[#F9FAFB] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0D9488]">
            The problem with existing tools
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-[#0F172A] md:text-4xl">
            Khan Academy teaches it. Studdy solves your homework. Nobody prepares you for the
            actual exam.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Too broad',
                body: 'General platforms cover 50 subjects. None are built specifically around the AP Physics exam format.',
              },
              {
                title: 'No FRQ help',
                body: "Free response is 50% of your score. Every other tool ignores it. You're on your own for the hardest part.",
              },
              {
                title: 'No score prediction',
                body: "You study for weeks with no idea if you're on track for a 3, 4, or 5. Scorr fixes that.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[#0F172A]">{card.title}</h3>
                <p className="mt-2 text-sm text-[#6B7280]">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0D9488]">
            Everything built for the AP exam
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#0F172A] md:text-4xl">
            Six tools. One goal: a 5.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                accent: 'bg-teal-50',
                icon: '🎓',
                title: 'AI tutor that knows your lesson',
                body: "Ask anything about the exact topic you're studying. Your AI tutor knows you're on AP Physics Unit 1, Topic 1.A — not just 'physics in general'. Get step-by-step explanations, worked examples, and instant answers 24/7.",
              },
              {
                accent: 'bg-navy-50',
                icon: '📝',
                title: 'FRQ graded against the real AP rubric',
                body: 'Submit your free-response answer and get it scored exactly like College Board does — point by point. See which points you earned, which you missed, and exactly why. No other platform does this with AI.',
              },
              {
                accent: 'bg-teal-50',
                icon: '📈',
                title: 'Predicted AP score, updated live',
                body: 'After every practice session your predicted score updates — from a 3 to a 4, from a 4 toward a 5. The moment you see that number move is the moment you keep coming back.',
              },
              {
                accent: 'bg-indigo-50',
                icon: '⚡',
                title: 'Interactive physics simulations',
                body: "See Newton's Second Law happen in real time. Drag a slider, change the ramp angle, watch the acceleration update. Understanding physics by doing it beats reading about it every time.",
              },
              {
                accent: 'bg-teal-50',
                icon: '🗺️',
                title: 'Automatic weakness detection',
                body: 'After 20 problems, your AI tutor knows exactly which AP topics you\'re struggling with — kinematics, rotational motion, energy — and automatically drills those areas harder.',
              },
              {
                accent: 'bg-indigo-50',
                icon: '📷',
                title: 'Photograph any problem',
                body: 'Point your camera at any AP Physics problem — from your textbook, a past exam, or your homework. Scorr reads it and walks you through the solution step by step.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${f.accent}`}
                >
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#0F172A]">{f.title}</h3>
                <p className="mt-2 text-sm text-[#6B7280]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#F9FAFB] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0D9488]">
            How Scorr works
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#0F172A] md:text-4xl">
            From confused to confident in 10-minute sessions
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: '1',
                title: 'Pick your unit',
                body: 'Choose from all 7 AP Physics 1 units structured exactly like the College Board curriculum.',
              },
              {
                n: '2',
                title: 'Learn with AI',
                body: 'Read the concept note, run the interactive simulation, ask your AI tutor anything.',
              },
              {
                n: '3',
                title: 'Practice and get graded',
                body: 'Solve MCQ and FRQ problems. AI grades instantly and explains every mistake.',
              },
              {
                n: '4',
                title: 'Watch your score rise',
                body: 'Your predicted AP score updates after every session. See exactly how close you are to a 5.',
              },
            ].map((step) => (
              <div key={step.n} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D9488] text-sm font-bold text-white">
                  {step.n}
                </div>
                <h3 className="mt-4 font-semibold text-[#0F172A]">{step.title}</h3>
                <p className="mt-2 text-sm text-[#6B7280]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-[#0D9488]">
            Simple, honest pricing
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold text-[#0F172A] md:text-4xl">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <div className="mt-12 grid items-center gap-8 md:grid-cols-3">
            {/* Free */}
            <div className="rounded-xl border border-gray-200 p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Taste test</p>
              <p className="mt-2 text-4xl font-bold text-[#0F172A]">$0<span className="text-lg font-normal text-gray-400"> /mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-[#6B7280]">
                {['3 full lessons', '10 AI tutor questions per day', '2 practice problem sets', 'No credit card required'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="font-semibold text-[#0D9488]">✓</span>{f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-8 block w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-[#0F172A] hover:bg-gray-50"
              >
                Start Free
              </a>
            </div>

            {/* Student — highlighted */}
            <div className="relative scale-105 rounded-xl border-2 border-[#0D9488] bg-white p-8 shadow-md ring-2 ring-[#0D9488]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#0D9488] px-4 py-1 text-xs font-bold text-white">
                MOST POPULAR
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0D9488]">Most popular</p>
              <p className="mt-2 text-4xl font-bold text-[#0F172A]">$19.99<span className="text-lg font-normal text-gray-400"> /mo</span></p>
              <p className="mt-1 text-xs text-gray-400">or $99/year (save 58%)</p>
              <ul className="mt-6 space-y-2 text-sm text-[#6B7280]">
                {[
                  'All 7 units — complete AP Physics 1',
                  'Unlimited AI tutor questions',
                  'FRQ grader with AP rubric scoring',
                  'Predicted AP score dashboard',
                  'Weakness map — auto-updated',
                  'Interactive simulations every lesson',
                  'Photo scan — any problem',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="font-semibold text-[#0D9488]">✓</span>{f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-8 block w-full rounded-lg bg-[#0D9488] px-6 py-3 text-center font-semibold text-white hover:bg-teal-700"
              >
                Start Free Trial
              </a>
            </div>

            {/* AP Bundle */}
            <div className="rounded-xl border border-gray-200 p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Physics + Chemistry</p>
              <p className="mt-2 text-4xl font-bold text-[#0F172A]">$24.99<span className="text-lg font-normal text-gray-400"> /mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-[#6B7280]">
                {[
                  'Everything in Student plan',
                  'AP Chemistry — full curriculum',
                  'Chemistry lab simulations',
                  'Bundle saves $15/month vs separate',
                  'One dashboard for both subjects',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="font-semibold text-[#0D9488]">✓</span>{f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-8 block w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-[#0F172A] hover:bg-gray-50"
              >
                Start Free Trial
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-400">
            School or district? Email us for bulk pricing at{' '}
            <a href="mailto:hello@scorr.ai" className="text-[#0D9488] hover:underline">hello@scorr.ai</a>
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#F9FAFB] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-[#0D9488]">
            What AP students say
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold text-[#0F172A] md:text-4xl">
            Students who used Scorr stopped guessing their score
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  'I had no idea if I was on track for a 4 or a 5. After two weeks on Scorr my predicted score went from 3.2 to 4.1. I actually knew where I stood.',
                name: 'Maya R.',
                label: 'AP Physics 1 student',
              },
              {
                quote:
                  'The FRQ grader is the only reason I passed. I had been losing points on free response without knowing why. Scorr showed me exactly what College Board wanted.',
                name: 'James T.',
                label: 'Scored 4',
              },
              {
                quote:
                  'The simulations make everything click. I watched the projectile motion sim for 5 minutes and understood more than I did from 3 weeks of class notes.',
                name: 'Priya S.',
                label: 'AP Physics 1',
              },
            ].map((t) => (
              <div key={t.name} className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm text-[#6B7280]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4">
                  <p className="font-semibold text-[#0F172A]">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0D9488]">
            How Scorr compares
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#0F172A] md:text-4xl">
            Built specifically for the AP exam. Nothing else is.
          </h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left font-semibold text-[#0F172A]">Feature</th>
                  {['Scorr', 'Khan Academy', 'Studdy', 'UWorld', 'Albert'].map((col) => (
                    <th
                      key={col}
                      className={`px-4 py-3 text-center font-semibold ${col === 'Scorr' ? 'text-[#0D9488]' : 'text-[#0F172A]'}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['AP unit structure (1–7)', '✓', 'Partial', '✗', '✓', '✓'],
                  ['AI tutor (live chat)', '✓', 'Partial', '✓', '✗', '✗'],
                  ['FRQ grading vs AP rubric', '✓', '✗', '✗', '✗', '✗'],
                  ['Interactive simulations', '✓', '✗', '✗', '✗', '✗'],
                  ['Predicted AP score', '✓', '✗', '✗', '✗', '✗'],
                  ['Weakness map by topic', '✓', '✗', '✗', 'Partial', 'Partial'],
                  ['Photo scan', '✓', '✗', '✓', '✗', '✗'],
                  ['Price', '$19.99/mo', 'Free', 'Free', 'Paid', 'Paid'],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-gray-100">
                    <td className="py-3 text-[#6B7280]">{row[0]}</td>
                    {row.slice(1).map((cell, i) => (
                      <td
                        key={i}
                        className={`px-4 py-3 text-center ${
                          i === 0
                            ? 'font-semibold text-[#0D9488]'
                            : cell === '✓'
                            ? 'text-green-500'
                            : cell === '✗'
                            ? 'text-gray-300'
                            : 'text-[#6B7280]'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F9FAFB] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-[#0D9488]">
            Common questions
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold text-[#0F172A] md:text-4xl">
            Got questions? We&apos;ve got answers.
          </h2>
          <div className="mt-10 space-y-6">
            {[
              {
                q: 'Do I need to be taking AP Physics in school to use Scorr?',
                a: 'No. Many students self-study for AP exams. Scorr follows the exact College Board curriculum so you can learn everything you need independently.',
              },
              {
                q: 'What is an FRQ and why does it matter?',
                a: "Free Response Questions make up 50% of your AP exam score. They require written, multi-step answers graded by a human examiner — or in Scorr's case, by AI using the real rubric.",
              },
              {
                q: 'How accurate is the predicted AP score?',
                a: "It's based on your actual performance on AP-style questions across all topics. The more you practice, the more accurate it becomes. Think of it as a live GPS for your exam prep.",
              },
              {
                q: 'Can my teacher or parent see my progress?',
                a: 'Teacher dashboards are coming in Phase 2. Currently the dashboard is for students only.',
              },
              {
                q: 'What happens when I finish AP Physics 1?',
                a: 'AP Chemistry is coming next, bundled at $24.99/month. AP Physics 2, Biology, and Calculus are on the roadmap.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes — 3 full lessons, 10 AI questions per day, no credit card. Enough to know if Scorr is right for you.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl bg-white p-6 shadow-sm">
                <p className="font-semibold text-[#0F172A]">{item.q}</p>
                <p className="mt-2 text-sm text-[#6B7280]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#0F172A] py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">
            The AP exam is in May. Start knowing your score today.
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Join thousands of AP students who stopped guessing and started scoring.
          </p>
          <a
            href="#"
            className="mt-8 inline-block rounded-lg bg-[#0D9488] px-8 py-4 text-lg font-semibold text-white hover:bg-teal-600"
          >
            Start Free — No Credit Card
          </a>
          <p className="mt-4 text-sm text-gray-400">
            AP Physics 1 available now · AP Chemistry coming soon
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <span className="text-lg font-bold text-[#0F172A]">Scorr</span>
            <p className="mt-1 text-xs text-gray-400">© 2026 Scorr. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[#0F172A]">Features</a>
            <a href="#" className="hover:text-[#0F172A]">Pricing</a>
            <a href="#" className="hover:text-[#0F172A]">Blog</a>
            <a href="#" className="hover:text-[#0F172A]">Contact</a>
            <a href="mailto:hello@scorr.ai" className="hover:text-[#0F172A]">hello@scorr.ai</a>
          </nav>
          <p className="text-xs text-gray-400">AP Physics 1 · AP Chemistry · Built for the 5</p>
        </div>
      </footer>
    </div>
  )
}
