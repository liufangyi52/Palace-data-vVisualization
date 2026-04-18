export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.statusCode = 400;
  }
}

const validate = {
  required(value, fieldName) {
    if (value === undefined || value === null || value === "") {
      throw new ValidationError(`${fieldName}不能为空`, fieldName);
    }
  },

  number(value, fieldName) {
    if (value !== undefined && value !== null && isNaN(Number(value))) {
      throw new ValidationError(`${fieldName}必须是数字`, fieldName);
    }
  },

  integer(value, fieldName) {
    if (value !== undefined && value !== null) {
      const num = Number(value);
      if (isNaN(num) || !Number.isInteger(num)) {
        throw new ValidationError(`${fieldName}必须是整数`, fieldName);
      }
    }
  },

  positive(value, fieldName) {
    if (value !== undefined && value !== null && Number(value) <= 0) {
      throw new ValidationError(`${fieldName}必须是正数`, fieldName);
    }
  },

  min(value, fieldName, min) {
    if (value !== undefined && value !== null && Number(value) < min) {
      throw new ValidationError(`${fieldName}不能小于${min}`, fieldName);
    }
  },

  max(value, fieldName, max) {
    if (value !== undefined && value !== null && Number(value) > max) {
      throw new ValidationError(`${fieldName}不能大于${max}`, fieldName);
    }
  },

  string(value, fieldName) {
    if (value !== undefined && value !== null && typeof value !== "string") {
      throw new ValidationError(`${fieldName}必须是字符串`, fieldName);
    }
  },

  email(value, fieldName) {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new ValidationError(`${fieldName}格式不正确`, fieldName);
    }
  },

  enum(value, fieldName, enumValues) {
    if (value !== undefined && !enumValues.includes(value)) {
      throw new ValidationError(
        `${fieldName}必须是${enumValues.join("、")}之一`,
        fieldName
      );
    }
  },

  array(value, fieldName) {
    if (value !== undefined && !Array.isArray(value)) {
      throw new ValidationError(`${fieldName}必须是数组`, fieldName);
    }
  },

  length(value, fieldName, min, max) {
    if (value !== undefined && value !== null) {
      const len = String(value).length;
      if (min !== undefined && len < min) {
        throw new ValidationError(`${fieldName}长度不能小于${min}`, fieldName);
      }
      if (max !== undefined && len > max) {
        throw new ValidationError(`${fieldName}长度不能大于${max}`, fieldName);
      }
    }
  },

  palaceQuery(query) {
    const errors = [];

    if (query.limit !== undefined) {
      const limit = parseInt(query.limit);
      if (isNaN(limit) || limit < 1 || limit > 100) {
        errors.push("limit参数必须在1-100之间");
      }
    }

    if (query.offset !== undefined) {
      const offset = parseInt(query.offset);
      if (isNaN(offset) || offset < 0) {
        errors.push("offset参数必须为非负整数");
      }
    }

    if (query.id !== undefined) {
      const id = parseInt(query.id);
      if (isNaN(id) || id < 1) {
        errors.push("id参数必须是正整数");
      }
    }

    return errors;
  },

  palaceId(id) {
    const numId = parseInt(id);
    if (isNaN(numId) || numId < 1) {
      throw new ValidationError("无效的宫殿ID", "id");
    }
    return numId;
  }
};

export { validate };

export function validatePalaceQuery(query) {
  return validate.palaceQuery(query);
}

export function validatePalaceId(id) {
  return validate.palaceId(id);
}

export default {
  validate,
  ValidationError,
  validatePalaceQuery,
  validatePalaceId
};