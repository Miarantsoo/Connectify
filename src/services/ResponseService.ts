export class ResponseService {
    static getJSONTemplate(etat: 'success' | 'error', message: object) {
        if (etat === 'success') {
            return {
                status: 'success',
                data: message,
                error: null,
            };
        } else {
            return {
                status: 'error',
                data: null,
                error: message,
            };
        }
    }
}