import request from "@/utils/request";

export const getCenterMap = (params:any) => {
  return request({
      method: "get",
      url: "/bigscreen/centerMap",
      params,
    })
};
