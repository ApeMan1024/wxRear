<template>
  <div>
    <!-- 添加文章 -->
    <el-dialog
      title="添加文章"
      :visible.sync="dialogNewWenVisible"
      @close="onNewWenCloseHandle"
    >
      <el-form
        :model="newWenForm"
        label-width="100px"
        :rules="newWenFormRules"
        ref="newWenFormRef"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="文章标题:" prop="title">
              <el-input placeholder="文章标题" v-model="newWenForm.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章作者:" prop="author">
              <el-input placeholder="文章作者" v-model="newWenForm.author" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="文章类型:" prop="mold">
              <el-radio-group v-model="newWenForm.mold">
                <el-radio
                  :label="item.name"
                  v-for="item in moldList"
                  :key="item.id"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
              <el-button type="warning" size="mini" @click="newModlClickHandle"
                >新建类型</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文章图片:" prop="src1">
              <img-upload
                @upload="onUpLoadImgHandle"
                :imgbool="dialogNewWenVisible"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文章内容:" prop="filename">
              <file-upload
                @upload="onFileUploadHandle"
                :filebool="dialogNewWenVisible"
                @edit="onEditWenHandle"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-dialog
        width="30%"
        title="新建文章类型"
        :visible.sync="innerVisible"
        append-to-body
        @close="onCloseNewMoldHandle"
      >
        <el-form
          :model="newWenMoldForm"
          label-width="100px"
          :rules="newWenFormMoldRules"
          ref="newWenFormMoldRef"
        >
          <el-form-item label="文章类型" prop="name">
            <el-input placeholder="文章类型" v-model="newWenMoldForm.name" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onCloseNewMoldHandle" size="mini">取 消</el-button>
          <el-button type="primary" @click="onNewWenMoldHandle" size="mini"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 文章内容 -->
      <el-dialog
        title="文章内容"
        :visible.sync="nei.wenNeidialogVisible"
        width="50%"
        @close="onMarkdowmHandle"
        append-to-body
      >
        <markdown-editor v-model="nei.content1" height="400px" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="onMarkdowmHandle" size="mini">取 消</el-button>
          <el-button
            type="primary"
            @click="onWenNeiEditSubmitHandle"
            size="mini"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogNewWenVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="onSubmitNewWenHandle" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import imgUpload from "../imageUpload/imgUpload.vue";

import fileUpload from "../fileUpload/index";

import MarkdownEditor from "../../../components/MarkdownEditor";
export default {
  components: {
    imgUpload,
    fileUpload,
    MarkdownEditor,
  },
  props: {
    fuDialogNewWenVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogNewWenVisible: false,
      innerVisible: false,
      // 判断是自动关闭对话框，还是提交关闭
      submitBool: true,
      newWenForm: {
        title: "",
        author: "",
        mold: "",
        src1: "",
        filename: "",
      },
      newWenFormRules: {
        title: [{ required: true, message: "文章标题", trigger: "blur" }],
        author: [{ required: true, message: "文章作者", trigger: "blur" }],
        mold: [{ required: true, message: "文章类型", trigger: "blur" }],
        src1: [{ required: true, message: "文章图片", trigger: "blur" }],
        filename: [{ required: true, message: "文章内容", trigger: "blur" }],
      },
      newWenMoldForm: {
        name: "",
        num: 0,
      },
      newWenFormMoldRules: {
        name: [{ required: true, message: "文章类型", trigger: "blur" }],
      },
      moldList: [],
      nei: {
        content1: "",
        wenNeidialogVisible: false,
      },
    };
  },
  watch: {
    async fuDialogNewWenVisible(newVal) {
      if (newVal) {
        await this.getMoldList();
      }
      this.dialogNewWenVisible = newVal;
    },
  },
  methods: {
    //关闭文章消息框
    async onNewWenCloseHandle() {
      this.$emit("close");
      if (this.submitBool) {
        console.log(1)
        //消息框删除尚未提交文件
        await this.$http.post("/delfile", {
          filename: this.newWenForm.filename,
        });
        // 消息关闭删除尚未提交图片
        await this.$http.post("/delimg", {
          src1: this.newWenForm.src1,
        });
        this.$refs.newWenFormRef.resetFields();
      }
      this.submitBool=true
    },
    //图片上传成功时触发这个函数
    onUpLoadImgHandle(filename) {
      this.newWenForm.src1 = filename;
    },
    //获取文章类型列表
    async getMoldList() {
      let { data: res } = await this.$http.post("/getmold");
      if (res.code === 200) {
        this.moldList = res.data;
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
    //新建文章类型
    newModlClickHandle() {
      this.innerVisible = true;
    },
    //新建类型消息框关闭
    onCloseNewMoldHandle() {
      this.innerVisible = false;
      this.$refs.newWenFormMoldRef.resetFields();
    },
    //提交文章类型数据
    async onNewWenMoldHandle() {
      let { data: res } = await this.$http.post("/addmold", {
        newWenMoldForm: this.newWenMoldForm,
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
    //文章上传成功后触发这个函数
    onFileUploadHandle(filename) {
      let { newWenForm } = this;
      newWenForm.filename = filename;
    },
    //监听文章内容消息框关闭
    onMarkdowmHandle() {
      let { nei } = this;
      nei.wenNeidialogVisible = false;
    },
    //修改文章内容
    async onWenNeiEditSubmitHandle() {
      let { data: res } = await this.$http.post("/xiugaiwen", {
        filename: this.newWenForm.filename,
        md: this.nei.content1,
      });
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: "修改成功",
        });
        this.onMarkdowmHandle();
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
      this.$message.error("修改文章内容失败");
    },
    // 编辑文章内容
    async getWenNei() {
      let { data: res } = await this.$http.post("/getwennei", {
        filename: this.newWenForm.filename,
      });
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
      if (res.code === 200) {
        this.nei.content1 = res.data;
        return true;
      }
      this.$message.error("获取文章内容失败");
      return false;
    },
    //获取并打开文章浏览消息框
    async onEditWenHandle() {
      let bool = await this.getWenNei();
      if (bool) {
        this.nei.wenNeidialogVisible = true;
        return;
      }
      this.nei.wenNeidialogVisible = false;
    },
    async onSubmitNewWenHandle() {
      let boolValidate = await this.$refs.newWenFormRef
        .validate()
        .catch((err) => err);
      if (!boolValidate) {
        return;
      }
      this.newWenForm.time = this.getTime();
      let {data:res}=await this.$http.post("/addwen",{newWenForm:this.newWenForm})
      if(res.code===403){
        this.$message({
          message: "你尚未登录，请先登录",
          type: "warning",
        });
        let { path } = this.$route;
        sessionStorage.removeItem("token");
        this.$router.push(`/login?redirect=${path}`);
        return;
      }
      if(res.code===200){
        this.submitBool=false
        this.dialogNewWenVisible=false
        sessionStorage.removeItem("imgname")
        sessionStorage.removeItem("filename")
        this.$emit("shu")
        this.$message({
          type:"success",
          message:"添加文章成功"
        })
        return
      }
      this.$message.error("提交文章信息失败")
    },
    // 获取当前的时间
    getTime() {
      let date = new Date();
      let str = `${date.getFullYear()}-${(date.getMonth() + 1 + "").padStart(2,"0")}-${(date.getDate() + "").padStart(2, "0")}`
      return str;
    },
  },
};
</script>
<style lang="scss">
</style>