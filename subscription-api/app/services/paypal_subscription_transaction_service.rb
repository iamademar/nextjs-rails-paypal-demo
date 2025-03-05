class PaypalSubscriptionTransactionService
  # Temporarily disable production API calls
  # PAYPAL_API_URL = Rails.env.production? ? "https://api.paypal.com" : "https://api.sandbox.paypal.com"
  PAYPAL_API_URL = "https://api.sandbox.paypal.com"
  
  def initialize(access_token = nil)
    @access_token = access_token || fetch_access_token
  end

  def get_subscription_transactions(subscription_id, start_time = nil, end_time = nil)
    # Default time range: last 90 days if not specified
    end_time ||= Time.now.utc.iso8601
    start_time ||= (Time.now - 90.days).utc.iso8601
    
    Rails.logger.info "Fetching transactions for subscription #{subscription_id} from #{start_time} to #{end_time}"

    response = HTTP
      .headers(
        "Authorization" => "Bearer #{@access_token}",
        "Content-Type" => "application/json",
        "Accept" => "application/json"
      )
      .get(
        "#{PAYPAL_API_URL}/v1/billing/subscriptions/#{subscription_id}/transactions",
        params: {
          start_time: start_time,
          end_time: end_time
        }
      )

    unless response.status.success?
      Rails.logger.error("Failed to fetch subscription transactions: #{response.body}")
      raise PaypalJob::PaypalError.new("Failed to fetch subscription transactions: #{response.body}")
    end

    Rails.logger.info("Subscription transactions fetched successfully")
    parsed_response = JSON.parse(response.body)
    Rails.logger.info("--------------------------------")
    Rails.logger.info("Parsed response: #{parsed_response.inspect}")
    Rails.logger.info("--------------------------------")
    parsed_response["transactions"] || []
  end

  private

    def fetch_access_token
      client_id = Rails.application.credentials.paypal_client_id
      client_secret = Rails.application.credentials.paypal_client_secret
      
      if client_id.blank? || client_secret.blank?
        raise PaypalJob::PaypalError.new("PayPal credentials not configured")
      end
      
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
        raise PaypalJob::PaypalError.new("Failed to fetch access token: #{response.body}")
      end
      JSON.parse(response.body)["access_token"]
    end
end