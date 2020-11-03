<template>
  <el-container>
    <el-header>
      <div class="head">
        <el-form :inline="true">
          <el-form-item>
            <el-input
              placeholder="输入要查找的内容"
              size="medium"
              @keyup.native.enter="onUserSelectHandle"
              v-model.trim="selectpage.selectVal"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" size="medium" @click="onUserSelectHandle"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-header>
    <el-main>
      <el-table
        :data="userlist"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        stripe
        :cell-style="{ padding: '5px 0' }"
        :header-cell-style="{
          padding: '8px 0',
          background: 'rgba(234,237,242,0.5)',
        }"
        @row-dblclick="onRowDblClickHandle"
      >
        <el-table-column label="#" align="center" width="50">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="读者编号" align="center" prop="id" />
        <el-table-column label="读者昵称" align="center" prop="username">
          <template #default="{ row }">
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
        <el-table-column label="读者隐私" align="center" prop="private">
          <template #default="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.private"
              placement="top"
            >
              <span class="title">{{ row.private }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="读者头像" align="center" prop="avatarUrl">
          <template #default="{ row }">
            <el-popover
              placement="top-start"
              title="读者头像"
              width="100"
              trigger="hover"
            >
              <div class="avat">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="row.avatarUrl"
                  fit="cover"
                  :preview-src-list="[row.avatarUrl]"
                ></el-image>
              </div>
              <el-button slot="reference" size="mini" type="primary"
                >查看</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              @click="onDetailsShowHandle(row)"
              size="mini"
              >详情</el-button
            >
            <el-button
              type="warning"
              @click="onDetailsEditHandle(row)"
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="onDetailsDelHandle(row)"
              size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          :current-page="fenpage.currentPage"
          :page-sizes="fenpage.pageSizes"
          :page-size="fenpage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="fenpage.total"
          v-if="pageBool"
        >
        </el-pagination>
        <el-pagination
          @size-change="onHandleSizeChangeSelect"
          @current-change="onHandleCurrentChangeSelect"
          :current-page="selectpage.currentPage"
          :page-sizes="selectpage.pageSizes"
          :page-size="selectpage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="selectpage.total"
          v-else
        >
        </el-pagination>
      </div>
      <div class="dialog">
        <el-dialog
          title="读者详细信息"
          :visible.sync="readerDetails.readerDialogVisible"
        >
          <div class="reader">
            <el-row>
              <el-col :span="12">
                <span class="title">读者编号:</span>
                <span
                  ><el-tag type="primary">{{ readerDetails.id }}</el-tag></span
                >
              </el-col>
              <el-col :span="12">
                <span class="title">读者昵称:</span>
                <span>{{ readerDetails.username }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span class="title">读者隐私:</span>
                <span
                  ><el-tag type="danger">{{
                    readerDetails.private
                  }}</el-tag></span
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="img">
                <span class="title">读者头像:</span>
                <span>
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="readerDetails.avatarUrl"
                    fit="cover"
                    :preview-src-list="[readerDetails.avatarUrl]"
                  ></el-image>
                </span>
              </el-col>
            </el-row>
          </div>
        </el-dialog>
        <el-dialog
          title="编辑读者信息"
          :visible.sync="editReaderDetails.editReaderDialogVisible"
          @close="onEditReaderCloseHandle"
        >
          <el-form
            :model="editReaderDetails.readerinfo"
            ref="editReaderFormRef"
            :rules="editReaderDetails.editReaderFormRules"
            label-width="100px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item prop="id" label="读者编号:">
                  <el-tag type="primary">{{
                    editReaderDetails.readerinfo.id
                  }}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="username" label="读者昵称:">
                  <el-input
                    placeholder="读者昵称"
                    v-model.trim="editReaderDetails.readerinfo.username"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="private" label="读者隐私:">
                  <el-tag type="danger">{{
                    editReaderDetails.readerinfo.private
                  }}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="avatarUrl" label="读者头像:">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="editReaderDetails.readerinfo.avatarUrl"
                    fit="cover"
                    :preview-src-list="[editReaderDetails.readerinfo.avatarUrl]"
                  ></el-image>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="onEditReaderCloseHandle" size="mini"
              >取 消</el-button
            >
            <el-button type="primary" @click="onEditSubmitHandle" size="mini"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      userlist: [
        {
          id: 1,
          username: "无須終有!",
          avatarUrl:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/1LToicIGtrovicjX2S65icG9Hal6KPP0PpINnSl794Qw78weibSYpsCH05PdjqW2PDAC8KrkBJOXYibIc1ftDU5jcYg/132",
          private: "aidjai",
        },
      ],
      listLoading: true,
      //分页组件切换
      pageBool: true,
      // 普通模式分页信息
      fenpage: {
        // 当前显示的页序号
        currentPage: 1,
        // 每页显示的数据量
        pageSize: 5,
        //数据的总数
        total: 0,
        //每页显示的数据量列表
        pageSizes: [5, 10, 15, 20],
      },
      selectpage: {
        selectVal: "",
        // 当前显示的页序号
        currentPage: 1,
        // 每页显示的数据量
        pageSize: 5,
        //数据的总数
        total: 0,
        //每页显示的数据量列表
        pageSizes: [5, 10, 15, 20],
      },
      //读者详细信息
      readerDetails: {
        // 控制读者消息框的显示与隐藏
        readerDialogVisible: false,
        id: 1,
        username: "无須終有!",
        avatarUrl:
          "https://thirdwx.qlogo.cn/mmopen/vi_32/1LToicIGtrovicjX2S65icG9Hal6KPP0PpINnSl794Qw78weibSYpsCH05PdjqW2PDAC8KrkBJOXYibIc1ftDU5jcYg/132",
        private: "aidjai",
      },
      editReaderDetails: {
        // 控制读者消息框的显示与隐藏
        editReaderDialogVisible: false,
        readerinfo: {
          id: 1,
          username: "无須終有!",
          avatarUrl:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/1LToicIGtrovicjX2S65icG9Hal6KPP0PpINnSl794Qw78weibSYpsCH05PdjqW2PDAC8KrkBJOXYibIc1ftDU5jcYg/132",
          private: "aidjai",
        },
        editReaderFormRules: {
          id: [{ required: true, message: "读者编号", trigger: "blur" }],
          username: [{ required: true, message: "读者昵称", trigger: "blur" }],
          avatarUrl: [{ required: true, message: "读者头像", trigger: "blur" }],
          private: [{ required: true, message: "读者隐私", trigger: "blur" }],
        },
      },
    };
  },
  methods: {
    //查询用户信息
    async onUserSelectHandle() {
      if(!this.selectpage.selectVal){
        this.$message.info("输入查询内容")
        return
      }
      await this.getUserListSelect()
    },
    //双击表格中的行复制行中内容
    onRowDblClickHandle(row) {
      let oInput = document.createElement("input");
      oInput.value = JSON.stringify(row);
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: "复制成功",
        type: "success",
      });
      oInput.remove();
    },
    //每页显示的数据量发生改变时触发这个函数
    async onHandleSizeChange(pageSize) {
      this.fenpage.pageSize = pageSize;
      await this.getUserList()
    },
    //切换页面时触发这个函数
    async onHandleCurrentChange(index) {
      this.fenpage.currentPage = index;
      await this.getUserList()
    },
    //搜索模式下每页显示的数据量发生改变时触发这个函数
    async onHandleSizeChangeSelect(pageSize) {
      this.selectpage.pageSize = pageSize;
      await this.getUserListSelect()
    },
    //搜索模式下切换页面时触发这个函数
    async onHandleCurrentChangeSelect(index) {
      this.selectpage.currentPage = index;
      await this.getUserListSelect()
    },
    //查看读者详细信息
    onDetailsShowHandle(row) {
      let { readerDetails } = this;
      this.readerDetails.readerDialogVisible = true;
      this.readerDetails = Object.assign({}, readerDetails, row);
    },
    //编辑读者信息
    onDetailsEditHandle(row) {
      let { editReaderDetails } = this;
      editReaderDetails.editReaderDialogVisible = true;
      editReaderDetails.readerinfo = { ...row };
    },
    //监听编辑读者信息消息框关闭
    onEditReaderCloseHandle() {
      let { editReaderDetails } = this;
      editReaderDetails.editReaderDialogVisible = false;
      this.$refs.editReaderFormRef.resetFields();
    },
    //提交修改的读者信息
    async onEditSubmitHandle(){
      let { readerinfo } = this.editReaderDetails;
      let bool=this.$refs.editReaderFormRef.validate().catch(err=>err);
      if(bool){
        let {data:res}=await this.$http.post("/edituserinfo",{userinfo:readerinfo});
        if(res.code===403){
          let { path } = this.$route;
          sessionStorage.removeItem("token");
          this.$router.push(`/login?redirect=${path}`);
          return 
        }
        if(res.code===200){
          this.onEditReaderCloseHandle();
          this.$message({
            type:"success",
            message:"修改读者信息成功"
          })
          if(this.pageBool){
            await this.getUserList();
            return
          }
          await this.getUserListSelect();
          return 
        }
        this.$message.error("修改读者信息失败");
      }
      
    },
    //删除读者信息
    async onDetailsDelHandle(row) {
      let bool=await this.$confirm('你确定要删除这条信息吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err=>err);
      if(bool==="cancel"){
        return 
      }
      let {data:res}=await this.$http.post("/deleteuserinfo",{userinfo:row});
      if(res.code===403){
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return 
      }
      if(res.code===200){
        this.$message({
            type:"success",
            message:"删除成功"
        });
        if(this.pageBool){
          await this.getUserList();
          return
        }
        await this.getUserListSelect();
        return 
      }
      this.$message.error("删除失败");
    },
    //获取用户的信息
    async getUserList(){
      this.listLoading=true
      let {data:res}=await this.$http.post("/getuserinfo",{
        currentPage:this.fenpage.currentPage,pageSize:this.fenpage.pageSize
      })
      if(res.code===403){
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      if(res.code===200){
        this.userlist=res.data.result
        this.fenpage.total=res.data.total
        this.listLoading=false
        return 
      }
      this.listLoading=false
      this.$message.error("获取读者信息失败")
    },
    async getUserListSelect(){
      let {selectpage}=this
      let obj={}
      if(Number(selectpage.selectVal)){
        obj.id=Number(selectpage.selectVal)
      }else{
        obj.username=selectpage.selectVal
      }
      let {data:res}=await this.$http.post("/getuserselect",{
        currentPage:selectpage.currentPage,pageSize:selectpage.pageSize,...obj
      })
      if(res.code===403){
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      if(res.code===200){
        if(res.data.result.length){
          this.userlist=res.data.result
          selectpage.total=res.data.total
          this.pageBool=false
          return 
        }
        this.$message.info("你要查找的读者信息不存在")
        return 
      }
      this.$message.error("获取读者信息失败")
    }
  },
  async created(){
    await this.getUserList()
  },
  watch:{
    async "selectpage.selectVal"(newVal){
      if(!newVal&&!this.pageBool){
        this.pageBool=true
        await this.getUserList()
      }
    }
  }
};
</script>
<style lang="scss">
.head {
  float: right;
  margin-top: 20px;
  .el-form-item {
    &:nth-child(2) {
      margin-right: 0px;
    }
  }
}
.title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.avat {
  display: flex;
  justify-content: center;
}
.el-table th.gutter {
  display: table-cell !important;
}
.page {
  margin-top: 10px;
}
.dialog {
  .el-row {
    margin: 20px 0;
    &:nth-child(1) {
      margin: 0px;
    }
    .img {
      display: flex;
      align-items: center;
    }
    .title {
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>

