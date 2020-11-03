<template>
  <div class="app-container">
    <div class="header">
      <el-button type="primary" size="medium" @click="addClickWenHandle"
        >添加文章</el-button
      >
      <div class="select">
        <el-form :inline="true">
          <el-form-item>
            <el-input
              placeholder="输入查询内容"
              size="medium "
              v-model.trim="select.selectVal"
              @keyup.native.enter="onSelectHandle"
            />
          </el-form-item>
          <el-form-item
            ><el-button size="medium " type="success" @click="onSelectHandle" 
              >查询</el-button
            ></el-form-item
          >
        </el-form>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
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
      <el-table-column align="center" label="编号" width="50">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="文章编号" align="center">
        <template #default="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column label="文章标题" align="center">
        <template #default="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.title"
            placement="top"
          >
            <span class="title">{{ row.title }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="文章作者" align="center">
        <template #default="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章类型" align="center">
        <template #default="{ row }">
          {{ row.mold }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="文章浏览次数"
        align="center"
      >
        <template #default="{ row }">
          <el-tag :type="row.num | statusFilter">{{ row.num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="文章上传时间">
        <template #default="{ row }">
          <i class="el-icon-time" />
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="操作"
        width="220px"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="onDetailsClickHandle(row)"
            >详情</el-button
          >
          <el-button
            type="info"
            size="mini"
            @click="onEditDialogVisibleHandle(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="ondelDialogVisibleHandle(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        v-if="pagebool"
      >
      </el-pagination>
      <el-pagination
        @size-change="onHandleSizeChangeSelect"
        @current-change="onHandleCurrentChangeSelect"
        :current-page="select.currentPage"
        :page-sizes="select.pageSizes"
        :page-size="select.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="select.total"
        v-else
      >
      </el-pagination>
    </div>

    <div class="dialog">
      <!-- 文章的详细信息 -->
      <el-dialog
        title="文章详细信息"
        :visible.sync="wenDialog.WenDialogVisible"
      >
        <div class="details">
          <el-row>
            <el-col :span="12"
              ><span class="de-title">文章编号:</span
              ><span class="de-content">{{
                wenDialog.wenDetails.id
              }}</span></el-col
            >
            <el-col :span="12"
              ><span class="de-title">文章标题:</span
              ><span class="de-content">{{
                wenDialog.wenDetails.title
              }}</span></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="12"
              ><span class="de-title">作者:</span
              ><span class="de-content">{{
                wenDialog.wenDetails.author
              }}</span></el-col
            >
            <el-col :span="12"
              ><span class="de-title">上传时间:</span
              ><span class="de-content">{{
                wenDialog.wenDetails.time
              }}</span></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="12"
              ><span class="de-title">类型:</span
              ><span class="de-content">{{
                wenDialog.wenDetails.mold
              }}</span></el-col
            >
            <el-col :span="12"
              ><span class="de-title">浏览次数:</span
              ><span class="de-content">{{
                wenDialog.wenDetails.num
              }}</span></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="12" class="img"
              ><span class="de-title">评论详情:</span
              ><span class="de-content"
                ><el-button
                  type="primary"
                  size="mini"
                  @click="onShowPingHandle(wenDialog.wenDetails)"
                  >查看</el-button
                ></span
              ></el-col
            >
            <el-col :span="12" class="img"
              ><span class="de-title">文章内容:</span
              ><span class="de-content"
                ><el-button
                  type="success"
                  size="mini"
                  @click="onShowWenNeiHandle(wenDialog.wenDetails)"
                  >查看</el-button
                ></span
              ></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="12" class="img"
              ><span class="de-title">文章图片:</span
              ><span class="de-content">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="wenDialog.wenDetails.src1"
                  :preview-src-list="[wenDialog.wenDetails.src1]"
                >
                </el-image> </span
            ></el-col>
          </el-row>
        </div>
        <!-- 评论详情 -->
        <el-dialog
          width="50%"
          title="评论详情"
          :visible.sync="wenDialog.pingInnerVisible"
          append-to-body
        >
          <el-table
            v-loading="wenDialog.listLoading_de"
            element-loading-text="Loading"
            :data="wenDialog.pingList"
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
            <el-table-column label="编号" align="center">
              <template v-slot="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column label="评论编号" align="center">
              <template #default="{ row }">{{ row.id_1 }}</template>
            </el-table-column>
            <el-table-column label="评论内容" align="center">
              <template #default="{ row }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.nei"
                  placement="top"
                >
                  <span class="title">{{ row.nei }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="读者昵称" align="center">
              <template #default="{ row }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.name"
                  placement="top"
                >
                  <span class="title">{{ row.name }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="评论时间" align="center" width="120px">
              <template #default="{ row }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.time"
                  placement="top"
                >
                  <span class="title">
                    <i class="el-icon-time" />
                    <span>{{ row.time }}</span>
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="文章编号" align="center">
              <template #default="{ row }">
                <span>{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150px">
              <template #default="{ row }">
                <el-button
                  type="danger"
                  size="mini"
                  @click="onDelPingClickHandle(row)"
                  >删除</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  @click="onPingEditClickHandle(row)"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </el-dialog>
      <!-- 编辑评论信息 -->
      <el-dialog
        width="50%"
        title="编辑评论信息"
        :visible.sync="details.deDiaLogVisible"
        @close="onPingEditCloseHandle"
      >
        <div class="dia">
          <el-form :model="pingForm" label-width="100px" ref="pingFormRef">
            <el-row>
              <el-col :span="12">
                <el-form-item label="评论编号:" prop="id_1">
                  <el-tag size="mini">{{ pingForm.id_1 }}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文章编号:" prop="id">
                  <el-tag size="mini">{{ pingForm.id }}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="读者昵称:" prop="name">
                  <el-input
                    placeholder="读者昵称"
                    v-model="pingForm.name"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="评论时间:" prop="time">
                  <el-input
                    placeholder="评论时间"
                    v-model="pingForm.time"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="评论内容:" prop="nei">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="评论内容"
                    v-model="pingForm.nei"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onPingEditCloseHandle" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="onPingEditSubmitHandle" size="mini"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 新建文章 -->
      <new-wen
        :fuDialogNewWenVisible="addWenBool"
        @close="onAddWenCloseHandle"
        @shu="onShuXinHandle"
      />

      <el-dialog
        title="文章信息编辑"
        :visible.sync="editWenInfo.editDialogVisible"
        @close="onCloseEditMoldHandle"
      >
        <el-form
          :model="editWenInfo.editDataFormModel"
          label-width="100px"
          ref="editFormRef"
          :rules="editWenInfo.editDataFormModelRules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="文章编号:" prop="id">
                <el-tag type="primary">{{
                  editWenInfo.editDataFormModel.id
                }}</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文章标题:" prop="title">
                <el-input
                  placeholder="文章标题"
                  v-model="editWenInfo.editDataFormModel.title"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="文章类型:" prop="mold">
                <el-radio-group v-model="editWenInfo.editDataFormModel.mold">
                  <el-radio
                    :label="item.name"
                    v-for="item in editWenInfo.moldList"
                    :key="item.id"
                    >{{ item.name }}</el-radio
                  >
                </el-radio-group>
                <el-button
                  type="warning"
                  size="mini"
                  @click="newModlClickHandle"
                  >新建类型</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文章作者:" prop="author">
                <el-input
                  placeholder="文章作者"
                  v-model="editWenInfo.editDataFormModel.author"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="浏览次数:" prop="num">
                <el-input
                  placeholder="浏览次数"
                  v-model="editWenInfo.editDataFormModel.num"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="上传时间:" prop="time">
                <el-tag type="primary">{{
                  editWenInfo.editDataFormModel.time
                }}</el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="edit">
            <el-col :span="12" class="img"
              ><span class="de-title">文章图片:</span
              ><span class="de-content">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="editWenInfo.editDataFormModel.src1"
                  :preview-src-list="[editWenInfo.editDataFormModel.src1]"
                >
                </el-image> </span
            ></el-col>
          </el-row>
        </el-form>
        <el-dialog
          width="30%"
          title="新建文章类型"
          :visible.sync="editWenInfo.innerVisible"
          append-to-body
          @close="onCloseNewMoldHandle"
        >
          <el-form
            :model="editWenInfo.newWenMoldForm"
            label-width="100px"
            :rules="editWenInfo.newWenFormMoldRules"
            ref="newWenFormMoldRef"
          >
            <el-form-item label="文章类型" prop="name">
              <el-input
                placeholder="文章类型"
                v-model="editWenInfo.newWenMoldForm.name"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="onCloseNewMoldHandle" size="mini"
              >取 消</el-button
            >
            <el-button type="primary" @click="onNewWenMoldHandle" size="mini"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onCloseEditMoldHandle" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="onEditWenMoldHandle" size="mini"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MarkdownEditor from "../../components/MarkdownEditor";
import newWen from "./newWen/newWen";
export default {
  filters: {
    statusFilter(status) {
      if (status < 2) {
        return "danger";
      }
      if (status % 2 === 0) {
        return "success";
      }
      return "gray";
    },
  },
  components: {
    MarkdownEditor,
    newWen,
  },
  data() {
    return {
      list: null,
      listLoading: true,
      pagebool: true,
      //当前的页数
      currentPage: 1,
      // 每页显示的条数数组
      pageSizes: [10, 15, 20, 30],
      //每页显示的条数
      pageSize: 10,
      //数据的总数
      total: 20,

      wenDialog: {
        WenDialogVisible: false,
        wenDetails: {},
        pingInnerVisible: false,
        pingList: [],
        listLoading_de: true,
      },
      details: {
        deDiaLogVisible: false,
      },
      // 评论消息编辑对象
      pingForm: {
        //评论编号
        id_1: "",
        //文章编号
        id: "",
        //读者昵称
        name: "",
        //评论内容
        nei: "",
        //评论发表时间
        time: "",
      },
      addWenBool: false,

      editWenInfo: {
        editDialogVisible: false,
        innerVisible: false,
        editDataFormModel: {
          author: "小值",
          id: 26,
          mold: "github",
          num: 3,
          src1: "images/wen/lun1_1602434173019.jpg",
          time: "2020-10-12",
          title: "git分支",
        },
        editDataFormModelRules:{
          author:[
            {required:true,message:"文章作者",trigger:"blur"}
          ],
          id:[
            {required:true,message:"文章编号",trigger:"blur"}
          ],
          mold:[
            {required:true,message:"文章类型",trigger:"blur"}
          ],
          num:[
            {required:true,message:"浏览次数",trigger:"blur"}
          ],
          src1:[
            {required:true,message:"文章图片",trigger:"blur"}
          ],
          time:[
            {required:true,message:"文章时间",trigger:"blur"}
          ],
          title:[
            {required:true,message:"文章标题",trigger:"blur"}
          ],
        },
        moldList: [],
        newWenMoldForm: {
          name: "",
          num: 0,
        },
        newWenFormMoldRules: {
          name: [{ required: true, message: "文章类型", trigger: "blur" }],
        },
      },
      select: {
        //查询内容
        selectVal: "",
        //当前的页数
        currentPage: 1,
        // 每页显示的条数数组
        pageSizes: [10, 15, 20, 30],
        //每页显示的条数
        pageSize: 10,
        //数据的总数
        total: 20,
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.listLoading = true;
      let { data: res } = await this.$http
        .post("/wen", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        })
        .catch((err) => err);
      if (res.code === 200) {
        let { data: result } = res;
        this.total = result.total;
        this.list = result.wen;
        this.listLoading = false;
        return;
      }
      this.$message.error("获取数据失败");
      this.listLoading = false;
    },
    //每页显示的数据数目改变时，触发这个函数
    async onHandleSizeChange(pageSize) {
      this.pageSize = pageSize;
      await this.fetchData();
    },
    //切换页面时触发这个函数
    async onHandleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      await this.fetchData();
    },
    //表格的某一行被双击时触发这个函数
    onRowDblClickHandle(row, column, event) {
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
    //点击详情按钮显示文章详情信息
    onDetailsClickHandle(row) {
      let { wenDialog } = this;
      wenDialog.WenDialogVisible = true;
      row.src1 = this.$http.defaults.baseURL + "/" + row.src1;
      wenDialog.wenDetails = row;
    },
    //查看评论详情
    async onShowPingHandle(row) {
      let { id } = row;
      let { wenDialog } = this;
      wenDialog.listLoading_de = true;
      wenDialog.pingInnerVisible = true;
      let { data: res } = await this.$http
        .post("/wenmd", { id })
        .catch((err) => err);
      if (res.code === 200) {
        wenDialog.pingList = res.data.pings;
        wenDialog.listLoading_de = false;
        return;
      }
      this.$message.error("获取评论数据失败");
      wenDialog.listLoading_de = false;
      wenDialog.pingInnerVisible = false;
    },
    //查看文章内容
    async onShowWenNeiHandle(row) {
      this.$router.push({
        name: "browse",
        params: {
          row,
        },
      });
    },
    //编辑评论信息
    onPingEditClickHandle(row) {
      this.pingForm = row;
      this.details.deDiaLogVisible = true;
    },
    //评论编辑消息框关闭时触发这个函数
    onPingEditCloseHandle() {
      this.details.deDiaLogVisible = false;
      // 对表单的字段进行重置
      this.$refs.pingFormRef.resetFields();
    },
    //修改评论信息
    async onPingEditSubmitHandle() {
      let { pingForm } = this;
      let { data: res } = await this.$http.post("/editping", { pingForm });
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: "修改成功",
        });
        this.details.deDiaLogVisible = false;
        // 刷新评论数据
        await this.onShowPingHandle(pingForm);
        return;
      }
      if (res.code === 403) {
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      this.$message.error("修改评论数据失败");
    },
    //删除评论信息
    async onDelPingClickHandle(pingForm) {
      let bool = await this.$confirm(
        "此操作将永久删除该评论信息, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (bool !== "cancel") {
        let { data: res } = await this.$http.post("/delping", {
          id_1: pingForm.id_1,
        });
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.details.deDiaLogVisible = false;
          // 刷新评论数据
          await this.onShowPingHandle(pingForm);
          return;
        }
        if (res.code === 403) {
          this.$message({
            message: "你尚未登录，请先登录",
            type: "warning",
          });
          let { path } = this.$route;
          sessionStorage.removeItem("token");
          this.$router.push(`/login?redirect=${path}`);
          return;
        }
        this.$message.error("删除评论数据失败");
      }
    },

    //打开添加文章消息框
    addClickWenHandle() {
      this.addWenBool = true;
    },
    //关闭添加文章消息框
    onAddWenCloseHandle() {
      this.addWenBool = false;
    },
    //刷新文章列表
    async onShuXinHandle() {
      await this.fetchData();
    },
    //新建类型消息框关闭
    onCloseNewMoldHandle() {
      this.editWenInfo.innerVisible = false;
      this.$refs.newWenFormMoldRef.resetFields();
    },
    //新建文章类型
    newModlClickHandle() {
      this.editWenInfo.innerVisible = true;
    },
    //获取文章类型列表
    async getMoldList() {
      let { data: res } = await this.$http.post("/getmold");
      if (res.code === 200) {
        this.editWenInfo.moldList = res.data;
        return;
      }
      if (res.code === 403) {
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      this.$message.error("获取文章类型失败");
    },
    //提交文章类型数据
    async onNewWenMoldHandle() {
      let { data: res } = await this.$http.post("/addmold", {
        newWenMoldForm: this.editWenInfo.newWenMoldForm,
      });
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: "添加文章类型成功",
        });
        this.onCloseNewMoldHandle();
        await this.getMoldList();
        return;
      }
      this.$message.error("添加文章类型失败");
    },
    //打开文章编辑消息框
    async onEditDialogVisibleHandle(row) {
      this.editWenInfo.editDataFormModel = { ...row };
      this.editWenInfo.editDataFormModel.src1 =
        this.$http.defaults.baseURL + "/" + row.src1;
      await this.getMoldList();
      this.editWenInfo.editDialogVisible = true;
    },
    //监听文章编辑消息框关闭
    onCloseEditMoldHandle() {
      this.$refs.editFormRef.resetFields();
      this.editWenInfo.editDialogVisible = false;
    },
    //修改文章编辑信息
    async onEditWenMoldHandle() {
      let { editWenInfo } = this;
      let wen = editWenInfo.editDataFormModel;
      let { data: res } = await this.$http.post("/editwen", { wen });
      if (res.code === 403) {
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
      }
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: "修改文章信息成功",
        });
        this.onCloseEditMoldHandle();
        this.onShuXinHandle();
        return;
      }

      this.$message.error("修改文章信息失败");
    },
    //删除文章
    async ondelDialogVisibleHandle(row) {
      let { data: res } = await this.$http.post("/rootdelwen", { wen: row });
      if (res.code === 403) {
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: "删除文章成功",
        });
        await this.onShuXinHandle();
        return;
      }
      this.$message.error("删除文章失败");
    },
    //搜索分页切换页面时触发这个函数
    async onHandleCurrentChangeSelect(currentPage) {
      let { select } = this;
      select.currentPage = currentPage;
      await this.getFenNei();
    },
    //搜索分页每页显示的条数发生改变触发这个函数
    async onHandleSizeChangeSelect(index) {
      let { select } = this;
      select.pageSize = index;
      await this.getFenNei();
    },
    //查询文章内容
    async onSelectHandle() {
      this.pagebool = false;
      await this.getFenNei();
    },
    //获取查询的文章内容
    async getFenNei() {
      let { select } = this;
      let obj = {};
      if (Number(select.selectVal)) {
        obj.id = select.selectVal;
      } else {
        obj.mode = select.selectVal;
      }
      obj.currentPage = select.currentPage;
      obj.pageSize = select.pageSize;
      let { data: res } = await this.$http.post("/selectwen", obj);
      if (res.code === 403) {
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      if (res.code === 200) {
        if (res.data.result.length) {
          this.list = res.data.result;
          this.select.total = res.data.total;
          return 
        }
        this.$message.info("没有查到任何内容")
        return 
      }
      this.$message.error("查询失败")
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      if (sessionStorage.getItem("filename")) {
        //消息框删除尚未提交文件
        await vm.$http.post("/delfile", {
          filename: sessionStorage.getItem("filename"),
        });
        sessionStorage.removeItem("filename");
      }
      if (sessionStorage.getItem("imgname")) {
        // 消息关闭删除尚未提交图片
        await vm.$http.post("/delimg", {
          src1: sessionStorage.getItem("imgname"),
        });
        sessionStorage.removeItem("imgname");
      }
    });
  },
  watch:{
    async "select.selectVal"(newSelectVal){
      if(!newSelectVal){
        this.pagebool=true
        await this.onShuXinHandle()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  margin-top: 10px;
}
.el-table th.gutter {
  display: table-cell !important;
}
.title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.de-title {
  font-weight: bold;
  margin-right: 5px;
  font-size: 16px;
}
.details {
  .el-row {
    margin: 20px 0;
    &:nth-child(1) {
      margin-top: 0px;
    }
    .img {
      display: flex;
      align-items: center;
    }
  }
}
.edit {
  margin-left: 27px;
  .img {
    display: flex;
    align-items: center;
  }
}
.header {
  margin-bottom: 20px;
}
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
</style>
