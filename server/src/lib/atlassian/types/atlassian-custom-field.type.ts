type SchemaCustomField = {
    type: string;
    custom: string;
    customId: number;
};

export type AtlassianCustomType = {
    id: string;
    name: string;
    schema: SchemaCustomField;
    description: string;
};
