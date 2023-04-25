module.exports = {
  response: (response, status, message, data, meta) => {
    const result = {};
    result.status = status || 200;
    result.message = message;
    result.data = data;
    result.meta = meta;

    return response.status(result.status).json(result);
  },
  responseErr: (response, message, fields) => {
    const result = {};
    result.status = 400;
    result.message = message;
    result.fields = fields;
    return response.status(result.status).json(result);
  },
};
