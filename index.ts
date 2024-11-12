export default {
  fetch: (request: Request) => {
    const url = new URL(request.url);

    if (url.pathname === "/resolve") {
      const issueUrl = url.searchParams.get("issue");

      // 1) Validate if this repo can be done (<50k tokens, small files). If not, immediately notify about that.

      // 2) Create a payment URL tied to the issue, for $1 and redirect to Stripe.
      const paymentUrl = "";

      return new Response("Redirecting", {
        status: 307,
        headers: { Location: paymentUrl },
      });
    }

    if (url.pathname === "/calback") {
      // handle stripe payment success:
      // link payment to owner/repo
      // initiate uithub resolver with my github PAT and Anthropic tokens!
    }
  },
};
