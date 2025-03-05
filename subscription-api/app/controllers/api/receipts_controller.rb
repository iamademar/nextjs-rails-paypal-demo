module Api
  class ReceiptsController < ApplicationController
    def show
      payment = Payment.find_by!(receipt_id: params[:id])
      
      if payment.receipt_generated?
        # Send the PDF file with appropriate headers for viewing in browser
        send_data payment.receipt_pdf.download,
                  filename: "receipt-#{payment.receipt_id}.pdf",
                  type: 'application/pdf',
                  disposition: 'inline'
      else
        # Fall back to JSON if PDF isn't available
        render json: {
          receipt_id: payment.receipt_id,
          payment_date: payment.payment_date,
          amount: payment.amount,
          subscription_description: payment.subscription.description,
          status: payment.status,
          error: "PDF receipt is being generated. Please try again shortly."
        }
      end
    rescue ActiveStorage::FileNotFoundError
      # Handle case where file reference exists but file is missing
      render json: {
        error: "Receipt file not found. It may still be processing."
      }, status: :not_found
    end
    
    def download
      payment = Payment.find_by!(receipt_id: params[:id])
      
      if payment.receipt_generated?
        # Send the PDF file with appropriate headers for downloading
        send_data payment.receipt_pdf.download,
                  filename: "receipt-#{payment.receipt_id}.pdf",
                  type: 'application/pdf',
                  disposition: 'attachment'
      else
        # Return an error if the PDF isn't available
        render json: {
          error: "Receipt is not available for download. It may still be processing."
        }, status: :not_found
      end
    rescue ActiveStorage::FileNotFoundError
      # Handle case where file reference exists but file is missing
      render json: {
        error: "Receipt file not found. It may have been deleted or is still processing."
      }, status: :not_found
    end
  end
end 