import { supabase } from '@/lib/supabase';

// GET /api/maintenance - Fetch all maintenance requests
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('maintenance_requests')
      .select(`
        *,
        tenant:tenant_id(id, name, email),
        assigned_to(id, name, email)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return Response.json({
      requests: data,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    console.error('Error fetching maintenance requests:', err);
    return new Response('Failed to fetch maintenance requests', { status: 500 });
  }
}

// POST /api/maintenance - Create new maintenance request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, priority, roomId, tenantId } = body;

    if (!title || !description || !priority || !roomId || !tenantId) {
      return new Response('Missing required fields', { status: 400 });
    }

    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert({
        title,
        description,
        priority,
        room_id: roomId,
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for staff
    await supabase.from('notifications').insert({
      user_id: data.assigned_to || null, // If assigned, notify the assigned staff
      title: 'New Maintenance Request',
      message: `New maintenance request: ${title}`,
      type: 'alert',
      action_url: `/maintenance/${data.id}`,
    });

    return Response.json(data);
  } catch (err) {
    console.error('Error creating maintenance request:', err);
    return new Response('Failed to create maintenance request', { status: 500 });
  }
}

// PUT /api/maintenance/:id - Update maintenance request
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();
    const { status, priority, assignedTo, resolvedAt } = body;

    if (!id) {
      return new Response('Maintenance request ID is required', { status: 400 });
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (assignedTo) updates.assigned_to = assignedTo;
    if (resolvedAt) updates.resolved_at = resolvedAt;

    const { data, error } = await supabase
      .from('maintenance_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create notification for tenant
    if (status === 'complete') {
      await supabase.from('notifications').insert({
        user_id: data.tenant_id,
        title: 'Maintenance Request Completed',
        message: `Your maintenance request "${data.title}" has been completed`,
        type: 'update',
        action_url: `/maintenance/${data.id}`,
      });
    }

    return Response.json(data);
  } catch (err) {
    console.error('Error updating maintenance request:', err);
    return new Response('Failed to update maintenance request', { status: 500 });
  }
}

// PATCH /api/maintenance/:id/assign - Assign maintenance request
export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const { assignedTo } = await request.json();

    if (!id || !assignedTo) {
      return new Response('Missing required fields', { status: 400 });
    }

    const { data, error } = await supabase
      .from('maintenance_requests')
      .update({
        assigned_to: assignedTo,
        status: 'in_progress',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create notification for assigned staff
    await supabase.from('notifications').insert({
      user_id: assignedTo,
      title: 'Maintenance Request Assigned',
      message: `You have been assigned to maintenance request: ${data.title}`,
      type: 'alert',
      action_url: `/maintenance/${data.id}`,
    });

    return Response.json(data);
  } catch (err) {
    console.error('Error assigning maintenance request:', err);
    return new Response('Failed to assign maintenance request', { status: 500 });
  }
}