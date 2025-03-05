class SyncPaypalSubscriptionDetailsJob < PaypalJob
  def perform(subscription_id)
    subscription = Subscription.find_by(id: subscription_id)
    return Rails.logger.error("Could not find subscription #{subscription_id}") unless subscription
    return if subscription.paypal_subscription_id.blank?

    paypal_service = PaypalSubscriptionService.new
    subscription_details = paypal_service.get_subscription_details(subscription.paypal_subscription_id)
    Rails.logger.info("Subscription details: #{subscription_details.inspect}")

    subscription.update(
      status: subscription_details["status"].downcase,
      plan_id: subscription_details["plan_id"],
      payer_email: subscription_details.dig("subscriber", "email_address"),
      payer_name: [
        subscription_details.dig("subscriber", "name", "given_name"),
        subscription_details.dig("subscriber", "name", "surname")
      ].compact.join(" "),
      next_billing_date: Time.zone.parse(subscription_details.dig("billing_info", "next_billing_time")),
      quantity: subscription_details["quantity"].to_i,
      date_paid: subscription_details.dig("billing_info", "last_payment", "time"),
      amount: subscription_details.dig("billing_info", "last_payment", "amount", "value").to_f
    )

  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error("Could not find subscription #{subscription_id}: #{e.message}")
  rescue PaypalError => e
    Rails.logger.error("Failed to sync PayPal subscription details: #{e.message}")
  end
end 