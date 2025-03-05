require 'rails_helper'

RSpec.describe Subscription, type: :model do
  describe 'associations' do
    it { should have_many(:payments).dependent(:destroy) }
  end

  describe 'validations' do
    subject { build(:subscription) }
    
    it { should validate_presence_of(:paypal_subscription_id) }
    it { should validate_uniqueness_of(:paypal_subscription_id) }
    it { should validate_presence_of(:plan_id) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:status) }
    it { should validate_presence_of(:amount) }
    it { should validate_numericality_of(:amount).is_greater_than(0) }
    it { should validate_presence_of(:quantity) }
    it { should validate_numericality_of(:quantity).is_greater_than(0) }
  end

  describe 'callbacks' do
    let(:subscription) { build(:subscription) }

    it 'schedules PayPal subscription details sync after create' do
      expect(SyncPaypalSubscriptionDetailsJob).to receive(:perform_later).with(anything)
      subscription.save
    end

    it 'schedules payment sync after create' do
      expect(SyncPaypalSubscriptionPaymentsJob).to receive(:set).with(wait: 1.minute).and_return(double(perform_later: true))
      subscription.save
    end
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:subscription)).to be_valid
    end

    it 'creates an active subscription with the active trait' do
      subscription = create(:subscription, :active)
      expect(subscription.status).to eq('ACTIVE')
    end

    it 'creates a suspended subscription with the suspended trait' do
      subscription = create(:subscription, :suspended)
      expect(subscription.status).to eq('SUSPENDED')
    end

    it 'creates a cancelled subscription with the cancelled trait' do
      subscription = create(:subscription, :cancelled)
      expect(subscription.status).to eq('CANCELLED')
    end

    it 'creates a subscription with payments using the with_payments trait' do
      subscription = create(:subscription, :with_payments, payments_count: 2)
      expect(subscription.payments.count).to eq(2)
    end
  end
end 