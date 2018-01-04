const errors = {
    // user error codes
    INTERNAL_ERROR: { code: 10000, message: '程序内部错误' },
    TOO_MANY_REQUESTS: { code: 10001, message: '请求过多' },
    UNAUTHORIZED: { code: 10002, message: '请登录' },
    MISSING_REQUEST_FIELDS: { code: 10003, message: '请求所需要的内容缺失', fields: [] },

    USERNAME_UNAVAILABLE: { code: 20001, message: '用户名已被占用' },

    LOGIN_FAILED: { code: 20004, message: '登录失败, 用户名或密码错误' },
    LOGIN_INTERNAL_ERROR: { code: 20005, message: '登录失败, 请稍后再试' },
    WRONG_PASSWORD: { code: 20006, message: '密码错误' }, // 已登录用户，修改密码需要输入原密码
    
    VALIDATION_ERROR: {
        code: 20100, message: '验证错误', model: '', paths: []
    },
    CONSTRAINT_ERROR: {
        code: 20100, message: '约束错误', model: '', paths: []
    },

    PORT_NOT_FOUND: { code: 30100, message: '找不到端口' },
    PORT_NAME_EXISTED: { code: 30200, message: '端口名称已经被占用' },

    TASK_NOT_FOUND: { code: 40100, message: '找不到任务' },
    TASK_NAME_EXISTED: { code: 40200, message: '任务名称已经被占用' },
    TASK_INPUT_NOT_FOUND: { code: 40300, message: '找不到输入端口' },
    TASK_OUTPUT_NOT_FOUND: { code: 40400, message: '找不到输出端口' },

    FLOW_NOT_FOUND: { code: 50100, message: '找不到流程' },
    FLOW_NAME_EXISTED: { code: 50200, message: '流程名称已经被占用' },
};

export default errors;