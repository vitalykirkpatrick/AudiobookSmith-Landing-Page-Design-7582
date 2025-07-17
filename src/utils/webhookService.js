// Webhook service for sending data to audiobooksmith.app
class WebhookService {
  constructor() {
    this.baseUrl = 'https://audiobooksmith.app/api/webhooks';
    this.fallbackUrl = 'https://webhook.site/your-webhook-id'; // For testing
  }

  async sendWebhook(event, data, retries = 3) {
    const webhookData = {
      event,
      data,
      timestamp: new Date().toISOString(),
      source: 'audiobooksmith.com'
    };

    // Get active webhooks from database
    try {
      const { data: webhooks } = await database.select('webhooks', {
        active: true
      });

      for (const webhook of webhooks || []) {
        if (webhook.events && webhook.events.includes(event)) {
          await this.sendToWebhook(webhook, webhookData, retries);
        }
      }
    } catch (error) {
      console.error('Error getting webhooks:', error);
      // Fallback: send to default webhook
      await this.sendToDefaultWebhook(webhookData, retries);
    }
  }

  async sendToWebhook(webhook, data, retries) {
    let attempt = 0;
    
    while (attempt < retries) {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'User-Agent': 'AudiobookSmith-Webhook/1.0'
        };

        // Add signature if secret is provided
        if (webhook.secret) {
          const signature = await this.generateSignature(JSON.stringify(data), webhook.secret);
          headers['X-AudiobookSmith-Signature'] = signature;
        }

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        });

        // Log webhook attempt
        await this.logWebhookAttempt(webhook, data, response.status, response.ok);

        if (response.ok) {
          console.log(`Webhook sent successfully to ${webhook.name}`);
          return;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        attempt++;
        console.error(`Webhook attempt ${attempt} failed for ${webhook.name}:`, error);
        
        if (attempt < retries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        } else {
          // Log final failure
          await this.logWebhookAttempt(webhook, data, 0, false, error.message);
        }
      }
    }
  }

  async sendToDefaultWebhook(data, retries) {
    // Default webhook for audiobooksmith.app
    const defaultWebhook = {
      name: 'AudiobookSmith App',
      url: this.baseUrl,
      secret: process.env.REACT_APP_WEBHOOK_SECRET
    };

    await this.sendToWebhook(defaultWebhook, data, retries);
  }

  async generateSignature(payload, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const hashArray = Array.from(new Uint8Array(signature));
    return 'sha256=' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async logWebhookAttempt(webhook, data, statusCode, success, errorMessage = null) {
    try {
      await database.insert('webhook_logs', {
        webhook_id: webhook.id,
        webhook_name: webhook.name,
        event: data.event,
        status: success ? 'success' : 'failed',
        response_code: statusCode,
        error_message: errorMessage,
        payload_size: JSON.stringify(data).length,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging webhook attempt:', error);
    }
  }
}

// Export service instance
const webhookService = new WebhookService();

export const sendWebhook = (event, data) => {
  return webhookService.sendWebhook(event, data);
};

export default webhookService;