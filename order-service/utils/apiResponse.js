/**
 * Standard API response format
 */
class ApiResponse {
  /**
   * Success response
   * @param {object} res - Express response object
   * @param {string} message - Success message
   * @param {*} data - Response data
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  /**
   * Error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {*} errors - Error details
   * @param {number} statusCode - HTTP status code (default: 400)
   */
  static error(res, message, errors = null, statusCode = 400) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      errors
    });
  }
}

module.exports = ApiResponse;