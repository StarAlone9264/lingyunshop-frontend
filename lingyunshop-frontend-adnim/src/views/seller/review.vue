<template>
  <div class="hold-transition skin-red sidebar-mini" :style="{ height: screenHeight + 'px' }">
    <!-- .box-body -->
    <div class="box box-primary">
      <div class="box-header with-border">
        <h3 class="box-title">商家审核</h3>
      </div>

      <div class="box-body">

        <!-- 数据表格 -->
        <div class="table-box">

          <!--工具栏-->

          <div class="box-tools pull-right">
            <div class="has-feedback">
              公司名称：<input>
              店铺名称： <input>
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
                  <input id="selall" v-model="all_checked" type="checkbox" @click="allClick()"/>
                </th>
                <th class="sorting_asc">商家ID</th>
                <th class="sorting">公司名称</th>
                <th class="sorting">店铺名称</th>
                <th class="sorting">联系人姓名</th>
                <th class="sorting">公司电话</th>

                <th class="text-center">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(innerItem,index) of list">
                <td><input type="checkbox" :value="innerItem.id" v-model="checkedIds"></td>
                <td>{{ innerItem.sellerId }}</td>
                <td>{{ innerItem.name }}</td>
                <td>{{ innerItem.nickName }}</td>
                <td>{{ innerItem.linkmanName }}</td>
                <td>{{ innerItem.telephone }}</td>
                <td class="text-center">
                  <button type="button" class="btn bg-olive btn-xs" data-toggle="modal" data-target="#sellerModal" @click="details(index)">详情
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
      <!-- 商家详情 -->
      <div class="modal fade" id="sellerModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
           aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h3 id="myModalLabel">商家详情</h3>
            </div>
            <div class="modal-body">

              <ul class="nav nav-tabs">
                <li class="active"><a href="#home" data-toggle="tab">基本信息</a></li>
                <li><a href="#linkman" data-toggle="tab">联系人</a></li>
                <li><a href="#certificate" data-toggle="tab">证件</a></li>
                <li><a href="#ceo" data-toggle="tab">法定代表人</a></li>
                <li><a href="#bank" data-toggle="tab">开户行</a></li>
              </ul>

              <!-- 选项卡开始 -->
              <div id="myTabContent" class="tab-content">
                <div class="tab-pane active in" id="home">
                  <br>
                  <table class="table table-bordered table-striped" width="800px">
                    <tr>
                      <td>公司名称</td>
                      <td>{{seller.name}}</td>
                    </tr>
                    <tr>
                      <td>店铺名称</td>
                      <td>{{seller.nickName}}</td>
                    </tr>
                    <tr>
                      <td>公司电话</td>
                      <td>{{seller.telephone}}</td>
                    </tr>
                    <tr>
                      <td>公司详细地址</td>
                      <td>{{seller.addressDetail}}</td>
                    </tr>
                  </table>
                </div>
                <div class="tab-pane fade" id="linkman">
                  <br>
                  <table class="table table-bordered table-striped">
                    <tr>
                      <td>联系人姓名</td>
                      <td>{{seller.linkmanName}}</td>
                    </tr>
                    <tr>
                      <td>联系人QQ</td>
                      <td>{{seller.linkmanQq}}</td>
                    </tr>
                    <tr>
                      <td>联系人手机</td>
                      <td>{{seller.linkmanMobile}}</td>
                    </tr>
                    <tr>
                      <td>联系人E-Mail</td>
                      <td>{{seller.linkmanEmail}}</td>
                    </tr>
                  </table>
                </div>
                <div class="tab-pane fade" id="certificate">
                  <br>
                  <table class="table table-bordered table-striped">
                    <tr>
                      <td>营业执照号</td>
                      <td>{{seller.licenseNumber}}</td>
                    </tr>
                    <tr>
                      <td>税务登记证号</td>
                      <td>{{seller.taxNumber}}</td>
                    </tr>
                    <tr>
                      <td>组织机构代码证号</td>
                      <td>{{seller.orgNumber}}</td>
                    </tr>
                  </table>
                </div>
                <div class="tab-pane fade" id="ceo">
                  <br>
                  <table class="table table-bordered table-striped">
                    <tr>
                      <td>法定代表人</td>
                      <td>{{seller.legalPerson}}</td>
                    </tr>
                    <tr>
                      <td>法定代表人身份证号</td>
                      <td>{{seller.legalPersonCardId}}</td>
                    </tr>
                  </table>
                </div>
                <div class="tab-pane fade" id="bank">
                  <br>
                  <table class="table table-bordered table-striped">
                    <tr>
                      <td>开户行名称</td>
                      <td>{{seller.bankUser}}</td>
                    </tr>

                    <tr>
                      <td>银行账号</td>
                      <td>{{seller.bankName}}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <!-- 选项卡结束 -->


            </div>
            <div class="modal-footer">
              <button class="btn btn-success" data-dismiss="modal" aria-hidden="true" @click="update(1)">审核通过</button>
              <button class="btn btn-danger" data-dismiss="modal" aria-hidden="true" @click="update(2)">审核未通过</button>
              <button class="btn btn-danger" data-dismiss="modal" aria-hidden="true" @click="update(3)">关闭商家</button>
              <button class="btn btn-default" data-dismiss="modal" aria-hidden="true">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getRequest,postRequest} from "@/common/request/httputil";

export default {
  name: "review",
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
      seller: {}
    }
  },
  mounted() {
    var _this = this;
    window.addEventListener('message', function (e) {
      _this.screenHeight = e.data;
      _this.tableScreenHeight = e.data - 100;
    })
  },
  methods: {
    // 全选
    allClick() {
      if (!this.all_checked) {
        let _this = this;
        if (_this.checkedIds.length !== 0) this.checkedIds = []
        _this.list.forEach(function (item) {
          _this.checkedIds.push(item.sellerId);
        })
      } else {
        this.checkedIds = []
      }
    },
    // 分页切换
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleList();
    },
    // 得到品牌信息
    handleList() {
      let _this = this;
      let params = {
        "status": "0",
        offset: _this.currentPage,
        limit: _this.pageSize
      }
      getRequest('/tbSeller/queryBusiness', params)
          .then(res => {
            _this.list = res.data.data.content;
            _this.totalSize = res.data.data.totalSize;
            if (this.list.length === 0){
              this.setNotify('tip', '目前暂无待审核的商家', 'success');
            }
          }).catch(err => {
        console.log(err)
        this.setNotify('错误', '遇到了未知问题', 'error');
      });
    },
    details(index){
      this.seller = this.list[index];
    },
    update(i){
      console.log(i);
      let params = {
        sellerId: this.seller.sellerId,
        status: i
      }
      postRequest("/tbSeller/update",params)
        .then(res => {
          console.log(res);
        }).catch(err => {
        console.log(err);
        this.setNotify('错误', '遇到了未知问题', 'error');
      })
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
  created() {
    this.handleList()
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
