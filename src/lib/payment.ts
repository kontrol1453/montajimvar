export type PaymentProvider = "mock" | "iyzico" | "paytr" | "stripe";

export interface CreatePaymentInput {
  jobId: number;
  customerId: number;
  artisanId: number;
  amount: number;
  commission: number;
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

export interface PaymentResult {
  success: boolean;
  providerPaymentId?: string;
  providerConvId?: string;
  error?: string;
}

export interface RefundInput {
  providerPaymentId: string;
  amount: number;
}

export interface PaymentProviderInterface {
  name: PaymentProvider;
  charge(input: CreatePaymentInput): Promise<PaymentResult>;
  refund(input: RefundInput): Promise<PaymentResult>;
  validateCard(input: CreatePaymentInput): string | null;
}

class MockProvider implements PaymentProviderInterface {
  name: PaymentProvider = "mock";

  validateCard(input: CreatePaymentInput): string | null {
    if (!input.amount || input.amount <= 0) return "Geçersiz tutar.";
    if (input.amount > 500000) return "Tutar çok yüksek.";
    return null;
  }

  async charge(input: CreatePaymentInput): Promise<PaymentResult> {
    const err = this.validateCard(input);
    if (err) return { success: false, error: err };

    const ok = Math.random() > 0.1;
    if (!ok) return { success: false, error: "Ödeme reddedildi. (mock)" };

    return {
      success: true,
      providerPaymentId: `mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      providerConvId: `MOCK${Math.floor(Math.random() * 1000000)}`,
    };
  }

  async refund(input: RefundInput): Promise<PaymentResult> {
    return { success: true, providerPaymentId: input.providerPaymentId };
  }
}

let currentProvider: PaymentProviderInterface = new MockProvider();

export function setProvider(p: PaymentProviderInterface) {
  currentProvider = p;
}

export function getProvider(): PaymentProviderInterface {
  return currentProvider;
}

export async function createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
  return currentProvider.charge(input);
}

export async function refundPayment(input: RefundInput): Promise<PaymentResult> {
  return currentProvider.refund(input);
}

export function calculateCommission(amount: number, rate = 0.08): number {
  return Math.round(amount * rate);
}
