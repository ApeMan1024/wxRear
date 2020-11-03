<template>
  <div class="app-container">
    <div class="header">
      <el-button type="primary" size="medium" @click="onAddManageHandle"
        >添加管理员</el-button
      >
      <div class="select">
        <el-form :inline="true" :model="selectNei">
          <el-form-item>
            <el-input placeholder="输入查找的内容" size="medium" v-model.trim="selectNei.nei"/>
          </el-form-item>
          <el-form-item>
            <el-button size="medium " type="success" @click="onSelectHandle">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="main">
      <el-table
        v-loading="listLoading"
        element-loading-text="Loading"
        :data="list"
        border
        fit
        highlight-current-row
        stripe
        :cell-style="{ padding: '5px 0' }"
        :header-cell-style="{
          padding: '8px 0',
          background: 'rgba(234,237,242,0.5)',
        }"
        @row-dblclick="onRowDbClickHandle"
      >
        <el-table-column align="center" label="编号" width="50">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户名">
          <template v-slot="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.username"
              placement="top"
            >
              <span class="title">{{ row.username }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="密码">
          <template #default="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.password"
              placement="top"
            >
              <span class="title">{{ row.password }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <el-row v-if="row.username !== 'root'">
              <el-col>
                <el-button
                  type="danger"
                  size="mini"
                  @click="onDeleteManageHandle(row)"
                  >删除</el-button
                >
                <el-button
                  type="info"
                  size="mini"
                  @click="onEditManageHandle(row)"
                  >编辑权限</el-button
                >
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col>
                <el-tag type="danger" size="medium">{{ "超级管理员" }}</el-tag>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          v-if="pageBool"
          @size-change="fenHandleSizeChange"
          @current-change="fenHandleCurrentChange"
          :current-page="fenpage.currentPage"
          :page-sizes="fenpage.pageSizes"
          :page-size="fenpage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="fenpage.total"
        >
        </el-pagination>
        <el-pagination
          v-else
          @size-change="selectHandleSizeChange"
          @current-change="selectHandleCurrentChange"
          :current-page="selectpage.currentPage"
          :page-sizes="selectpage.pageSizes"
          :page-size="selectpage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="selectpage.total"
        >
        </el-pagination>
      </div>
    </div>

    <div class="dialog">
      <el-dialog
        title="添加管理员"
        :visible.sync="addManageInfo.addManageDialogVisible"
        @close="onCloseManageHandle"
      >
        <el-form
          label-width="100px"
          :inline="true"
          :rules="addManageInfoRules"
          ref="manageInfoFormRef"
          :model="addManageInfo"
        >
          <el-form-item label="用户名:" prop="username">
            <el-input
              placeholder="输入用户名"
              v-model="addManageInfo.username"
              clearable
            />
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input
              placeholder="输入密码"
              v-model="addManageInfo.password"
              type="password"
              show-password
              clearable
            />
          </el-form-item>
          <el-row>
            <el-col>
              <el-form-item label="权限:" prop="checkList">
                <el-checkbox-group v-model="addManageInfo.checkList">
                  <el-checkbox
                    :label="item"
                    v-for="(item, index) in addManageInfo.powerList"
                    :key="index"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onResetHandle" size="mini" type=""
            >重 置</el-button
          >
          <el-button type="primary" @click="onAddManageHandleSubmit" size="mini"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        title="编辑管理员信息"
        :visible.sync="editManageInfo.editManageInfoVisible"
        @close="onCloseEditManageHandle"
      >
        <el-form
          label-width="100px"
          :inline="true"
          :rules="editManageInfoRules"
          ref="editManageInfoFormRef"
          :model="editManageInfo"
        >
          <el-form-item label="用户名:" prop="username">
            <el-tag type="danger">{{ editManageInfo.username }}</el-tag>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-tag type="danger">{{ editManageInfo.password }}</el-tag>
          </el-form-item>
          <el-row>
            <el-col>
              <el-form-item label="权限:" prop="checkList">
                <el-checkbox-group v-model="editManageInfo.checkList">
                  <el-checkbox
                    :label="item"
                    v-for="(item, index) in editManageInfo.powerList"
                    :key="index"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onEditResetHandle" size="mini" type=""
            >重 置</el-button
          >
          <el-button
            type="primary"
            @click="onEditManageHandleSubmit"
            size="mini"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getPower, getCheckList } from "../../utils/power";
export default {
  data() {
    return {
      selectNei:{
        nei:""
      },
      pageBool: true,
      //表格加载控制
      listLoading: false,
      list: [],
      fenpage: {
        //数据的总量
        total: 0,
        //每页显示的条数
        pageSize: 5,
        //每页显示条数的集合
        pageSizes: [5, 10, 15, 20],
        //当前的页码
        currentPage: 1,
      },
      selectpage: {
        //数据的总量
        total: 0,
        //每页显示的条数
        pageSize: 5,
        //每页显示条数的集合
        pageSizes: [5, 10, 15, 20],
        //当前的页码
        currentPage: 1,
      },
      addManageInfo: {
        addManageDialogVisible: false,
        username: "",
        password: "",
        power: "",
        //权限控制
        checkList: [],
        powerList: ["读写文章", "删除文章", "编辑文章"],
      },
      addManageInfoRules: {
        username: [
          { required: true, message: "用户名", trigger: "blur" },
          { min: 4, max: 16, message: "用户名格式不正确", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码", trigger: "blur" },
          { min: 4, max: 16, message: "密码格式不正确", trigger: "blur" },
        ],
        checkList: [
          { required: true, message: "权限不能为空", trigger: "blur" },
        ],
      },
      editManageInfo: {
        editManageInfoVisible: false,
        passwordType:false,
        username: "",
        password: "",
        checkList: [],
        power: "",
        powerList: ["读写文章", "删除文章", "编辑文章"],
      },
      editManageInfoRules: {
        username: [
          { required: true, message: "用户名", trigger: "blur" },
          { min: 4, max: 16, message: "用户名格式不正确", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码", trigger: "blur" },
          { min: 4, message: "密码格式不正确", trigger: "blur" },
        ],
        checkList: [
          { required: true, message: "权限不能为空", trigger: "blur" },
        ],
      },
    };
  },
  async created() {
    await this.getManageInfo();
  },
  methods: {
    //每页显示的条数改变时触发这个函数
    async fenHandleSizeChange(pagesize) {
      let { fenpage } = this;
      fenpage.pageSize = pagesize;
      await this.getManageInfo();
    },
    //切换页面时触发这个函数
    async fenHandleCurrentChange(index) {
      let { fenpage } = this;
      fenpage.currentPage = index;
      await this.getManageInfo();
    },

    //查询情况下每页显示的条数改变时触发这个函数
    async selectHandleSizeChange(pagesize) {
      let { selectpage } = this;
      selectpage.pageSize = pagesize;
      await this.getManageInfoSelect();
    },
    //查询情况下切换页面时时触发这个函数
    async selectHandleCurrentChange(index) {
      let { selectpage } = this;
      selectpage.currentPage = index;
      await this.getManageInfoSelect();
    },
    //删除管理员信息
    async onDeleteManageHandle({ username }) {
      let bool = await this.$confirm("确定要删除这个管理员信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (bool === "confirm") {
        let { data: res } = await this.$http.post("/delmanageinfo", {
          username,
        });
        if (res.code === 403) {
          let { path } = this.$route;
          sessionStorage.removeItem("token");
          this.$router.push(`/login?redirect=${path}`);
          return;
        }
        if (res.code === 200) {
          this.$message.success("删除成功");
          await this.getManageInfo();
          return;
        }
        this.$message.error("删除失败");
      }
    },

    //编辑管理员信息
    onEditManageHandle(row) {
      let { editManageInfo } = this;
      let checkList = getCheckList(row.power);
      this.editManageInfo = { ...editManageInfo, ...row, checkList };
      this.editManageInfo.editManageInfoVisible = true;
    },
    //重置编辑管理员信息框
    onEditResetHandle() {
      this.$refs.editManageInfoFormRef.resetFields();
    },
    //修改管理员信息
    async onEditManageHandleSubmit() {
      let bool = await this.$refs.editManageInfoFormRef.validate().catch(err=>err);
      if(!bool){
        return ;
      }
      let power1 = getPower(this.editManageInfo.checkList);
      this.editManageInfo.power = power1;
      let { username, power } = this.editManageInfo;
      let {data:res} = await this.$http.post("/editmanageinfo",{username,power});
      if(res.code===403){
        let {path} = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return ;
      }
      if(res.code===200){
        this.$message.success("修改成功");
        await this.getManageInfo();
        this.onCloseEditManageHandle();
        return ;
      }
      this.$message.error("修改失败");
    },
    //监听编辑管理员信息消息框关闭事件
    onCloseEditManageHandle() {
      this.$refs.editManageInfoFormRef.resetFields();
      let { editManageInfo } = this;
      editManageInfo.editManageInfoVisible = false;
    },

    //添加管理员信息
    onAddManageHandle() {
      let { addManageInfo } = this;
      addManageInfo.addManageDialogVisible = true;
    },
    //提交管理员信息
    async onAddManageHandleSubmit() {
      let { checkList } = this.addManageInfo;
      let power1 = getPower(checkList);
      this.addManageInfo.power = power1;
      let bool = await this.$refs.manageInfoFormRef
        .validate()
        .catch((err) => err);
      if (!bool) {
        return;
      }
      let { username, password, power } = this.addManageInfo;

      let { data: res } = await this.$http.post("/addmanageinfo", {
        username,
        password: this.$sha1(password),
        power,
      });
      if (res.code === 403) {
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      if (res.code === 200) {
        this.$message({
          message: "添加成功",
          type: "success",
        });
        await this.getManageInfo();
        this.onCloseManageHandle();
        return;
      }
      this.$message.error("添加失败");
    },
    //监听添加管理员消息框关闭事件
    async onCloseManageHandle() {
      let { addManageInfo } = this;
      this.$refs.manageInfoFormRef.resetFields();
      addManageInfo.addManageDialogVisible = false;
    },
    //监听添加管理员消息框重置事件
    onResetHandle() {
      this.$refs.manageInfoFormRef.resetFields();
    },
    //双击表格中的横，复制表格中的数据
    onRowDbClickHandle(row, column, event) {
      let oinput = document.createElement("input");
      oinput.value=JSON.stringify(row);
      document.body.appendChild(oinput);
      oinput.select();
      document.execCommand("Copy");
      this.$message.success("复制成功")
      oinput.remove();
    },
    async onSelectHandle(){
      let {nei}=this.selectNei;
      if(!nei){
        this.$message.info("请输入内容");
        return ;
      }
      await this.getManageInfoSelect();
    },
    //模糊查询用户信息
    async getManageInfoSelect(){
      let { pageSize, currentPage } = this.selectpage;
      let {nei}=this.selectNei;
      let {data:res} = await this.$http.post("/getmanageinfo",{
        pageSize,currentPage,username:nei
      });

      if(res.code===403){
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      if(res.code===200){
        this.list = res.data.list;
        this.selectpage.total = res.data.total;
        if(this.fenpage.currentPage!==1){
          this.fenpage.currentPage=1;
        }
        this.pageBool=false;
        return ;
      }
      this.$message.error("查询失败");
    },
    //获取管理员信息
    async getManageInfo() {
      let { pageSize, currentPage } = this.fenpage;
      this.listLoading = true;
      let { data: res } = await this.$http
        .post("/getmanageinfo", {
          pageSize,
          currentPage,
        })
        .catch((err) => err);
      if (res.code === 403) {
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      if (res.code === 200) {
        this.listLoading = false;
        this.list = res.data.list;
        this.fenpage.total = res.data.total;
        return;
      }
      this.listLoading = false;
      this.$message.error("获取管理员信息失败");
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$store.state.bool) {
        return next();
      }
      next("/");
    });
  },
  watch:{
    async "selectNei.nei"(newNei){
      if(newNei.length===0){
        this.pageBool=true;
        if(this.selectpage.currentPage!==1){
          this.selectpage.currentPage=1;
        }
        await this.getManageInfo();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.select {
  float: right;
  .el-form {
    .el-form-item {
      &:nth-child(2) {
        margin-right: 0px;
      }
    }
  }
}
.title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.page {
  margin-top: 10px;
}
</style>