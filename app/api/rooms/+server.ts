import { supabase } from '@/lib/supabase';

// GET /api/rooms - Fetch all rooms or filter by availability
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('rooms')
      .select('*', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (startDate && endDate) {
      // Exclude rooms with overlapping bookings
      query = query.not('id', 'in',
        supabase
          .from('bookings')
          .select('room_id')
          .gte('start_date', startDate)
          .lte('end_date', endDate)
          .in('status', ['pending', 'approved'])
      );
    }

    const { data, error, count } = await query
      .order('number')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return Response.json({
      rooms: data,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    console.error('Error fetching rooms:', err);
    return new Response('Failed to fetch rooms', { status: 500 });
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, floor, capacity, price, amenities } = body;

    if (!number || !floor || !capacity || !price) {
      return new Response('Missing required fields', { status: 400 });
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert({
        number,
        floor,
        capacity,
        price,
        amenities: amenities || {},
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (err) {
    console.error('Error creating room:', err);
    return new Response('Failed to create room', { status: 500 });
  }
}

// PUT /api/rooms/:id - Update a room
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();
    const { number, floor, capacity, price, status, amenities } = body;

    if (!id) {
      return new Response('Room ID is required', { status: 400 });
    }

    const updates: any = {};
    if (number) updates.number = number;
    if (floor) updates.floor = floor;
    if (capacity) updates.capacity = capacity;
    if (price) updates.price = price;
    if (status) updates.status = status;
    if (amenities) updates.amenities = amenities;

    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (err) {
    console.error('Error updating room:', err);
    return new Response('Failed to update room', { status: 500 });
  }
}

// DELETE /api/rooms/:id - Delete a room
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response('Room ID is required', { status: 400 });
    }

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting room:', err);
    return new Response('Failed to delete room', { status: 500 });
  }
}