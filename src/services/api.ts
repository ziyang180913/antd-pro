// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { stringify } from 'querystring';
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/user/getCurrentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request('/api/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login */
export async function login(body: API.LoginParams) {
  return request(`/api/login?${stringify(body)}`, {
    method: 'POST',
    data: { ...body },
  });
}
