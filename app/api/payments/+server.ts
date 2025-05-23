import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// POST /api/payments/setup-intent
// Create a SetupIntent for saving a payment method
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: userId, // Assuming userId is also the Stripe customer ID
      payment_method_types: ['card'],
    });

    return Response.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error('Error creating setup intent:', err);
    return new Response('Failed to create setup intent', { status: 500 });
  }
}

// POST /api/payments/process-payment
// Process a payment using a saved payment method
export async function PROCESS_PAYMENT(request: Request) {
  try {
    const { userId, amount, paymentMethodId, description } = await request.json();

    if (!userId || !amount || !paymentMethodId) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: userId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      description,
    });

    // Record transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed',
        payment_method_id: paymentMethodId,
        stripe_payment_intent_id: paymentIntent.id,
        description,
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    return Response.json(transaction);
  } catch (err) {
    console.error('Error processing payment:', err);
    return new Response('Failed to process payment', { status: 500 });
  }
}

// POST /api/payments/refund
// Process a refund for a transaction
export async function PROCESS_REFUND(request: Request) {
  try {
    const { transactionId, amount, reason } = await request.json();

    if (!transactionId || !amount || !reason) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Get transaction details
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('stripe_payment_intent_id')
      .eq('id', transactionId)
      .single();

    if (transactionError) throw transactionError;

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: transaction.stripe_payment_intent_id,
      amount: Math.round(amount * 100), // Convert to cents
    });

    // Record refund
    const { data: refundRecord, error: refundError } = await supabase
      .from('refunds')
      .insert({
        transaction_id: transactionId,
        amount,
        reason,
        status: refund.status === 'succeeded' ? 'completed' : 'pending',
        stripe_refund_id: refund.id,
      })
      .select()
      .single();

    if (refundError) throw refundError;

    return Response.json(refundRecord);
  } catch (err) {
    console.error('Error processing refund:', err);
    return new Response('Failed to process refund', { status: 500 });
  }
}

// GET /api/payments/history
// Get payment history for a user
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const { data, error, count } = await supabase
      .from('transactions')
      .select(`
        *,
        payment_methods (
          card_last4,
          card_brand
        ),
        refunds (*)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return Response.json({
      transactions: data,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    console.error('Error fetching payment history:', err);
    return new Response('Failed to fetch payment history', { status: 500 });
  }
}

// GET /api/payments/receipt
// Generate a receipt for a transaction
export async function GENERATE_RECEIPT(request: Request) {
  try {
    const url = new URL(request.url);
    const transactionId = url.searchParams.get('transactionId');

    if (!transactionId) {
      return new Response('Transaction ID is required', { status: 400 });
    }

    const { data: transaction, error } = await supabase
      .from('transactions')
      .select(`
        *,
        users (
          name,
          email
        ),
        payment_methods (
          card_last4,
          card_brand
        )
      `)
      .eq('id', transactionId)
      .single();

    if (error) throw error;

    // Generate receipt HTML
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Add receipt styling here */
          </style>
        </head>
        <body>
          <h1>Receipt</h1>
          <p>Transaction ID: ${transaction.id}</p>
          <p>Date: ${new Date(transaction.created_at).toLocaleDateString()}</p>
          <p>Amount: $${transaction.amount}</p>
          <p>Status: ${transaction.status}</p>
          <!-- Add more receipt details -->
        </body>
      </html>
    `;

    return new Response(receiptHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (err) {
    console.error('Error generating receipt:', err);
    return new Response('Failed to generate receipt', { status: 500 });
  }
}