export interface SymplaOrder {
  id: string;
  reference_id: string;
  event_id: string;
  order_date: string;
  order_status: string;
  updated_date: string;
  approved_date: string;
  discount_code: string;
  transaction_type: string;
  order_total_sale_price: number;
  order_total_net_value: number;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  utm: SymplaOrderUtm;
}

export interface SymplaOrderUtm {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  user_agent: string;
  referrer: string;
}
export interface SymplaOrderResponse {
  data: SymplaOrder[];
  pagination: { has_next: boolean; has_previous: boolean; next_page: number; previous_page: number };
}

export interface SymplaParticipant {
  id: string | number;
  reference_id: string | number;
  order_id: string | number;
  order_status: string;
  order_date: string;
  order_updated_date: string;
  order_approved_date: string;
  order_discount: string;
  first_name: string;
  last_name: string;
  email: string;
  ticket_number: string;
  ticket_num_qr_code: string;
  ticket_name: string;
  sector_name: string;
  marked_place_name: string;
  access_information: string;
  pdv_user: string;
  ticket_sale_price: number;
  checkin: SymplaParticipantCheckin;
  ticket_created_at: string;
  ticket_updated_at: string;
  presentation_id: number;
}

export interface SymplaParticipantCheckin {
  checkin_id: number;
  check_in: boolean;
  check_in_date: string | null;
}

export interface SymplaParticipantResponse {
  data: SymplaParticipant[];
  pagination: { has_next: boolean; has_previous: boolean; next_page: number; previous_page: number };
}
