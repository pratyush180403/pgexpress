import { supabase } from '@/lib/supabase';

// GET /api/meals/menu
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const type = url.searchParams.get('type');

    let query = supabase.from('meals').select('*');

    if (date) {
      query = query.contains('available_on', [date]);
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;

    return Response.json(data);
  } catch (err) {
    console.error('Error fetching menu:', err);
    return new Response('Failed to fetch menu', { status: 500 });
  }
}

// POST /api/meals/book
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, mealId, date } = body;

    if (!userId || !mealId || !date) {
      return new Response('Missing required fields', { status: 400 });
    }

    const { data, error } = await supabase
      .from('meal_bookings')
      .insert({
        user_id: userId,
        meal_id: mealId,
        date,
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (err) {
    console.error('Error booking meal:', err);
    return new Response('Failed to book meal', { status: 500 });
  }
}

// PUT /api/meals/preferences
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, dietaryRestrictions, allergies } = body;

    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const { data, error } = await supabase
      .from('meal_preferences')
      .upsert({
        user_id: userId,
        dietary_restrictions: dietaryRestrictions,
        allergies,
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (err) {
    console.error('Error updating preferences:', err);
    return new Response('Failed to update preferences', { status: 500 });
  }
}

// POST /api/meals/feedback
export async function POST_FEEDBACK(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, rating, comments } = body;

    if (!bookingId || !rating) {
      return new Response('Missing required fields', { status: 400 });
    }

    const { data, error } = await supabase
      .from('meal_feedback')
      .insert({
        booking_id: bookingId,
        rating,
        comments,
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (err) {
    console.error('Error submitting feedback:', err);
    return new Response('Failed to submit feedback', { status: 500 });
  }
}