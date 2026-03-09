import type {Component} from 'vue';

export type ClassroomToolboxItem = {
    key: string;
    label: string;
    labelKey?: string;
    icon: Component;
    handler: (event: MouseEvent) => void;
};

