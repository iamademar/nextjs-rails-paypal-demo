class PaypalJob < ApplicationJob
  queue_as :paypal
  
  # Add common PayPal job functionality here
  # This provides a place to add common error handling, retry logic, etc.
  
  class PaypalError < StandardError; end
end 