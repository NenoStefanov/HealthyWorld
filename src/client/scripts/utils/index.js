import { KeyGenerator } from './key-generator';
import { TemplatesLoader } from './templates-loader';

export class UtilsFactory {
    getAll() {
        return {
            keyGenerator: new KeyGenerator(),
            templatesLoader: new TemplatesLoader()
        };
    }
}