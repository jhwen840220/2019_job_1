import Vue from "vue";
import Vuex from "vuex";
import { db } from "~/plugins/firebase.js";
Vue.use(Vuex);

export const actions = {
  update_data({ commit }, { storeName, data }) {
    commit("update_data", { storeName: storeName, data: data }, { root: true });
  },
  async onSubmit({ commit }, { api, postData }) {
    const res = await api(postData);

    if (res && res.header.status === "100") {
      return submitSuccess(res);
    } else {
      return await Promise.reject({ text: res.header.desc });
    }
  },

  async getList({ commit, rootState }, { storeName, api, postData }) {
    const res = await api(postData);
    if (res && res.header.status === "100") {
      const data = res.body;
      const newStoreState = formatResData(data);
      commit(
        "update_data",
        { storeName: storeName, data: { list: newStoreState.list } },
        { root: true }
      );
    } else {
      return await Promise.reject({ text: res.header.desc });
    }
  },

  getData_byFirebase({ commit }, { storeName, route, listName }) {
    db.ref(route).once("value", function(snapshot) {
      var data = snapshot.val();
      commit(
        "update_data",
        {
          storeName: storeName,
          data: { [listName]: data.data }
        },
        { root: true }
      );
    });
  }
};

const submitSuccess = res => {
  return Promise.resolve({ text: "成功" });
};

const formatResData = resData => {
  return {
    list: resData["data"],
    total: resData.total_count
  };
};
