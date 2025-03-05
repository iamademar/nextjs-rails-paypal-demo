require 'rails_helper'

RSpec.describe Api::PaymentsController, type: :controller do
  describe 'GET #index' do
    let!(:subscription) { create(:subscription) }
    let!(:payment1) { create(:payment, subscription: subscription, payment_date: 1.day.ago) }
    let!(:payment2) { create(:payment, subscription: subscription, payment_date: 2.days.ago) }
    let!(:payment3) { create(:payment, subscription: subscription, payment_date: Time.current) }

    before do
      get :index
    end

    it 'returns a successful response' do
      expect(response).to be_successful
    end

    it 'returns all payments ordered by payment_date desc' do
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(3)
      
      # Check that payments are sorted by payment_date desc
      expect(Date.parse(json_response[0]['payment_date'])).to be >= Date.parse(json_response[1]['payment_date'])
      expect(Date.parse(json_response[1]['payment_date'])).to be >= Date.parse(json_response[2]['payment_date'])
    end

    it 'includes subscription information' do
      json_response = JSON.parse(response.body)
      expect(json_response[0]['subscription']).to be_present
      expect(json_response[0]['subscription']['description']).to eq(subscription.description)
      expect(json_response[0]['subscription']['status']).to eq(subscription.status)
    end

    it 'includes receipt_id method' do
      json_response = JSON.parse(response.body)
      expect(json_response[0]).to have_key('receipt_id')
    end

    it 'returns content type of application/json' do
      expect(response.content_type).to include('application/json')
    end
  end
end 