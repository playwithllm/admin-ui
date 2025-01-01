import React from 'react';
import ReactMarkdown from 'react-markdown';
// Optional: allows rendering raw HTML in markdown
import rehypeRaw from 'rehype-raw';

export function Documentation() {
  const markdownContent = `
# API Documentation

## Overview

Welcome to **Play with LLM**, a drop-in replacement for the Ollama API inference system. With this service, you can send prompts to language models via a single endpoint, [\`/api/generate\`], using your **API key** to authenticate.

### Key Highlights
- **Prompt-based** text generation endpoint.
- **API key** creation and management system.
- Real-time usage monitoring and cost tracking.
- Self-serve documentation and reference materials.
- Interactive prompt testing from within the dashboard.

---

## Quickstart Guide

### 1. Create Your API Key
1. **Sign in** to the dashboard.
2. Navigate to **API Keys** in the side menu.
3. Click **“Generate New API Key”** (or the relevant button).
4. Name your key (e.g., \`MyFirstKey\`) and click **Submit**.
5. Copy the generated key; you will need it for making requests.

> **Tip:** Treat your API key like a password. Do not share it publicly or commit it to source control.

### 2. Test Your API Key in the Prompt Menu
1. Go to **Prompt** in the side menu.
2. Enter a sample prompt in the text area.
3. Paste your **API key** in the API box (for the \`x-api-key\` header).
4. Click **“Submit”**.
5. Check the model response below the text area to confirm your key works.

### 3. Make an API Call from terminal

\`\`\`bash
curl -X POST https://api.playwithllm.com/api/generate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY_HERE" \\
  -d '{
    "prompt": "Hello, how are you?"
  }'
\`\`\`

If the request is successful, you will receive a response from the model. Then you can use your preferred programming language to make requests from your application similarly.

### 4. Check Usage and Costs
1. Go to **Requests** to see the requests you have made.
1. Go to **Usage** to see the tokens you have used.
2. Go to **Cost** for daily cost breakdowns.

### 5. Get Support and Experiment
- For real-time chat or to see model capabilities, go to **Support**.
- Experiment with prompts or troubleshoot issues as needed.

---

### Endpoints

#### 1. POST /api/generate
**Description**  
Generates a response from the underlying language model.

**Request Headers**  

<table>
  <thead>
    <tr>
      <th>Header</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>x-api-key</code></td>
      <td>Yes</td>
      <td>Your unique API key for authentication.</td>
    </tr>
    <tr>
      <td><code>Content-Type</code></td>
      <td>Yes</td>
      <td>Must be <code>application/json</code>.</td>
    </tr>
  </tbody>
</table>

**Request Body**  
\`\`\`json
{
  "prompt": "string"
}
\`\`\`


**Response**  
\`\`\`json
{
  "response": "string"
}
\`\`\`

---

## Usage & Cost Tracking

- **Usage Page**: Shows real-time usage metrics (requests, tokens).
- **Cost Page**: Breaks down daily or monthly costs and displays your billing plan.

---

## Support & Troubleshooting

- **Support Page**: Chat interface for **Prompt experimentation**
- Common issues:
  1. **Missing API key** or invalid \`x-api-key\`.
  2. **401 Unauthorized** if key is invalid or quotas are exceeded.
  3. **Incorrect URL** or domain.

---

## Frequently Asked Questions (FAQ)

1. **How do I reset a compromised API key?**  
   - Go to **API Keys**, revoke the old key, and create a new one.

5. **How to give feedback?**  
   - Email me at [foyzulkarim at gmail dot com](mailto:foyzulkarim@gmail.com).
   - Send message at [LinkedIn](https://www.linkedin.com/in/foyzul/).
   - Send message at [Twitter](https://twitter.com/foyzul_karim).
   - Send message at [Facebook](https://www.facebook.com/foyzul365).

---

## Contributing / Feature Requests

We value your feedback. Feel free to reach out to me directly for feature requests or suggestions.

---

## Final Notes

- Use **Prompt** to iterate on ideas.
- Monitor **Usage** and **Cost** for quotas.
- Protect and manage your **API Keys** diligently.
- For real-time help or advanced usage, visit **Support**.

Happy Prompting!
`;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdownContent}</ReactMarkdown>
    </div>
  );
}

