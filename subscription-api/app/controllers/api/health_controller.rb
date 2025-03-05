module Api
  class HealthController < ApplicationController
    def index
      render json: { status: 'ok', message: 'API is up and running' }
    end
  end
end 