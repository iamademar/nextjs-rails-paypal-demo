class PaymentReceiptService
  require 'prawn'
  
  def initialize(payment)
    @payment = payment
    @subscription = payment.subscription
  end
  
  def generate_pdf
    pdf = Prawn::Document.new
    
    # Add company logo if available
    # pdf.image "#{Rails.root}/app/assets/images/logo.png", width: 150, position: :center
    
    # Receipt header
    pdf.font_size(20) { pdf.text "RECEIPT", align: :center }
    pdf.move_down 20
    
    # Receipt ID and Date
    pdf.text "Receipt ID: #{@payment.receipt_id || "RECEIPT-#{@payment.id}-#{Time.now.to_i}"}"
    pdf.text "Date: #{@payment.payment_date&.strftime('%B %d, %Y')}"
    
    pdf.move_down 20
    
    # Customer information
    pdf.text "Customer Information", style: :bold
    if @payment.respond_to?(:payer_name) && @payment.payer_name.present?
      pdf.text "Name: #{@payment.payer_name}"
    end
    if @payment.respond_to?(:payer_email) && @payment.payer_email.present?
      pdf.text "Email: #{@payment.payer_email}"
    end
    pdf.move_down 20
    
    # Subscription information
    pdf.text "Subscription Information", style: :bold
    pdf.text "Description: #{@subscription.description}"
    pdf.text "Status: #{@subscription.status}"
    pdf.text "Plan ID: #{@subscription.plan_id}"
    pdf.text "PayPal Subscription ID: #{@subscription.paypal_subscription_id}"
    pdf.move_down 20
    
    # Payment details
    pdf.text "Payment Details", style: :bold
    
    # Use appropriate amount fields based on what's available on the payment model
    if @payment.respond_to?(:gross_amount) && @payment.respond_to?(:currency_code)
      pdf.text "Amount: #{format_currency(@payment.gross_amount, @payment.currency_code)}"
      
      if @payment.respond_to?(:fee_amount) && @payment.fee_amount.present?
        pdf.text "Fee: #{format_currency(@payment.fee_amount, @payment.currency_code)}"
      end
      
      if @payment.respond_to?(:net_amount) && @payment.net_amount.present?
        pdf.text "Net Amount: #{format_currency(@payment.net_amount, @payment.currency_code)}"
      end
    else
      pdf.text "Amount: #{format_currency(@payment.amount)}"
    end
    
    if @payment.respond_to?(:paypal_payment_id) && @payment.paypal_payment_id.present?
      pdf.text "PayPal Payment ID: #{@payment.paypal_payment_id}"
    end
    
    pdf.text "Status: #{@payment.status}"
    pdf.move_down 20
    
    # Footer
    pdf.text "Thank you for your business!", align: :center
    pdf.text "This receipt was automatically generated.", align: :center, size: 8
    
    # Return the PDF as a string
    pdf.render
  end
  
  private
  
  def format_currency(amount, currency_code = 'USD')
    symbol = currency_symbol(currency_code)
    "#{symbol}#{sprintf('%.2f', amount)}"
  end
  
  def currency_symbol(currency_code)
    case currency_code.to_s.upcase
    when 'USD'
      '$'
    when 'EUR'
      '€'
    when 'GBP'
      '£'
    when 'JPY'
      '¥'
    else
      currency_code + ' '
    end
  end
end 