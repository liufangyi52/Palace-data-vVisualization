export const success = (res, data = null, message = "success") => {
  return res.json({
    code: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const created = (res, data = null, message = "创建成功") => {
  return res.status(201).json({
    code: 201,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const noContent = (res) => {
  return res.status(204).send();
};

export const error = (res, message = "服务器内部错误", code = 500) => {
  return res.status(code).json({
    code,
    message,
    timestamp: new Date().toISOString(),
  });
};

export const notFound = (res, message = "资源不存在") => {
  return res.status(404).json({
    code: 404,
    message,
    timestamp: new Date().toISOString(),
  });
};

export const unauthorized = (res, message = "未授权") => {
  return res.status(401).json({
    code: 401,
    message,
    timestamp: new Date().toISOString(),
  });
};

export const forbidden = (res, message = "禁止访问") => {
  return res.status(403).json({
    code: 403,
    message,
    timestamp: new Date().toISOString(),
  });
};

export const badRequest = (res, message = "请求参数错误") => {
  return res.status(400).json({
    code: 400,
    message,
    timestamp: new Date().toISOString(),
  });
};

export const paginated = (res, data, pagination, message = "success") => {
  return res.json({
    code: 200,
    message,
    data,
    pagination: {
      total: pagination.total || 0,
      page: pagination.page || 1,
      pageSize: pagination.pageSize || 10,
      totalPages: pagination.totalPages || 1,
    },
    timestamp: new Date().toISOString(),
  });
};

export default {
  success,
  created,
  noContent,
  error,
  notFound,
  unauthorized,
  forbidden,
  badRequest,
  paginated,
};
