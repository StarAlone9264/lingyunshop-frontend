<template>
  <div class="hold-transition skin-red sidebar-mini" :style="{ height: screenHeight + 'px' }">
    <!-- .box-body -->
    <div class="box-header with-border">
      <h3 class="box-title">规格管理</h3>
    </div>
    <div class="box-body">
      <!-- 数据表格 -->
      <div class="table-box">
        <!--工具栏-->
        <div class="pull-left">
          <div class="form-group form-inline">
            <div class="btn-group">
              <button type="button" class="btn btn-default" title="新建" data-toggle="modal" data-target="#editModal"
                      @click="add()"><i
                  class="fa fa-file-o"></i> 新建
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
            规格名称：<input>
            <button class="btn btn-default">查询</button>
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
              <th class="sorting_asc">规格ID</th>
              <th class="sorting">规格名称</th>
              <th class="text-center">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(innerItem,index) of list">
              <td><input type="checkbox" :value="innerItem.tbSpecification.id" v-model="checkedIds"></td>
              <td>{{ innerItem.tbSpecification.id }}</td>
              <td>{{ innerItem.tbSpecification.specName }}</td>
              <td class="text-center">
                <button type="button" class="btn bg-olive btn-xs" data-toggle="modal" data-target="#editModal"
                        @click="update(innerItem.tbSpecification.id,innerItem.tbSpecification.specName,index)">修改
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
            <h3 id="myModalLabel">规格编辑</h3>
          </div>
          <div class="modal-body">
            <table class="table table-bordered table-striped" width="800px">
              <tr>
                <td>规格名称</td>
                <td><input class="form-control" placeholder="规格名称" v-model="specName"></td>
              </tr>
            </table>
            <!-- 规格选项 -->
            <div class="btn-group">
              <button type="button" class="btn btn-default" title="新建" @click="addLine"><i class="fa fa-file-o"></i>
                新增规格选项
              </button>
            </div>
            <el-table
                :data="tableData"
                style="width: 100%">
              <el-table-column prop="optionName" label="选项" class="sorting">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.optionName" placeholder="选项"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="orders" label="排序" class="sorting">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.orders" placeholder="排序"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="but" label="操作" class="sorting">
                <template slot-scope="scope">
                  <el-button
                      class="btn btn-default"
                      size="mini"
                      type="danger"
                      v-if="!scope.row.editing"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" data-dismiss="modal" aria-hidden="true" @click="save">保存</button>
            <button class="btn btn-default" data-dismiss="modal" aria-hidden="true">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getRequest, postRequest} from "@/common/request/httputil";
import qs from 'qs';
export default {
  name: "specification",
  data() {
    return {
      // 自适应高度
      screenHeight: 0,
      tableScreenHeight: 727,
      // 页面数据
      list: [],
      currentPage: 1,
      pageSize: 15,
      totalSize: 0,
      all_checked: false,
      checkedIds: [],
      // 数据
      id: 0,
      specName: '',
      // 规格选项数据
      tableData: [{
        id: 0,
        optionName: '',
        orders: '',
      }],
      addOrUpdate: true
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
      console.log(this.all_checked)
      console.log(this.checkedIds)
      if (!this.all_checked) {
        let _this = this;
        if (_this.checkedIds.length !== 0) this.checkedIds = []
        _this.list.forEach(function (item) {
          _this.checkedIds.push(item.tbSpecification.id);
        })
      } else {
        this.checkedIds = []
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleList();
    },
    update(id, specName,index) {
      this.addOrUpdate = false;
      // 替换对应id 以及名字
      this.id = id;
      this.specName = specName;
      // 修改 替换数据
      this.tableData = [{
        id: 0,
        optionName: '123',
        orders: '123',
      }];
      let s = [];
      this.list[index].tbSpecificationOptions.forEach((key)=>{
        let str = {
          id: key.id,
          optionName: key.optionName,
          orders: key.orders
        }
        s.push(str);
      })
      this.tableData = s;
    },
    add() {
      // 添加初始化数据
      this.addOrUpdate = true;
      this.specName = '';
      this.tableData = [{id: 0,optionName: '', orders: '',}]
    },
    addLine() { //添加行数
      var newValue = {
        id: 0,
        option: '',
        orders: '',
      };
      //添加新的行数
      this.tableData.push(newValue);
    },
    handleDelete(index) { //删除行数
      this.tableData.splice(index, 1)
    },
    save() {
      //这部分应该是保存提交你添加的内容
      if (this.addOrUpdate){
        let params = {
          tbSpecification: {
            id: 0,
            specName: this.specName
          },
          tbSpecificationOptions: this.tableData
        }
        postRequest("/tbSpecification/insert",params)
          .then(res => {
            if (res.status === 200){
              this.handleList();
              if (res.data.message === 'success'){
                this.setNotify('成功', '添加成功', 'success');
              }else {
                this.setNotify('错误', res.data.message, 'error');
              }
            }
          }).catch(err => {
            console.log(err)
          this.setNotify('错误', '遇到了未知问题', 'error');
        });
      }else {
        let params = {
          tbSpecification: {
            id: this.id,
            specName: this.specName
          },
          tbSpecificationOptions: this.tableData
        }
        postRequest("/tbSpecification/update",params)
            .then(res => {
              if (res.status === 200){
                this.handleList();
                if (res.data.message === 'success'){
                  this.setNotify('成功', '修改成功', 'success');
                }else {
                  this.setNotify('错误', res.data.message, 'error');
                }
              }
            }).catch(err => {
          console.log(err)
          this.setNotify('错误', '遇到了未知问题', 'error');
        });
      }
    },
    // 提示信息
    setNotify(title, message, type) {
      const h = this.$createElement;
      this.$notify({
        title: title,
        message: h('i', {style: 'color: teal'}, message),
        type: type
      });
    },
    // 得到品牌信息
    handleList() {
      let _this = this;
      let params = {
        offset: _this.currentPage,
        limit: _this.pageSize
      }
      getRequest('/tbSpecification/list', params)
          .then(res => {
            _this.list = res.data.data.content;
            _this.totalSize = res.data.data.totalSize;
          }).catch(err => {
        console.log(err)
        this.setNotify('错误', '遇到了未知问题', 'error');
      });
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
      this.axios.post("/api/tbSpecification/dycDelByIds", this.checkedIds)
          .then(res => {
            if (res.status === 200) {
                this.handleList();
                if (res.data.message === 'success'){
                  this.setNotify('成功', '删除成功', 'success');
                }else {
                  this.setNotify('错误', res.data.message, 'error');
                }
            }
          }).catch(err => {
        this.setNotify('错误', '遇到了未知问题', 'error');
      })
    },
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

</style>