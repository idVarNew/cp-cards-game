import { HttpErrorResponse } from '@angular/common/http';

export const errorNotFoundMock = {
  error: new HttpErrorResponse({
    error: { message: 'Not Found' },
    status: 404,
  }),
};
