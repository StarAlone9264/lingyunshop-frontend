<template>
  <div class="hold-transition skin-red sidebar-mini" :style="{ height: screenHeight + 'px' }">
    <div class="box-header with-border">
      <h3 class="box-title">品牌管理</h3>
    </div>
    <div class="box-body">
      <!-- 数据表格 -->
      <div class="table-box">
        <!--工具栏-->
        <div class="pull-left">
          <div class="form-group form-inline">
            <div class="btn-group">
              <button type="button" class="btn btn-default" title="新建" @click="add()" data-toggle="modal"
                      data-target="#editModal"><i class="fa fa-file-o"></i> 新建
              </button>
              <button type="button" class="btn btn-default" title="删除" @click="deleteById()"><i
                  class="fa fa-trash-o"></i> 删除
              </button>
              <button type="button" class="btn btn-default" title="刷新" onclick="window.location.reload();"><i
                  class="fa fa-refresh"></i> 刷新
              </button>
            </div>
          </div>
        </div>
        <div class="box-tools pull-right">
          <div class="has-feedback">

          </div>
        </div>
        <!--工具栏/-->

        <!--数据列表-->
        <div :style="{ height: tableScreenHeight + 'px' }">
          <table id="dataList" class="table table-bordered table-striped table-hover dataTable">
            <thead>
            <tr>
              <th class="" style="padding-right:0px">
                <input id="selall" v-model="all_checked" type="checkbox" @click="allClick()"
                       class="icheckbox_square-blue">
              </th>
              <th class="sorting_asc">品牌ID</th>
              <th class="sorting">品牌名称</th>
              <th class="sorting">品牌首字母</th>
              <th class="text-center">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="innerItem of list">
              <td><input type="checkbox" :value="innerItem.id" v-model="checkedIds"></td>
              <td>{{ innerItem.id }}</td>
              <td>{{ innerItem.name }}</td>
              <td>{{ innerItem.firstChar }}</td>
              <td class="text-center">
                <button type="button" class="btn bg-olive btn-xs" data-toggle="modal" data-target="#editModal"
                        @click="update(innerItem.id,innerItem.name,innerItem.firstChar)">修改
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-Page='currentPage'
            :page-size="pageSize"
            :total="totalSize">
        </el-pagination>
        <!--数据列表/-->
      </div>
      <!-- 数据表格 /-->
    </div>
    <!-- /.box-body -->
    <!-- 编辑窗口 -->
    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 id="myModalLabel" v-if="isAdd">品牌添加</h3>
            <h3 id="myModalLabel" v-else-if="!isAdd">品牌修改</h3>
          </div>
          <div class="modal-body">
            <table class="table table-bordered table-striped" width="800px">
              <tr>
                <td>品牌名称</td>
                <td><input class="form-control" name="name" v-model="name" autocomplete="off" placeholder="品牌名称"></td>
              </tr>
              <tr>
                <td>首字母</td>
                <td><input class="form-control" name="firstChar" v-model="firstChar" autocomplete="off"
                           placeholder="首字母"></td>
              </tr>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" data-dismiss="modal" aria-hidden="true" @click="go()">保存</button>
            <button class="btn btn-default" data-dismiss="modal" aria-hidden="true">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getRequest, postRequest} from "@/common/request/httputil";

export default {
  name: "brand",
  data() {
    return {
      // 自适应高度
      screenHeight: 0,
      tableScreenHeight: 727,
      // 品牌
      list: [],
      currentPage: 1,
      pageSize: 15,
      totalSize: 0,
      all_checked: false,
      checkedIds: [],
      // 修改添加
      isAdd: true,
      id: 0,
      name: "",
      firstChar: ""
    }
  },
  mounted() {
    var _this = this;
    window.addEventListener('message', function (e) {
      _this.screenHeight = e.data;
      _this.tableScreenHeight = e.data - 100;
    })
  },
  created() {
    this.handleList()
  },
  methods: {
    // 全选
    allClick() {
      if (!this.all_checked) {
        let _this = this;
        if (_this.checkedIds.length !== 0) this.checkedIds = []
        _this.list.forEach(function (item) {
          _this.checkedIds.push(item.id);
        })
      } else {
        this.checkedIds = []
      }
    },
    deleteById() {
      if (this.checkedIds.length < 1) {
        const h = this.$createElement;
        this.$notify({
          title: '警告',
          message: h('i', {style: 'color: teal'}, '请至少选择一条'),
          type: 'warning'
        });
        return false;
      }
      this.axios.post("/api/tbBrand/dycDelByIds", this.checkedIds)
          .then(res => {
            console.log(res);
            if (res.status === 200) {
              if (res.statusText === "OK") {
                this.handleList();
                const h = this.$createElement;
                this.$notify({
                  title: '成功',
                  message: h('i', {style: 'color: teal'}, '删除成功'),
                  type: 'success'
                });
              }
            }
          }).catch(err => {
        console.log(err)
        this.setNotify('错误', '遇到了未知问题', 'error');
      })
    },
    // handleSizeChange (val) {
    //   this.pageSize = val
    //   console.log(`每页 ${val} 条`);
    // },
    // 分页切换
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleList();
    },
    // 得到品牌信息
    handleList() {
      let _this = this;
      let params = {
        offset: _this.currentPage,
        limit: _this.pageSize
      }
      getRequest('/tbBrand/list', params)
          .then(res => {
            _this.list = res.data.data.content;
            _this.totalSize = res.data.data.totalSize;
          }).catch(err => {
        console.log(err)
        this.setNotify('错误', '遇到了未知问题', 'error');
      });
    },
    add() {
      this.isAdd = true;
      this.name = '';
      this.firstChar = ''
    },
    update(id, name, firstChar) {
      this.isAdd = false;
      this.id = id;
      this.name = name;
      this.firstChar = firstChar
    },
    go() {
      // 添加
      if (this.isAdd) {
        if (this.firstChar.length > 1) {
          this.setNotify('错误', '首字母只允许输入一位', 'error');
          return false;
        }
        let params = {
          name: this.name,
          firstChar: this.firstChar
        }
        postRequest("/tbBrand/insert", params)
            .then(res => {
              console.log(res.data);
              if (res.data.resultCode === 500) {
                if (res.data.message === "existed") {
                  this.setNotify('错误', '该品牌已存在', 'warning');
                } else if (res.data.message === "error") {
                  this.setNotify('错误', '遇到了未知问题', 'error');
                }
              } else {
                this.setNotify('成功', '添加成功', 'success');
              }
              this.handleList();
            }).catch(err => {
          console.log(err)
          this.setNotify('错误', '遇到了未知问题', 'error');
        })
      } else {
        if (this.firstChar.length > 1) {
          this.setNotify('错误', '首字母只允许输入一位', 'error');
          return false;
        }
        // 修改
        let params = {
          id: this.id,
          name: this.name,
          firstChar: this.firstChar
        }
        postRequest("/tbBrand/update", params)
            .then(res => {
              console.log();
              if (res.data.resultCode === 500) {
                if (res.data.message === "null") {
                  this.setNotify('错误', '未查询到该品牌，请重试！', 'warning');
                } else if (res.data.message === "error") {
                  this.setNotify('错误', '遇到了未知问题', 'error');
                }
              } else {
                this.setNotify('成功', '添加成功', 'success');
              }
              this.handleList();
            }).catch(err => {
          console.log(err);
          this.setNotify('错误', '遇到了未知问题，请重试！', 'warning');
        })
      }
    },
    setNotify(title, message, type) {
      const h = this.$createElement;
      this.$notify({
        title: title,
        message: h('i', {style: 'color: teal'}, message),
        type: type
      });
    }
  },
  watch: {
    // 监听全选
    "checkedIds": function () {
      if (this.checkedIds.length === this.list.length) {
        this.all_checked = true
      } else {
        this.all_checked = false
      }
    }
  }
}
</script>

<style scoped>
@import "../../assets/plugins/adminLTE/css/skins/_all-skins.min.css";

</style>
