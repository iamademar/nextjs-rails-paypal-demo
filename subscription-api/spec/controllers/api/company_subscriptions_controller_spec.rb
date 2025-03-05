require 'rails_helper'

RSpec.describe Api::CompanySubscriptionsController, type: :controller do
  describe 'POST #create' do
    let(:valid_attributes) do
      {
        subscription: {
          paypal_subscription_id: "S-#{Faker::Alphanumeric.alphanumeric(number: 15).upcase}",
          plan_id: "P-#{Faker::Alphanumeric.alphanumeric(number: 10).upcase}",
          description: "Premium Plan",
          status: "ACTIVE",
          quantity: 1,
          amount: 99.99,
          payment_date: Date.today
        }
      }
    end

    let(:invalid_attributes) do
      {
        subscription: {
          paypal_subscription_id: "",
          plan_id: "",
          description: "",
          status: "",
          quantity: 0,
          amount: -10
        }
      }
    end

    context 'with valid parameters' do
      it 'creates a new Subscription' do
        expect {
          post :create, params: valid_attributes
        }.to change(Subscription, :count).by(1)
      end

      it 'renders a JSON response with the new subscription' do
        post :create, params: valid_attributes
        expect(response).to have_http_status(:created)
        expect(response.content_type).to include('application/json')
        
        json_response = JSON.parse(response.body)
        expect(json_response['subscription']['paypal_subscription_id']).to eq(valid_attributes[:subscription][:paypal_subscription_id])
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new Subscription' do
        expect {
          post :create, params: invalid_attributes
        }.to change(Subscription, :count).by(0)
      end
      
      it 'renders a JSON response with errors for the new subscription' do
        post :create, params: invalid_attributes
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to include('application/json')
      end
    end
  end
end 