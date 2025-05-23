import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

// POST /api/auth/verify-email
export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return new Response('Email and verification code are required', { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('verification_code, verification_code_expires_at')
      .eq('email', email)
      .single();

    if (userError) throw userError;

    if (!user.verification_code) {
      return new Response('No verification code found', { status: 400 });
    }

    if (new Date() > new Date(user.verification_code_expires_at)) {
      return new Response('Verification code has expired', { status: 400 });
    }

    const hashedCode = createHash('sha256').update(code).digest('hex');
    if (hashedCode !== user.verification_code) {
      return new Response('Invalid verification code', { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_code: null,
        verification_code_expires_at: null,
      })
      .eq('email', email);

    if (updateError) throw updateError;

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error('Error verifying email:', err);
    return new Response('Failed to verify email', { status: 500 });
  }
}

// POST /api/auth/resend-verification
export async function RESEND(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response('Email is required', { status: 400 });
    }

    // Generate new verification code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const hashedCode = createHash('sha256').update(code).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_code: hashedCode,
        verification_code_expires_at: expiresAt.toISOString(),
      })
      .eq('email', email);

    if (updateError) throw updateError;

    // TODO: Send verification email with code
    console.log('Verification code:', code);

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error('Error resending verification code:', err);
    return new Response('Failed to resend verification code', { status: 500 });
  }
}