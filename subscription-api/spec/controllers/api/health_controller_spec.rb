require 'rails_helper'

RSpec.describe Api::HealthController, type: :controller do
  describe 'GET #index' do
    before do
      get :index
    end

    it 'returns a successful response' do
      expect(response).to be_successful
    end

    it 'returns JSON with status ok' do
      json_response = JSON.parse(response.body)
      expect(json_response['status']).to eq('ok')
    end

    it 'returns JSON with correct message' do
      json_response = JSON.parse(response.body)
      expect(json_response['message']).to eq('API is up and running')
    end

    it 'returns content type of application/json' do
      expect(response.content_type).to include('application/json')
    end
  end
end 