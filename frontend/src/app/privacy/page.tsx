'use client';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-text-primary mb-2">Privacy Policy</h1>
      <p className="text-text-muted mb-8">Last updated: January 2025</p>

      <div className="space-y-8 text-text-secondary leading-relaxed">
        <section className="bg-bg-card rounded-2xl border border-border-secondary p-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">Information We Collect</h2>
          <p className="mb-4">
            When you use AniBrain, we may collect the following information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (email, username) when you register</li>
            <li>AniList and MyAnimeList usernames when you use integration features</li>
            <li>Anime and manga preferences based on your searches and saved items</li>
            <li>Basic usage data to improve our service</li>
          </ul>
        </section>

        <section className="bg-bg-card rounded-2xl border border-border-secondary p-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide personalized anime and manga recommendations</li>
            <li>To improve and optimize our AI recommendation engine</li>
            <li>To communicate with you about service updates</li>
            <li>To maintain the security and integrity of our platform</li>
          </ul>
        </section>

        <section className="bg-bg-card rounded-2xl border border-border-secondary p-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">Data Sharing</h2>
          <p className="mb-4">
            We do not sell your personal information to third parties. We may share
            anonymized, aggregate data for research and analytical purposes.
          </p>
          <p>
            When you use integration features, we access your AniList or MyAnimeList
            data solely for the purpose of generating recommendations.
          </p>
        </section>

        <section className="bg-bg-card rounded-2xl border border-border-secondary p-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data,
            including encryption in transit and at rest. However, no method of
            electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="bg-bg-card rounded-2xl border border-border-secondary p-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">Contact</h2>
          <p>
            If you have questions about this privacy policy, please contact us through
            our GitHub repository or reach out via the community channels.
          </p>
        </section>
      </div>
    </div>
  );
}
