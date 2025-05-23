import { supabase } from '@/lib/supabase';

// GET /api/notifications
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const { data, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return Response.json({
      notifications: data,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return new Response('Failed to fetch notifications', { status: 500 });
  }
}

// POST /api/notifications
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title, message, type, actionUrl } = body;

    if (!userId || !title || !message) {
      return new Response('Missing required fields', { status: 400 });
    }

    const { data, error } = await supabase
      .rpc('send_notification', {
        p_user_id: userId,
        p_title: title,
        p_message: message,
        p_type: type || 'alert',
        p_action_url: actionUrl
      });

    if (error) throw error;

    return Response.json(data);
  } catch (err) {
    console.error('Error creating notification:', err);
    return new Response('Failed to create notification', { status: 500 });
  }
}

// PUT /api/notifications/:id
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();
    const { readStatus } = body;

    if (!id) {
      return new Response('Notification ID is required', { status: 400 });
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read_status: readStatus })
      .eq('id', id);

    if (error) throw error;

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('Error updating notification:', err);
    return new Response('Failed to update notification', { status: 500 });
  }
}

// DELETE /api/notifications/:id
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response('Notification ID is required', { status: 400 });
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting notification:', err);
    return new Response('Failed to delete notification', { status: 500 });
  }
}