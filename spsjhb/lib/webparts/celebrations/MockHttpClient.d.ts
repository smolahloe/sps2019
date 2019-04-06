import { ICelebration } from './ICelebrationsLists';
export default class MockHttpClient {
    private static _items;
    static get(restUrl: string, options?: any): Promise<ICelebration[]>;
}
