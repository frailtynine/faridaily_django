export interface ChartData {
  x_axis: number[];
  y_axis: number[];
}

export interface ViewsData {
  date: number[];
  views: number[];
}

export interface ChannelResponse {
  channel_name: string;
  followers: number;
  growth_graph: ChartData;
  last_refresh: string;
  views_graph: ViewsData;
}

export interface LoginRequest {
  password: string;
  username: string;
}

export interface LoginResponse {
  username: string;
  refresh: string;
  access: string;
}

export interface MessageUpdateRequest {
  text: string;
}

export interface MessageResponse {
  id: number;
  tg_id: number;
  pub_date: string;
  views: number;
  forwards: number;
  reactions: number;
  replies: number;
  post_author: string;
  text: string;
  last_edit: string;
}

export interface DraftCreateRequest {
  text: string;
  pub_date?: string;
}

export interface DraftUpdateRequest extends DraftCreateRequest {
  is_published?: boolean;
}

export interface DraftResponse extends DraftCreateRequest {
  id: number;
}

export interface TemplateCreateRequest {
  title: string;
  text: string;
  position: 'header' | 'footer' | 'middle';
}

export interface TemplateResponse extends TemplateCreateRequest {
  id: number;
}