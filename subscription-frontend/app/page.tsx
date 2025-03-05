import HealthCheck from "./components/HealthCheck";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          NextJS + Rails API PayPal Subscription Demo
        </h1>

        <div className="mb-8">
          <HealthCheck />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2">Basic Plan</h3>
              <p className="text-gray-600 mb-4">
                Access to core features with limited usage.
              </p>
              <p className="text-2xl font-bold mb-4">$139 / month</p>
              <a
                href="/upgrade/basic"
                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-center"
              >
                Upgrade to Basic
              </a>
            </div>

            <div className="border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
              <p className="text-gray-600 mb-4">
                Unlimited access to all features and priority support.
              </p>
              <p className="text-2xl font-bold mb-4">$199 / month</p>
              <a
                href="/upgrade/premium"
                className="block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md text-center"
              >
                Upgrade to Premium
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/billing"
            className="inline-block py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md"
          >
            View Billing Page
          </a>
        </div>
      </div>
    </main>
  );
}
