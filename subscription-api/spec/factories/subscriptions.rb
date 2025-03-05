FactoryBot.define do
  factory :subscription do
    paypal_subscription_id { "S-#{Faker::Alphanumeric.alphanumeric(number: 15).upcase}" }
    plan_id { "P-#{Faker::Alphanumeric.alphanumeric(number: 10).upcase}" }
    status { ["ACTIVE", "SUSPENDED", "CANCELLED"].sample }
    description { Faker::Subscription.plan }
    payment_date { Faker::Date.between(from: 1.year.ago, to: Date.today) }
    next_billing_date { Faker::Date.between(from: Date.today, to: 1.year.from_now) }
    amount { Faker::Number.decimal(l_digits: 2, r_digits: 2) }
    currency_code { "USD" }
    quantity { Faker::Number.between(from: 1, to: 5) }
    
    trait :active do
      status { "ACTIVE" }
    end
    
    trait :suspended do
      status { "SUSPENDED" }
    end
    
    trait :cancelled do
      status { "CANCELLED" }
    end
    
    trait :with_payments do
      transient do
        payments_count { 3 }
      end
      
      after(:create) do |subscription, evaluator|
        create_list(:payment, evaluator.payments_count, subscription: subscription)
      end
    end
  end
end 