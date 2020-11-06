<template>
  <div class="hold-transition skin-red sidebar-mini" :style="{ height: screenHeight + 'px' }">
    <!-- .box-body -->
    <div class="box-header with-border">
      <h3 class="box-title">商品类型模板管理</h3>
    </div>
    <div class="box-body">
      <!-- 数据表格 -->
      <div class="table-box">
        <!--工具栏-->
        <div class="pull-left">
          <div class="form-group form-inline">
            <div class="btn-group">
              <button type="button" class="btn btn-default" title="新建" @click="add()" data-toggle="modal" data-target="#editModal"><i
                  class="fa fa-file-o"></i> 新建
              </button>
              <button type="button" class="btn btn-default" title="删除" @click="deleteById"><i class="fa fa-trash-o"></i> 删除</button>
              <button type="button" class="btn btn-default" title="刷新" onclick="window.location.reload();"><i
                  class="fa fa-refresh"></i> 刷新
              </button>
            </div>
          </div>
        </div>
        <div class="box-tools pull-right">
          <div class="has-feedback">
            分类模板名称：<input>
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
                <input id="selall" type="checkbox" class="icheckbox_square-blue" v-model="all_checked"
                       @click="allClick()">
              </th>
              <th class="sorting_asc">模板ID</th>
              <th class="sorting">分类模板名称</th>
              <th class="sorting">关联品牌</th>
              <th class="sorting">关联规格</th>
              <th class="sorting">扩展属性</th>
              <th class="text-center">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) of list">
              <td><input type="checkbox" :value="item.id" v-model="checkedIds"></td>
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.brandIds }}</td>
              <td>{{ item.specIds }}</td>
              <td>{{ item.customAttributeItems }}</td>
              <td class="text-center">
                <button type="button" class="btn bg-olive btn-xs" data-toggle="modal" data-target="#editModal" @click="update(item.id,item.name,index)">修改
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
            <h3 id="myModalLabel">商品类型模板编辑</h3>
          </div>
          <div class="modal-body">
            <table class="table table-bordered table-striped" width="800px">
              <tr>
                <td>模板名称</td>
                <td><input class="form-control" v-model="name" placeholder="模板名称"></td>
              </tr>
              <tr>
                <td>关联品牌</td>
                <td>
                  <el-select v-model="value1" multiple placeholder="请选择" clearable filterable :disabled="disabled1">
                    <el-option
                        v-for="item in brands"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>关联规格</td>
                <td>
                  <el-select v-model="value2" multiple placeholder="请选择" clearable filterable :disabled="disabled2">
                    <el-option
                        size="medium"
                        v-for="item in specIds"
                        :key="item.id"
                        :label="item.specName"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>扩展属性</td>
                <td>
                  <div class="btn-group">
                    <button type="button" class="btn btn-default" title="新建" @click="addLine"><i class="fa fa-file-o"></i>
                      新增规格选项
                    </button>
                  </div>
                  <el-table
                      :data="tableData"
                      style="width: 100%" class="table table-bordered table-striped">
                    <el-table-column prop="text" label="属性名称" class="sorting">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.text" placeholder="属性名称"></el-input>
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
  name: "type_template",
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
      // 备用数据
      brands: [],
      customAttributeItems: [],
      specIds: [],
      // 提交数据
      id: 0,
      name: '',
      value1: [],
      value2: [],
      // 扩展属性
      tableData: [],
      addOrUpdate: true,
      disabled1: true,
      disabled2: true,
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
    add(){
      this.addOrUpdate = true;
      this.getSelectOption();
    },
    update(id,name,index){
      this.addOrUpdate = false;
      this.getSelectOption();
      this.id = id;
      this.name = name;
      let s = [];
      let strings = this.list[index].customAttributeItems.split(',');
      for (let i = 0; i < strings.length; i++) {
        let obj = {
          text: strings[i]
        }
        s.push(obj)
      }
      this.tableData = s;
    },
    save(){
      // 处理保存
      if (this.addOrUpdate){
        let brandData = [];
        this.brands.forEach((item,index) => {
          this.value1.forEach((key) => {
            if (item.id === key){
                let s = {
                  id: key,
                  text: item.name
                }
              brandData.push(s)
            }
          });
        });
        let specIdData = [];
        this.specIds.forEach((item,index) => {
          this.value2.forEach((key) => {
            if (item.id === key){
              let s = {
                id: key,
                text: item.specName
              }
              specIdData.push(s)
            }
          });
        });
        if (util.isNull(this.name)){
          this.setNotify('错误', '不能为空', 'error');
          return false;
        }
        let params = {
          id: 0,
          name: this.name,
          specIds: JSON.stringify(specIdData),
          brandIds: JSON.stringify(brandData),
          customAttributeItems: JSON.stringify(this.tableData)
        }
        postRequest('/tbTypeTemplate/insert',params)
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
        let brandData = [];
        this.brands.forEach((item,index) => {
          this.value1.forEach((key) => {
            if (item.id === key){
              let s = {
                id: key,
                text: item.name
              }
              brandData.push(s)
            }
          });
        });
        let specIdData = [];
        this.specIds.forEach((item,index) => {
          this.value2.forEach((key) => {
            if (item.id === key){
              let s = {
                id: key,
                text: item.specName
              }
              specIdData.push(s)
            }
          });
        });
        if (util.isNull(this.name)){
          this.setNotify('错误', '不能为空', 'error');
          return false;
        }
        let params = {
          id: this.id,
          name: this.name,
          specIds: JSON.stringify(specIdData),
          brandIds: JSON.stringify(brandData),
          customAttributeItems: JSON.stringify(this.tableData)
        }
        postRequest('/tbTypeTemplate/update',params)
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
    getSelectOption(){
      getRequest('/tbBrand/queryAll',null).then(res => {
        this.brands = res.data.data;
        this.disabled1 = false;
      }).catch(err => {
        console.log(err);
      });
      getRequest('/tbSpecification/queryAll',null).then(res => {
        this.specIds = res.data.data;
        this.disabled2 = false;
      }).catch(err => {
        console.log(err);
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
      this.axios.post("/api/tbTypeTemplate/dycDelByIds", this.checkedIds)
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
    addLine() { //添加行数
      var newValue = {
        id: 0,
        text: '',
      };
      //添加新的行数
      this.tableData.push(newValue);
    },
    handleDelete(index) { //删除行数
      this.tableData.splice(index, 1)
    },
    // 得到品牌信息
    handleList() {
      let _this = this;
      let params = {
        offset: _this.currentPage,
        limit: _this.pageSize
      }
      getRequest('/tbTypeTemplate/list', params)
          .then(res => {
            let list = res.data.data.content;
            _this.totalSize = res.data.data.totalSize;
            list.forEach((key,index) => {
              // 处理json
              let brand = eval("("+key.brandIds+")");
              let customAttributeItem = eval("("+key.customAttributeItems+")");
              let specId = eval("("+key.specIds+")");
              // 处理数据
              let brands = '';
              let customAttributeItems = '';
              let specIds = '';
              brand.forEach((item,index) => {
                if (index === 0){
                  brands += item.text;
                }else {
                  brands += ','+item.text;
                }
              });
              customAttributeItem.forEach((item,index) => {
                if (index === 0){
                  customAttributeItems += item.text;
                }else {
                  customAttributeItems += ','+item.text;
                }
              });
              specId.forEach((item,index) => {
                if (index === 0){
                  specIds += item.text;
                }else {
                  specIds += ','+item.text;
                }
              });
              key.brandIds = brands;
              key.customAttributeItems = customAttributeItems;
              key.specIds = specIds;
            });
            this.list = list;
          }).catch(err => {
        console.log(err)
        this.setNotify('错误', '遇到了未知问题', 'error');
      });
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
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleList();
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
  }
}
</script>

<style scoped>

</style>
