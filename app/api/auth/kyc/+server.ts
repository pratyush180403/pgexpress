import { supabase } from '@/lib/supabase';

// POST /api/auth/kyc/upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const userId = formData.get('userId') as string;

    if (!file || !type || !userId) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return new Response('File size must be less than 5MB', { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return new Response('Invalid file type', { status: 400 });
    }

    // Upload file to Supabase Storage
    const fileName = `${userId}/${type}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Create document record
    const { data: document, error: documentError } = await supabase
      .from('kyc_documents')
      .insert({
        user_id: userId,
        type,
        file_url: uploadData.path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (documentError) throw documentError;

    return Response.json(document);
  } catch (err) {
    console.error('Error uploading KYC document:', err);
    return new Response('Failed to upload document', { status: 500 });
  }
}

// PUT /api/auth/kyc/verify
export async function PUT(request: Request) {
  try {
    const { documentId, status, rejectionReason } = await request.json();

    if (!documentId || !status) {
      return new Response('Missing required fields', { status: 400 });
    }

    const { data: document, error } = await supabase.rpc(
      'verify_document',
      {
        document_id: documentId,
        verified_by_user_id: request.headers.get('X-User-Id'),
        new_status: status,
        rejection_reason: rejectionReason,
      }
    );

    if (error) throw error;

    return Response.json(document);
  } catch (err) {
    console.error('Error verifying document:', err);
    return new Response('Failed to verify document', { status: 500 });
  }
}