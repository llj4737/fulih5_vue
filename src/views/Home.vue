<template>
  <!-- 登录注册页面 -->
  <div id="home" style="display: block">
    <header>
      <h2>鲸鱼阅读</h2>
    </header>
    <section>
      <button class="checkIn" @click="checkIn()">签到</button>
      <form action>
        <div class="username">
          <label for>用户名:</label>
          <input type="text" v-model="user.username" />
        </div>
        <div class="password">
          <label for>密码:</label>
          <input type="password" v-model="user.password" />
        </div>
        <div class="operate">
          <button class="register" @click.prevent="register()">注册</button>
          <button class="login" @click.prevent="login()">登录</button>
        </div>
      </form>
    </section>
    <footer>
      <table border="1">
        <thead>
          <tr>
            <td>序号</td>
            <td>用户名</td>
            <td>密码</td>
          </tr>
        </thead>
        <tbody class="tbody">
          <tr v-for="(item, index) in userList" :key="index">
            <td>{{ index }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.password }}</td>
          </tr>
        </tbody>
      </table>
    </footer>
  </div>
</template>

<script>
// import axios from "../config";
import { login, register } from "../config/api";
import { isEmpty } from "../utils";
export default {
  name: "home",
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      userList: JSON.parse(localStorage.getItem("user") || "[]")
    };
  },
  components: {},
  methods: {
    async login() {
      if (Object.keys(this.user).length <= 1) return;
      let res = await login(this.user);
      let { status } = res.data;
      if (status == 200) {
        console.log(1);
        this.saveUser(); // 保存当前用户
        this.saveUserList();
      }
    },
    async register() {
      if (Object.keys(this.user).length <= 1) return;
      let res = await register(this.user);
      let data = res.data;
      alert(data.message);
    },
    saveUser() {
      localStorage.setItem("curUser", JSON.stringify(this.user));
    },
    getUser () {
      return JSON.parse(localStorage.getItem('curUser') || '{}');
    },
    saveUserList() {
      let list = this.userList.map(v => v.username);
      let { username } = this.user;
      !list.includes(username) &&
        this.userList.push(JSON.parse(JSON.stringify(this.user)));
      localStorage.setItem("user", JSON.stringify(this.userList));
    },

    checkIn() {
      let curUser = this.getUser();
      let isLogin = isEmpty(curUser);
      if (!isLogin) return;
      this.$router.push({ name: 'Welfare', params: curUser });
    }
  }
};
</script>
<style lang="stylus">
/* 主页的 css 样式 */
#home header h2 {
  text-align: center;
  font-size: 0.18rem;
  font-weight: normal;
  border-bottom: 1px solid #ccc;
  line-height: 0.46rem;
}

#home section .checkIn {
  display: block;
  width: 1rem;
  height: 0.36rem;
  text-align: center;
  color: white;
  margin: 0.5rem auto;
  background: #409EFF;
  border: none;
  font-size: 0.16rem;
  border-radius: 4px;
  /* font-family: PingFangSC-Regular; */
}

#home form {
  width: 3rem;
  /* height: 2rem; */
  margin: auto;
  overflow: hidden;
  padding: 0.25rem 0.3rem;
  border: 1px solid #999;
  border-radius: 0.2rem;
  box-sizing: border-box;
}

#home form > div {
  height: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

#home form > div > label {
  /* width: 0.6rem;
  display: block; */
  flex: 1;
  text-align: right;
}

#home form > div > input {
  flex: 3;
  margin-left: 0.1rem;
  height: 0.22rem;
  text-indent: 0.06rem;
  border: 1px solid #999;
  border-radius: 2px;
}

#home .operate {
  width: 1.9rem;
  margin: auto;
  justify-content: space-around;
  height: 0.6rem;
}

#home .operate > button {
  width: 0.8rem;
  height: 0.3rem;
  text-align: center;
  color: white;
  /* margin: 0.5rem auto; */
  background: #409EFF;
  border: none;
  font-size: 0.16rem;
  border-radius: 4px;
}

#home footer table {
  margin: 0.2rem auto;
  width: 2.8rem;
  text-align: center;
}
</style>
