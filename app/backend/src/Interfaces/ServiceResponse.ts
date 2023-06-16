// representa uma mensagem de serviço
export type ServiceMessage = { message: string };

// apresenta os erros
type ServiceResponseErrorType = 'INVALID_DATA'
| 'UNAUTHORIZED' | 'NOT_FOUND' | 'CREATED' | 'SUCCESSFUL';

// resposta do erro
export type ServiceResponseError = {
  status: ServiceResponseErrorType,
  data: ServiceMessage
};

// tipo genérico, que ven a resposta de sucesso
export type ServiceResponseSuccess<T> = {
  status: 'SUCCESSFUL' | 'CREATED',
  data: T
};

export type ServiceResponse<T> = ServiceResponseError | ServiceResponseSuccess<T>;
