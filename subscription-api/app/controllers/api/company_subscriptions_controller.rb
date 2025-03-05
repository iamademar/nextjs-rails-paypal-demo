module Api
  class CompanySubscriptionsController < ApplicationController
    def create
      # Extract subscription parameters from the request
      subscription_params = params.require(:subscription).permit(
        :paypal_subscription_id, :plan_id, :description, 
        :payment_date, :status, :quantity, :amount
      )
      
      # Create the subscription
      subscription = Subscription.create!(subscription_params)
      
      # Return the subscription data
      render json: { 
        subscription: subscription
      }, status: :created
    end
  end
end 