export type AtlassianCustomField = {
    id: string;
    key: string;
    name: string;
    custom: boolean;
    orderable: boolean;
    navigable: boolean;
    searchable: boolean;
    clauseNames: string[];
    schema?: Schema;
    untranslatedName?: string;
    scope?: Scope;
};

export interface Schema {
    type: string;
    items?: string;
    system?: string;
    custom?: string;
    customId?: number;
    configuration?: Configuration;
}

export interface Configuration {
    'com.atlassian.jira.plugin.system.customfieldtypes:atlassian-team': boolean;
}

export interface Scope {
    type: string;
    project: Project;
}

export interface Project {
    id: string;
}