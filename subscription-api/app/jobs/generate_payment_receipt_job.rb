class GeneratePaymentReceiptJob < ApplicationJob
  queue_as :default
  
  def perform(payment_id)
    payment = Payment.find_by(id: payment_id)
    return unless payment
    
    Rails.logger.info("Generating receipt for payment #{payment.id}")
    
    # Generate a receipt ID and update the payment record
    receipt_id = payment.generate_receipt
    payment.update(receipt_id: receipt_id)
    
    # Generate PDF receipt using PaymentReceiptService
    begin
      receipt_service = PaymentReceiptService.new(payment)
      pdf_content = receipt_service.generate_pdf
      
      # Attach the PDF to the payment record
      pdf_filename = "receipt-#{receipt_id}.pdf"
      payment.receipt_pdf.attach(
        io: StringIO.new(pdf_content),
        filename: pdf_filename,
        content_type: 'application/pdf'
      )
      
      Rails.logger.info("Successfully generated and attached PDF receipt for payment #{payment.id}")
    rescue StandardError => e
      Rails.logger.error("Error generating PDF receipt: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
    end
    
  rescue StandardError => e
    Rails.logger.error("Error generating receipt: #{e.message}")
    # In a production environment, you'd want proper error handling
    # and possibly retry mechanisms
  end
end 