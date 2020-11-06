<template>
  <div class="hold-transition skin-red sidebar-mini" :style="{ height: screenHeight + 'px' }">
    <!-- .box-body -->
    <div class="box-header with-border">
      <h3 class="box-title">商品分类管理
      </h3>
    </div>
    <div class="box-body">
      <ol class="breadcrumb">
        <li v-for="(item,index) of topList">
          <a href="#" @click="top(index)">{{ item.text }}</a>
        </li>
      </ol>
      <!-- 数据表格 -->
      <div class="table-box">
        <!--工具栏-->
        <div class="pull-left">
          <div class="form-group form-inline">
            <div class="btn-group">
              <button type="button" class="btn btn-default" title="新建" data-toggle="modal" data-target="#editModal" @click="add"><i
                  class="fa fa-file-o"></i> 新建
              </button>
              <button type="button" class="btn btn-default" title="删除"><i class="fa fa-trash-o"></i> 删除</button>
              <button type="button" class="btn btn-default" title="刷新" onclick="window.location.reload();"><i
                  class="fa fa-check"></i> 刷新
              </button>
            </div>
          </div>
        </div>
        <!--数据列表-->
        <div :style="{ height: tableScreenHeight + 'px' }">
          <table id="dataList" class="table table-bordered table-striped table-hover dataTable">
            <thead>
            <tr>
              <th class="" style="padding-right:0px">
                <input v-model="all_checked" type="checkbox" @click="allClick()" class="icheckbox_square-blue">
              </th>
              <th class="sorting_asc">分类ID</th>
              <th class="sorting">分类名称</th>
              <th class="sorting">类型模板ID</th>
              <th class="text-center">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) of list">
              <td><input type="checkbox" :value="item.id" v-model="checkedIds"></td>
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.typeId }}</td>
              <td class="text-center">
                <button type="button" class="btn bg-olive btn-xs" @click="findNext(item.id,index)">查询下级</button>&nbsp;
                <button type="button" class="btn bg-olive btn-xs" data-toggle="modal" data-target="#editModal" @click="update(index)">修改
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
            <h3 id="myModalLabel">商品分类编辑</h3>
          </div>
          <div class="modal-body">
            <table class="table table-bordered table-striped" width="800px">
              <tr>
                <td>上级商品分类</td>
                <td>
                  <span v-for="item of topList">{{ item.text }}>></span>
                </td>
              </tr>
              <tr>
                <td>商品分类名称</td>
                <td><input class="form-control" v-model="name" placeholder="商品分类名称"></td>
              </tr>
              <tr>
                <td>类型模板</td>
                <td>
                  <el-select v-model="tepValue" placeholder="请选择">
                    <el-option
                        v-for="item in tepList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </td>
              </tr>
            </table>
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
import util from "@/common/util/public";
export default {
  name: "item_cat",
  data() {
    return {
      // 自适应高度
      screenHeight: 0,
      tableScreenHeight: 727,
      // 数据
      list: [],
      currentPage: 1,
      pageSize: 15,
      totalSize: 0,
      all_checked: false,
      checkedIds: [],
      parentId: 0,
      // 顶部
      topList: [{id: 0, text: '顶级分类列表'}],
      // 模板
      tepList: [],
      // 修改添加
      isAdd: true,
      // 模板id
      tepValue: '',
      // name
      name: '',
      // id
      id: 0
    }
  },
  mounted() {
    window.addEventListener('message', function (e) {
      this.screenHeight = e.data;
      this.tableScreenHeight = e.data - 100;
    })
  },
  methods: {
    // 点击添加
    add(){
      this.isAdd = true;
      // 初始化新增输入框数据
      this.name = '';
      this.tepValue = '';
      this.getTypeList();
    },
    // 点击修改
    update(index){
      this.isAdd = false;
      let itemCat = this.list[index];
      // 初始化输入框数据
      this.id = itemCat.id;
      this.name = itemCat.name;
      // 下拉框获取模板列表
      this.getTypeList();
      // 匹配下拉框
      if (!util.isNull(itemCat.typeId)) {
        this.tepList.forEach((key) => {
          if (key.id === itemCat.typeId) {
            this.tepValue = key.id
          }
        });
      }else {
        this.tepValue = '';
      }
    },
    // 添加or修改
    save(){
      if (this.isAdd){
        if (util.isNull(this.name)){
          this.setNotify('tips', '名称要写东西哦，否则不会执行哒~~~', 'warning');
          return false;
        }
        if (this.tepValue == null){
          this.setNotify('tips', '下拉框要选东西哦，否则不会执行哒', 'warning');
          return false;
        }
        let params = {
          id: 0,
          parentId: this.getCurrentId(),
          name: this.name,
          typeId: this.tepValue
        }
        postRequest('/tbItemCat/add',params)
            .then(res => {
              if (res.data.message === 'success'){
                this.setNotify('tips', '添加成功', 'success');
                let params = {
                  parentId: this.getCurrentId(),
                  offset: this.currentPage,
                  limit: this.pageSize
                }
                this.handleList(params)
              }
            }).catch(err => {
          console.log(err);
          this.setNotify('错误', '遇到了未知问题，请重试！', 'warning');
        })
      }else {
        if (util.isNull(this.name)){
          this.setNotify('tips', '名称要写东西哦，否则不会执行哒~~~', 'warning');
          return false;
        }
        if (this.tepValue == null){
          this.setNotify('tips', '下拉框要选东西哦，否则不会执行哒', 'warning');
          return false;
        }
        // 修改
        let params = {
          id: this.id,
          parentId: this.getCurrentId(),
          name: this.name,
          typeId: this.tepValue
        }
        postRequest('/tbItemCat/update',params)
            .then(res => {
              console.log(res);
              if (res.data.message === 'success'){
                this.setNotify('tips', '修改成功', 'success');
                let params = {
                  parentId: this.getCurrentId(),
                  offset: this.currentPage,
                  limit: this.pageSize
                }
                this.handleList(params)
              }
            }).catch(err => {
          console.log(err);
          this.setNotify('错误', '遇到了未知问题，请重试！', 'warning');
        })
      }
    },
    // 获取列表数据
    handleList(params) {
      getRequest('/tbItemCat/list', params)
          .then(res => {
            if (res.data.message === 'SUCCESS') {
              this.list = res.data.data.content;
              this.totalSize = res.data.data.totalSize;
            } else {
              this.setNotify('错误', '遇到了未知问题，请重试！', 'warning');
            }
          }).catch(err => {
        console.log(err);
        this.setNotify('错误', '遇到了未知问题，请重试！', 'warning');
      });
    },
    // 下一级
    findNext(id, index) {
      if (this.topList.length === 3) {
        this.setNotify('tips', '不要再点了，没东西啦~~~', 'success');
        return false;
      }
      let list = this.list[index];
      let data = {
        id: list.id,
        text: list.name
      }
      this.topList.push(data);
      // 获取下级
      let params = {
        parentId: id,
        offset: 1,
        limit: this.pageSize
      }
      this.handleList(params);
    },
    // 点击顶部导航
    top(index) {
      if (index === 0) {
        this.topList.splice(index + 1, 2);
      }
      let params = {
        parentId: this.topList[index].id,
        offset: 1,
        limit: this.pageSize
      }
      this.handleList(params);
      this.topList.splice(index + 1, 1);
    },
    /**
     * 公共部分
     */
    // 分页切换
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取初始化数据
      let params = {
        parentId: 0,
        offset: this.currentPage,
        limit: this.pageSize
      }
      this.handleList(params);
    },
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
    // 获取模板信息
    getTypeList(){
      let params = {
        tbTypeTemplate: null,
      }
      getRequest('/tbTypeTemplate/query',params)
          .then(res => {
            if (res.data.message === 'SUCCESS') {
              this.tepList = res.data.data;
            } else {
              this.setNotify('错误', '遇到了未知问题，请重试！', 'warning');
            }
          }).catch(err => {
        this.setNotify('错误', '遇到了未知问题，请重试！', 'warning');
      })
    },
    // 获取当前面包屑id
    getCurrentId(){
      if (this.topList.length > 1){
        return  this.topList[this.topList.length - 1].id;
      }else {
        return  this.topList[0].id;
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
    }
  },
  created() {
    // 获取初始化数据
    let params = {
      parentId: 0,
      offset: this.currentPage,
      limit: this.pageSize
    }
    this.handleList(params);
  }
}
</script>

<style scoped>

</style>
