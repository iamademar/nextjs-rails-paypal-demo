class PaypalSubscriptionService
  # Temporarily disable production API calls
  # PAYPAL_API_URL = Rails.env.production? ? "https://api.paypal.com" : "https://api.sandbox.paypal.com"
  PAYPAL_API_URL = "https://api.sandbox.paypal.com"
  def initialize(access_token = nil)
    @access_token = access_token || fetch_access_token
  end

  def update_subscription_quantity(subscription_id, new_quantity)
    Rails.logger.info "Updating subscription #{subscription_id} to quantity #{new_quantity}"

    response = HTTP
      .headers(
        "Authorization" => "Bearer #{@access_token}",
        "Content-Type" => "application/json"
      )
      .post(
        "#{PAYPAL_API_URL}/v1/billing/subscriptions/#{subscription_id}/revise",
        json: {
          quantity: new_quantity.to_s
        }
      )

    unless response.status.success?
      Rails.logger.error("Failed to update subscription quantity: #{response.body}")
      raise PaypalError.new("Failed to update subscription quantity: #{response.body}")
    end

    Rails.logger.info("Subscription quantity updated successfully: #{response.body}")
    response
  end

  def get_subscription_details(subscription_id)
    Rails.logger.info "Fetching subscription details for #{subscription_id}"

    response = HTTP
      .headers(
        "Authorization" => "Bearer #{@access_token}",
        "Content-Type" => "application/json"
      )
      .get("#{PAYPAL_API_URL}/v1/billing/subscriptions/#{subscription_id}")

    unless response.status.success?
      Rails.logger.error("Failed to fetch subscription details: #{response.body}")
      raise PaypalError.new("Failed to fetch subscription details: #{response.body}")
    end

    Rails.logger.info("Subscription details fetched successfully")
    JSON.parse(response.body)
  end

  private

  def fetch_access_token
    client_id = Rails.application.credentials.paypal_client_id
    client_secret = Rails.application.credentials.paypal_client_secret
    auth = Base64.strict_encode64("#{client_id}:#{client_secret}")

    response = HTTP
      .headers(
        "Authorization" => "Basic #{auth}",
        "Content-Type" => "application/x-www-form-urlencoded"
      )
      .post(
        "#{PAYPAL_API_URL}/v1/oauth2/token",
        form: { grant_type: "client_credentials" }
      )

    unless response.status.success?
      raise PaypalError.new("Failed to fetch access token: #{response.body}")
    end
    JSON.parse(response.body)["access_token"]
  end
end

class PaypalError < StandardError; end
