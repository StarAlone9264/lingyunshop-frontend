<template>
  <div>
    <el-form
        :rules="rules"
        ref="loginForm"
        v-loading="loading"
        element-loading-text="正在登录..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :model="loginForm"
        class="loginContainer"
    >
      <h3 class="loginTitle">登录</h3>
      <el-form-item prop="username">
        <el-input
            size="normal"
            type="text"
            v-model="loginForm.username"
            auto-complete="off"
            placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            size="normal"
            type="password"
            v-model="loginForm.password"
            auto-complete="off"
            placeholder="请输入密码"
            show-password
        ></el-input>
      </el-form-item>
<!--      <el-link class="registered" type="primary"-->
<!--      >还没有账号？点击注册-->
<!--      </el-link-->
<!--      >-->
      <el-button
          size="normal"
          type="primary"
          style="width: 100%"
          :plain="true"
          @click="submitLogin"
      >登录
      </el-button
      >
    </el-form>
  </div>
</template>

<script>
import {getRequest,postRequest} from "@/common/request/httputil";
export default {
  name: "login",
  data() {
    return {
      loading: false,
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"},
        ],
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
      },
    };
  },
  methods: {
    submitLogin() {
      this.loading = true;
      if (this.loginForm.username === "" || this.loginForm.password === "") {
        this.loading = false;
        this.$message({
          message: '请填写用户名或密码！',
          type: 'warning'
        });
        return false;
      }
      let params = {
        username: this.loginForm.username,
        password: this.loginForm.password
      }
      postRequest("/user/login",params)
        .then(res => {
          this.loading = false;
          if (res.data.message === "SUCCESS"){
            this.$store.commit('$_setStorage', {user: this.loginForm.username})
          this.$store.commit('$_setLogin', '1')
          this.$router.push({name: 'Index'})
        }else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            });
          }
        }).catch(err => {
        console.log(err);
        this.$message({
          message: '出现错误了！',
          type: 'error'
        });
      })
    },
  },
}
</script>

<style scoped>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 15px auto 20px auto;
  text-align: center;
  color: #505458;
}

.registered {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
