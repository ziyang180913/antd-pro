import { message, notification } from 'antd';
import cookie from 'react-cookies';
import type { RequestConfig } from 'umi';
import { LOGIN_PATH } from './utils';

const httpErrorMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 服务器请求错误状态处理
const errorHandler = (error: any) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = httpErrorMessage[response.status] || response.statusText;
    notification.error({
      message: '错误提示!',
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器!',
      message: '网络异常!',
    });
  }
  return response;
};

const request: RequestConfig = {
  timeout: 1000 * 20,
  // other axios options you want
  errorConfig: {
    // 错误抛出
    errorThrower: (res: any) => {
      console.log('>>>>>>>>', res);
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler,
  },
  requestInterceptors: [
    // 请求拦截器，接收数组，可设置多个拦截器
    (options) => {
      const token = cookie.load('Authorization');
      return {
        ...options,
        headers: {
          ...(options?.headers ?? {}),
          Authorization: token ?? '', // 这里获取自己的token携带在请求头上
        },
      };
    },
  ],
  responseInterceptors: [
    (response: any) => {
      // 拦截响应数据，进行个性化处理
      const {
        data: { code, message: msg },
      } = response;
      if (response.status === 401) {
        // 如果token 过期，跳转到登录页面
        message.error({
          content: '登录信息已过期',
        });
        setTimeout(() => {
          window.location.href = LOGIN_PATH;
        }, 1000);
      } else if (response.status === 200) {
        // 后台响应状态码处理
        switch (code) {
          case 2001:
            message.error(msg);
            break;
        }
      }
      return response;
    },
  ],
};

export default request;
