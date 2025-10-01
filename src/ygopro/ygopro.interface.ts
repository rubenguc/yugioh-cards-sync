export interface DBVersion {
  database_version: string;
  last_update: string;
}

export interface CardParams {
  num: string;
  offset: string;
}

export interface CardInfoResponse {
  data: Card[];
}

export interface Card {
  id: number;
  name: string;
  typeline?: string[] | null;
  type: string;
  humanReadableCardType: string;
  frameType: string;
  desc: string;
  race?: string | null;
  atk?: number | null;
  def?: number | null;
  level?: number | null;
  attribute?: string | null;
  archetype?: string | null;
  ygoprodeck_url: string;
  card_images: CardImage[];
  card_sets?: CardSet[] | null;
  linkval?: number | null;
  linkmarkers?: string[] | null;
  scale?: number | null;
  banlist_info?: BanlistInfo | null;
  beta_name?: string | null;
  treated_as?: string | null;
  tcg_date?: string | null;
  ocg_date?: string | null;
  konami_id?: number | null;
  md_rarity?: string | null;
  has_effect?: boolean | null;
}

export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
  set_edition?: string;
  set_url?: string;
}

export interface BanlistInfo {
  ban_tcg?: string | null;
  ban_ocg?: string | null;
  ban_goat?: string | null;
}
