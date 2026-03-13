import Link from "next/link";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-16">

        <Link href="/">
          <button className="mb-6 bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700">
            ← Back to Home
          </button>
        </Link>

        {/* Project Goal */}
        <section className="bg-zinc-900 p-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-6">Project Goal</h2>
          <p className="text-zinc-300 mb-4">
            BaseScout is designed to attract more users to the Base ecosystem by providing a highly interactive,
            gamified, and reward-driven platform. Our main goal is to scale user engagement while offering
            meaningful incentives for activity, creating a multi-functional web experience. 
          </p>
          <p className="text-zinc-300 mb-4">
            In addition, the project seeks investment to enhance platform functionality, run targeted marketing campaigns, 
            and introduce advanced features such as AI-driven analytics, social tasks, and prediction-based games. 
            By rewarding users consistently and transparently, we aim to build a loyal community within Base.
          </p>
          <p className="text-zinc-300">
            Ultimately, BaseScout combines gamification, predictive analytics, and user engagement mechanics to
            create a self-sustaining ecosystem that benefits both the users and investors, showing measurable
            growth and adoption metrics.
          </p>
        </section>

        {/* Roadmap */}
        <section className="bg-zinc-900 p-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-6">Roadmap (1–2 Months)</h2>
          <ul className="list-disc list-inside text-zinc-300 space-y-3">
            <li>
              <strong>New Badge System:</strong> Implement additional badges for various milestones to incentivize daily engagement.
            </li>
            <li>
              <strong>Social Tasks:</strong> Users will be able to complete social-oriented tasks such as sharing content, 
              inviting friends, and participating in community challenges to earn rewards.
            </li>
            <li>
              <strong>AI Project Insights:</strong> Integrate a feature where users can input any project name and receive a concise 
              AI-generated summary of key metrics, growth indicators, and overall performance score.
            </li>
            <li>
              <strong>User-Created Predictions:</strong> Allow users to create their own predictions with optional stakes, 
              adding a peer-to-peer competitive element.
            </li>
            <li>
              <strong>Gamified Mini-Games:</strong> Introduce interactive mini-games that reward users with Base points, badges, or perks.
            </li>
            <li>
              <strong>Season 0 Rewards:</strong> After 1–2 months of user activity, distribute special rewards to top users to celebrate engagement and retention.
            </li>
          </ul>
          <p className="text-zinc-300 mt-4">
            Our roadmap is designed to maximize early adoption, ensure continuous user interaction, and demonstrate clear
            value to potential investors and the Base ecosystem.
          </p>
        </section>

        {/* Project Benefits & Future Vision */}
        <section className="bg-zinc-900 p-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-6">Project Benefits & Future Vision</h2>
          <p className="text-zinc-300 mb-4">
            BaseScout creates a sustainable and engaging environment for users within Base, combining predictive analytics,
            gamification, and reward mechanisms. Users are motivated to participate in activities such as check-ins, 
            predictions, and social tasks while earning tangible rewards.
          </p>
          <p className="text-zinc-300 mb-4">
            Investors benefit from a platform that demonstrates user growth, high engagement metrics, and the potential 
            for viral adoption. By providing clear analytics on user behavior, predictions, and retention rates, BaseScout 
            offers measurable indicators of project success.
          </p>
          <p className="text-zinc-300 mb-4">
            Looking forward, we plan to expand functionality by integrating AI-generated insights, community-driven 
            prediction markets, seasonal competitions, and collaborations with other Base projects. The vision is to 
            establish BaseScout as the go-to hub for gamified interactions and predictive insights on Base.
          </p>
          <p className="text-zinc-300">
            By continuously evolving and rewarding engagement, BaseScout ensures both short-term excitement and long-term 
            retention, creating a compelling narrative for funding opportunities through the Base Grant Program.
          </p>
        </section>

        {/* Investment & Opportunities */}
        <section className="bg-zinc-900 p-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-6">Investment & Opportunities</h2>
          <p className="text-zinc-300 mb-4">
            BaseScout presents a unique investment opportunity for participants in the Base ecosystem. Funding will be 
            used to:
          </p>
          <ul className="list-disc list-inside text-zinc-300 space-y-3 mb-4">
            <li>Enhance platform features and user experience</li>
            <li>Run marketing campaigns to expand user adoption</li>
            <li>Develop AI analytics and predictive tools for users</li>
            <li>Create seasonal reward systems and gamified content</li>
          </ul>
          <p className="text-zinc-300">
            Investors can expect transparency in fund usage, clear growth metrics, and the potential for high ROI as 
            BaseScout scales across the Base ecosystem.
          </p>
        </section>

        {/* Contact & Links */}
        <section className="bg-zinc-900 p-10 rounded-xl space-y-4">
          <h2 className="text-3xl font-bold mb-6">Contact & Links</h2>
          <ul className="text-zinc-300 space-y-2">
            <li>
              <strong>Backend:</strong>{" "}
              <a href="https://github.com/dfilipenko2806/basescout-backend" className="text-blue-500 ml-2 hover:underline" target="_blank">
                GitHub
              </a>
            </li>
            <li>
              <strong>Frontend:</strong>{" "}
              <a href="https://github.com/dfilipenko2806/basescout-frontend" className="text-blue-500 ml-2 hover:underline" target="_blank">
                GitHub
              </a>
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:dfilipenko2806@gmail.com" className="text-blue-500 ml-2 hover:underline">
                dfilipenko2806@gmail.com
              </a>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
