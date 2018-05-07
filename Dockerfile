FROM registry.orientsoft.cn/orientsoft/pynode:latest
MAINTAINER Timothy <yexiaozhou@orientsoft.cn>

ADD dist /propher-server/dist
ADD node_modules /propher-server/node_modules

WORKDIR /propher-server

EXPOSE 9529

CMD ["node", "dist/server"]
#CMD ["/bin/sh", "-c", "while true; do echo hello world; sleep 1; done"]
