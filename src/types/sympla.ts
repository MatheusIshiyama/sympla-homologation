export interface SymplaOrder {
  id: string;
  event_id: string;
  sympla_order_id: string;
  order_date: string;
  order_status: string;
  transaction_type: string;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  updated_date: string;
}
export interface SymplaOrderResponse {
  data: SymplaOrder[];
  pagination: { has_next: boolean; has_previous: boolean; next_page: number; previous_page: number };
}

export interface SymplaParticipant {
  id: string | number;
  sympla_participant_id: string | number;
  order_id: string | number;
  order_status: string;
  ticket_num_qr_code: string;
  checkin: SymplaParticipantCheckin;
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
