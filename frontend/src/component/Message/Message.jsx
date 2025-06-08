import { message as antdMessage } from 'antd';

export const success = (mes = 'Success') => {
    antdMessage.success(mes);
};

export const error = (mes = 'Error') => {
    antdMessage.error(mes);
};

export const warning = (mes = 'Warning') => {
    antdMessage.warning(mes);
};