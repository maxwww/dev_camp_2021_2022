class UnprocessableEntityException extends Error {
  constructor(errors) {
    super('Malformed input');
    this.name = 'UnprocessableEntityException';
    this.errors = errors;
  }
}

module.exports = UnprocessableEntityException;
