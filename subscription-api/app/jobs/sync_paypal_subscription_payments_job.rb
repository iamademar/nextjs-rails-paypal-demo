  class SyncPaypalSubscriptionPaymentsJob < PaypalJob
    def perform(subscription_id)
      subscription = Subscription.find_by(id: subscription_id)
      return Rails.logger.error("Could not find subscription #{subscription_id}") unless subscription
      return if subscription.paypal_subscription_id.blank?

      Rails.logger.info("Syncing payments for subscription #{subscription_id}")

      # Get transactions for the subscription
      service = PaypalSubscriptionTransactionService.new
      transactions = service.get_subscription_transactions(subscription.paypal_subscription_id)
      
      transactions.each do |transaction|
        process_transaction(transaction, subscription)
      end

      Rails.logger.info("Completed syncing payments for subscription #{subscription_id}")
    rescue StandardError => e
      Rails.logger.error("Failed to sync subscription payments: #{e.message}")
      Sentry.capture_exception(e) if Rails.env.production?
    end

    private

    def process_transaction(transaction, subscription)
      Rails.logger.info("--------------------------------")
      Rails.logger.info("Processing transaction #{transaction.inspect}")
      Rails.logger.info("--------------------------------")

      # Skip if not a payment transaction
      return unless transaction["status"] == "COMPLETED"
      
      # Extract transaction details
      paypal_payment_id = transaction["id"]
      
      # Skip if payment already exists
      return if Payment.exists?(paypal_payment_id: paypal_payment_id)
      
      # Check if required transaction data exists
      unless transaction["amount_with_breakdown"] && transaction["time"]
        Rails.logger.error("Transaction #{paypal_payment_id} is missing required fields")
        return
      end
      
      # Parse amounts using dig to safely handle nested hashes
      amount_with_breakdown = transaction["amount_with_breakdown"]
      amount_details = amount_with_breakdown["gross_amount"]
      currency_code = amount_details["currency_code"]
      gross_amount = amount_details["value"].to_d
      
      fee_amount = amount_with_breakdown.dig("fee_amount", "value").to_d
      net_amount = amount_with_breakdown.dig("net_amount", "value").to_d
      
      # Parse payer details if available - handling both formats (payer object or direct fields)
      payer_name = ""
      payer_email = ""
      
      if transaction["payer_name"]
        # New API format with direct payer_name field
        payer_name = [
          transaction["payer_name"]["given_name"],
          transaction["payer_name"]["surname"]
        ].compact.join(" ")
        payer_email = transaction["payer_email"].to_s
      elsif transaction["payer"]
        # Old API format with payer object
        if transaction["payer"]["name"]
          payer_name = [
            transaction["payer"]["name"]["given_name"],
            transaction["payer"]["name"]["surname"]
          ].compact.join(" ")
        end
        payer_email = transaction["payer"]["email_address"].to_s if transaction["payer"]["email_address"]
      end
      
      # Parse payment date
      payment_date = Time.zone.parse(transaction["time"])

      # Create payment record
      payment = Payment.create!(
        subscription_id: subscription.id,
        paypal_payment_id: paypal_payment_id,
        currency_code: currency_code, 
        gross_amount: gross_amount,
        fee_amount: fee_amount,
        net_amount: net_amount,
        payer_name: payer_name,
        payer_email: payer_email,
        payment_date: payment_date,
        status: "completed"
      )

      # Generate receipt for the new payment
      GeneratePaymentReceiptJob.perform_later(payment.id)
      
      Rails.logger.info("Created payment record for transaction #{paypal_payment_id}")
    rescue StandardError => e
      Rails.logger.error("Failed to process transaction #{transaction["id"]}: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
    end
  end
