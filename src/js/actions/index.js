import { AUTH, DELETE_ARTICLE } from "../constants/action-types";

export const auth = bool => ({ type: AUTH, payload: bool });
export const deleteArticle = id => ({ type: DELETE_ARTICLE, payload: id });
