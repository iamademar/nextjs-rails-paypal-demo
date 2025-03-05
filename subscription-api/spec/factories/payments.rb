FactoryBot.define do
  factory :payment do
    association :subscription
    
    paypal_payment_id { "P-#{Faker::Alphanumeric.alphanumeric(number: 15).upcase}" }
    status { ["COMPLETED", "PENDING", "FAILED"].sample }
    payment_date { Faker::Date.between(from: 3.months.ago, to: Date.today) }
    gross_amount { Faker::Number.decimal(l_digits: 2, r_digits: 2) }
    currency_code { "USD" }
    
    trait :completed do
      status { "COMPLETED" }
    end
    
    trait :pending do
      status { "PENDING" }
    end
    
    trait :failed do
      status { "FAILED" }
    end
    
    trait :with_receipt do
      after(:create) do |payment|
        # This simulates attaching a PDF file as receipt
        # In real tests, you might want to use fixtures or file_fixture
        file = StringIO.new("Test PDF Content")
        file.class.class_eval { attr_accessor :original_filename, :content_type }
        file.original_filename = "receipt-#{payment.id}.pdf"
        file.content_type = "application/pdf"
        payment.receipt_pdf.attach(io: file, filename: "receipt-#{payment.id}.pdf", content_type: "application/pdf")
      end
    end
  end
end 