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
  attachments?: Array<{
    id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    created_at: string;
  }>;
}

export interface CommunicationFormData {
  customer_id: string;
  content: string;
  communication_time?: string;
  attachments?: File[];
} 