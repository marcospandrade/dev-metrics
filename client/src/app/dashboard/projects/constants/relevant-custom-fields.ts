import { AtlassianCustomField } from '@/services/projects/dto/get-all-custom-fields.dto';

export interface RelevantCustomFieldMap {
  Sprint: AtlassianCustomField;
  'Story Point': AtlassianCustomField;
}

export const RELEVANT_CUSTOM_FIELDS: RelevantCustomFieldMap = {
  Sprint: {} as AtlassianCustomField,
  'Story Point': {} as AtlassianCustomField,
};
