class ApiResponse {
  constructor(success, code, data, message, error) {
    this.success = success;
    this.code = code;
    this.data = data;
    this.message = message;
    this.error = error;
  }
}

module.exports = ApiResponse;
