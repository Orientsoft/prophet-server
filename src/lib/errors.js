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
    TASK_IN_FLOW: { code: 40500, message: '任务已经加入流程' },

    FLOW_NOT_FOUND: { code: 50100, message: '找不到流程' },
    FLOW_NAME_EXISTED: { code: 50200, message: '流程名称已经被占用' },

    TRIGGER_NOT_FOUND: { code: 60100, message: '找不到触发器' },
    UNKNOWN_TRIGGER_TYPE: { code: 60200, message: '未知的触发器类型' },

    DATA_NOT_INSERTED: { code: 70100, message: '保存数据失败' },
    DATA_NOT_FOUND: { code: 70200, message: '找不到数据' },

    HOST_NOT_INSERTED: { code: 80100, message: '保存主机失败' },
    HOST_NOT_FOUND: { code: 80200, message: '找不到主机' },
    HOSTNAME_EXISTED: { code: 80300, message: '主机名存在' },
    HOST_IP_EXISTED: { code: 80400, message: '主机IP存在' },

    ALERT_NOT_INSERTED: { code: 90100, message: '保存告警失败' },
    ALERT_NOT_FOUND: { code: 90200, message: '找不到告警' },
    ALERT_NAME_EXISTED: { code: 90400, message: '告警ES Index存在' },
};

export default errors;
