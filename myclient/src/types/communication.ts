export interface Attachment {
  id: number;
  communication_id: number;
  file_name: string;
  file_type: string;
  file_path: string;
  file_size: number;
  full_url?: string;
  uploaded_at: string;
}

export interface Communication {
  _id?: string;
  id?: number;
  customer_id: number | string;
  user_id: number;
  content: string;
  communication_time: string;
  created_at: string;
  updated_at?: string;
  user_name?: string;
  attachments?: Attachment[];
}

export interface CommunicationFormData {
  customer_id: string;
  content: string;
  communication_time?: string;
  attachments?: File[];
} 