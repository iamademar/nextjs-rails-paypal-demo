require 'rails_helper'

RSpec.describe Payment, type: :model do
  describe 'associations' do
    it { should belong_to(:subscription) }
    it { should have_one_attached(:receipt_pdf) }
  end

  describe 'validations' do
    it { should validate_presence_of(:status) }
    it { should validate_presence_of(:payment_date) }
  end

  describe 'methods' do
    let(:payment) { create(:payment) }
    let(:payment_with_receipt) { create(:payment, :with_receipt) }

    describe '#generate_receipt' do
      it 'generates a receipt string' do
        expect(payment.generate_receipt).to include("RECEIPT-#{payment.id}")
      end
    end

    describe '#receipt_generated?' do
      it 'returns false when no receipt is attached' do
        expect(payment.receipt_generated?).to be_falsey
      end

      it 'returns true when receipt is attached' do
        expect(payment_with_receipt.receipt_generated?).to be_truthy
      end
    end

    describe '#receipt_url' do
      it 'returns nil when no receipt is attached' do
        expect(payment.receipt_url).to be_nil
      end

      it 'returns a URL when receipt is attached' do
        allow(Rails.application.routes.url_helpers).to receive(:rails_blob_url).and_return('https://example.com/receipt.pdf')
        expect(payment_with_receipt.receipt_url).to eq('https://example.com/receipt.pdf')
      end
    end
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:payment)).to be_valid
    end

    it 'creates a completed payment with the completed trait' do
      payment = create(:payment, :completed)
      expect(payment.status).to eq('COMPLETED')
    end

    it 'creates a pending payment with the pending trait' do
      payment = create(:payment, :pending)
      expect(payment.status).to eq('PENDING')
    end

    it 'creates a failed payment with the failed trait' do
      payment = create(:payment, :failed)
      expect(payment.status).to eq('FAILED')
    end

    it 'attaches a receipt with the with_receipt trait' do
      payment = create(:payment, :with_receipt)
      expect(payment.receipt_pdf).to be_attached
    end
  end
end 