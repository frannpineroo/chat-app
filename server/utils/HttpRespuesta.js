
class HttpResponse {
  constructor(data = null, error = false, statusCode = 200) {
    this.data = data;
    this.error = error;
    this.statusCode = statusCode;
  }

  obtenerError() {
    if (!this.error) {
      return "";
    }

    switch (this.statusCode) {
      case 404:
        return "Recurso no encontrado.";
      case 401:
        return "No está logueado.";
      case 403:
        return "No tiene autorización a ejecutar este proceso.";
      case 400:
        return "No se pudo procesar la información.";
      default:
        return `Error en la llamada HTTP. Código de estado: ${this.statusCode}`;
    }
  }

  toJSON() {
    return {
      data: this.data,
      error: this.error,
      message: this.error ? this.obtenerError() : null
    };
  }
}

module.exports = HttpResponse;