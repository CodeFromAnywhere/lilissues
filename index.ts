interface UithubResponse {
  success: boolean;
  message?: string;
  resolvedFiles?: any[];
}

const UITHUB_BASE_URL = 'https://uithub.com';

async function fetchRepoInfo(issueUrl: string) {
  try {
    const urlParts = new URL(issueUrl).pathname.split('/');
    if (urlParts.length < 5) throw new Error('Invalid GitHub issue URL');
    
    const owner = urlParts[1];
    const repo = urlParts[2];
    
    return { owner, repo };
  } catch (error) {
    throw new Error('Invalid GitHub issue URL format');
  }
}

async function getUithubResolution(owner: string, repo: string): Promise<UithubResponse> {
  try {
    const response = await fetch(`${UITHUB_BASE_URL}/${owner}/${repo}?accept=application/json`);
    
    if (!response.ok) {
      throw new Error(`UIthub API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('UIthub resolution error:', error);
    throw new Error('Failed to get resolution from UIthub');
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);

      if (url.pathname === '/resolve') {
        const issueUrl = url.searchParams.get('issue');
        if (!issueUrl) {
          return new Response(JSON.stringify({ error: 'Issue URL is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Extract owner and repo from issue URL
        const { owner, repo } = await fetchRepoInfo(issueUrl);
        
        // Get resolution from UIthub
        const resolution = await getUithubResolution(owner, repo);

        // Create payment URL (placeholder for now)
        const paymentUrl = `https://payment-provider.com/pay?amount=1&currency=usd&issue=${encodeURIComponent(issueUrl)}`;

        return new Response(JSON.stringify({
          success: true,
          resolution,
          paymentUrl
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/callback') {
        // TODO: Implement payment callback handling
        return new Response(JSON.stringify({ message: 'Payment callback received' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
