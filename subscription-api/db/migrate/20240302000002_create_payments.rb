class CreatePayments < ActiveRecord::Migration[7.1]
  def change
    create_table :payments do |t|
      t.references :subscription, null: false, foreign_key: true
      t.string :status, null: false
      t.datetime :payment_date, null: false
      t.string :receipt_id
      t.string :paypal_payment_id
      t.string :currency_code
      t.decimal :gross_amount, precision: 10, scale: 2
      t.decimal :fee_amount, precision: 10, scale: 2
      t.decimal :net_amount, precision: 10, scale: 2
      t.string :payer_name
      t.string :payer_email

      t.timestamps
    end
  end
end 