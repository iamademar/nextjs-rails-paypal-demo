class Payment < ApplicationRecord
  belongs_to :subscription
  
  validates :status, presence: true
  validates :payment_date, presence: true
  
  # Add Active Storage attachment for receipt PDF
  has_one_attached :receipt_pdf
  
  def generate_receipt
    # Logic to generate a receipt document would go here
    # This is a placeholder for a more complex implementation
    "RECEIPT-#{id}-#{Time.now.to_i}"
  end
  
  # Check if a receipt has been generated
  def receipt_generated?
    receipt_pdf.attached?
  end
  
  # URL helper for downloading the receipt
  def receipt_url
    Rails.application.routes.url_helpers.rails_blob_url(receipt_pdf) if receipt_generated?
  end

end 