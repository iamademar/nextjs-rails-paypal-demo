class Subscription < ApplicationRecord
  has_many :payments, dependent: :destroy
  
  validates :paypal_subscription_id, presence: true, uniqueness: true
  validates :plan_id, presence: true
  validates :description, presence: true
  validates :status, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :quantity, presence: true, numericality: { greater_than: 0 }

  after_create :sync_paypal_subscription_details
  after_create :schedule_payment_sync

  private

    def sync_paypal_subscription_details
      SyncPaypalSubscriptionDetailsJob.perform_later(id) if paypal_subscription_id.present?
    end

    def schedule_payment_sync
      SyncPaypalSubscriptionPaymentsJob.set(wait: 1.minute).perform_later(id) if paypal_subscription_id.present?
    end
end 