import { ICelebration } from './ICelebrationsLists';

export default class MockHttpClient {
    private static _items: ICelebration[] = [
       { EmployeeId: "11", CelebrationType: 'Graduation', CelebrationDate: '06 January 2091', EmployeeName: 'Samuel M.' },
    ];
    public static get(restUrl: string, options?: any): Promise<ICelebration[]> {
      return new Promise<ICelebration[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}
