export interface preStow {
  idx: number;
  p_id: string;
  ves_cell: string;
  ctn_group: string;
  ctn_size: number;
  ctn_type: string | null;
  ctn_height: string;
  ctn_status: string;
  pod: string;
  ctn_spec_flag: string | null;
  pre_weight: number | null;
  weight_class: string | null;
  if_over: string | null;
  if_ref: string | null;
  bz: string | null;
  if_stow: string | null;
  cell_work_bay: string;
  slot_seq: number | null;
  block_num: string | null;
  pure_need: string | null;
  ctn_group2: string | null;
  if_dj: string;
  class_need: string | null;
  min_weight_of_tier: number | null;
  max_weight_of_tier: number | null;
  if_bottom: string | null;
  min_weight_of_cell: number | null;
  max_weight_of_cell: number | null;
  min_weight_limit: number | null;
  max_weight_limit: number | null;
  min_weight_0dc: number | null;
  max_weight_0dc: number | null;
  min_weight_shaodai: number | null;
  max_weight_shaodai: number | null;
  head_end: string | null;
  tier123: string | null;
  if_allow_gphf: string | null;
  tier_idx: number;
  col_seq: number;
  ctid: string;
}
//pid的interface
export interface pIdList {
  p_id: string;
  count: number;
}
export interface ctnGroupList {
  ctn_group: string;
}

