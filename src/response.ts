import { TLSSocket } from 'tls'

export enum StatusCode {
  // Input
  Input = '10',
  SensitiveInput = '11',

  // Success
  Success = '20',

  // Redirect
  RedirectTemporary = '30',
  RedirectPermanent = '31',

  // Temporary failure
  TemporaryFailure = '40',
  ServerUnavailable = '41',
  CGIError = '42',
  ProxyError = '43',
  SlowDown = '44',

  // Permanent failure
  PermanentFailure = '50',
  NotFound = '51',
  Gone = '52',
  ProxyRequestRefused = '53',
  BadRequest = '59',

  // Authorization
  ClientCertificateRequired = '60',
  CertificateNotAuthorised = '61',
  CertificateNotValid = '62',
}

interface OptionalResponseParameters {
  meta?: string
  body?: string
}

export const respond = (
  socket: TLSSocket,
  statusCode: StatusCode,
  { meta = '', body = '' }: OptionalResponseParameters,
) => {
  socket.write(`${statusCode} ${meta}\r\n${body}`)
  socket.end()
}

const _input = (socket: TLSSocket, statusCode: StatusCode, prompt: string) =>
  respond(socket, statusCode, { meta: prompt })

export const input = (socket: TLSSocket, prompt: string) =>
  _input(socket, StatusCode.Input, prompt)

export const sensitiveInput = (socket: TLSSocket, prompt: string) =>
  _input(socket, StatusCode.SensitiveInput, prompt)

export const success = (socket: TLSSocket, content: string, mimeType = '') =>
  respond(socket, StatusCode.Success, {
    meta: mimeType,
    body: content,
  })

const _redirect = (socket: TLSSocket, statusCode: StatusCode, url: string) =>
  respond(socket, statusCode, {
    meta: url,
  })

export const redirectTemporary = (socket: TLSSocket, url: string) =>
  _redirect(socket, StatusCode.RedirectTemporary, url)

export const redirectPermanent = (socket: TLSSocket, url: string) =>
  _redirect(socket, StatusCode.RedirectPermanent, url)

const _temporaryFailure = (
  socket: TLSSocket,
  statusCode: StatusCode,
  message = '',
) =>
  respond(socket, statusCode, {
    meta: message,
  })

export const temporaryFailure = (socket: TLSSocket, message = '') =>
  _temporaryFailure(socket, StatusCode.TemporaryFailure, message)

export const serverUnavailable = (socket: TLSSocket, message = '') =>
  _temporaryFailure(socket, StatusCode.ServerUnavailable, message)

export const cgiError = (socket: TLSSocket, message = '') =>
  _temporaryFailure(socket, StatusCode.CGIError, message)

export const proxyError = (socket: TLSSocket, message = '') =>
  _temporaryFailure(socket, StatusCode.ProxyError, message)

export const slowDown = (socket: TLSSocket, message = '') =>
  _temporaryFailure(socket, StatusCode.SlowDown, message)

const _permanentFailure = (
  socket: TLSSocket,
  statusCode: StatusCode,
  message = '',
) =>
  respond(socket, statusCode, {
    meta: message,
  })

export const permanentFailure = (socket: TLSSocket, message = '') =>
  _permanentFailure(socket, StatusCode.PermanentFailure, message)

export const notFound = (socket: TLSSocket, message = '') =>
  _permanentFailure(socket, StatusCode.NotFound, message)

export const gone = (socket: TLSSocket, message = '') =>
  _permanentFailure(socket, StatusCode.Gone, message)

export const proxyRequestRefused = (socket: TLSSocket, message = '') =>
  _permanentFailure(socket, StatusCode.ProxyRequestRefused, message)

export const badRequest = (socket: TLSSocket, message = '') =>
  _permanentFailure(socket, StatusCode.BadRequest, message)

const _clientCertificateRequired = (
  socket: TLSSocket,
  statusCode: StatusCode,
  message = '',
) =>
  respond(socket, statusCode, {
    meta: message,
  })

export const clientCertificateRequired = (socket: TLSSocket, message = '') =>
  _clientCertificateRequired(
    socket,
    StatusCode.ClientCertificateRequired,
    message,
  )

export const certificateNotAuthorised = (socket: TLSSocket, message = '') =>
  _clientCertificateRequired(
    socket,
    StatusCode.CertificateNotAuthorised,
    message,
  )

export const certificateNotValid = (socket: TLSSocket, message = '') =>
  _clientCertificateRequired(socket, StatusCode.CertificateNotValid, message)
