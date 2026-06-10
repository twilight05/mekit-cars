export interface Settings {
  company_name: string;
  location: string;
  whatsapp_number: string;
  tagline: string;
  email: string;
  phone: string;
  hero_text: string;
  about_text: string;
}

export interface Car {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  body_type: string;
  price: number;
  description: string;
  status: "available" | "sold";
  images: string[];
  mileage?: number | null;
  fuel?: string | null;
  transmission?: string | null;
}

export interface FilterMeta {
  makes: string[];
  bodyTypes: string[];
  years: number[];
  min_price: number;
  max_price: number;
  total: number;
  available: number;
}
