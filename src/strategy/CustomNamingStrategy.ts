import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        if (customName) return customName; // Use custom name if specified
        return propertyName.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
}