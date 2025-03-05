module Api
  class PaymentsController < ApplicationController
    def index
      payments = Payment.includes(:subscription).order(payment_date: :desc)
      
      render json: payments.as_json(
        include: { subscription: { only: [:description, :status] } },
        methods: [:receipt_id]
      )
    end
  end
end 