export interface SymplaOrder {
  id: string;
  event_id: string;
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

export interface SymplaTicket {
  order_id: string;
  order_status: string;
  ticket_num_qr_code: string;
  checkin: SymplaTicketCheckin;
}

export interface SymplaTicketCheckin {
  checkin_id: number;
  check_in: boolean;
  check_in_date: string | null;
}

export interface SymplaTicketResponse {
  data: SymplaTicket[];
  pagination: { has_next: boolean; has_previous: boolean; next_page: number; previous_page: number };
}
