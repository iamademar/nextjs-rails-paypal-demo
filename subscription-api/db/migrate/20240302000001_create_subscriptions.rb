class CreateSubscriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :subscriptions do |t|
      t.string :paypal_subscription_id, null: false, index: { unique: true }
      t.string :plan_id, null: false
      t.string :description, null: false
      t.datetime :payment_date, null: false
      t.string :status, null: false
      t.integer :quantity, null: false, default: 1
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.datetime :next_billing_date
      t.string :paypal_payments_id
      t.string :currency_code
      t.decimal :gross_amount, precision: 10, scale: 2
      t.decimal :fee_amount, precision: 10, scale: 2
      t.decimal :net_amount, precision: 10, scale: 2
      t.string :payer_name
      t.string :payer_email
      t.string :date_paid

      t.timestamps
    end
  end
end 